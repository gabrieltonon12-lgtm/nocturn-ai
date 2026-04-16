import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const PLANS = [
  {
    name: 'Starter', price: 47, credits: 20,
    url: 'https://pay.cakto.com.br/8euvzxd',
    color: '#059669', popular: false, perVideo: '2,35',
    features: ['20 vídeos / mês', 'YouTube + TikTok + Shorts', 'Roteiro GPT-4o', 'Voz IA PT-BR', 'Download .webm', 'Garantia 7 dias'],
  },
  {
    name: 'Pro', price: 97, credits: 100,
    url: 'https://pay.cakto.com.br/37beu86',
    color: '#C5183A', popular: true, perVideo: '0,97',
    features: ['100 vídeos / mês', 'Todas as plataformas', 'Formato vertical 9:16', 'Voz personalizada', 'Suporte prioritário', 'Garantia 7 dias'],
  },
  {
    name: 'Enterprise', price: 297, credits: 99999,
    url: 'https://pay.cakto.com.br/izhvx9t',
    color: '#7C3AED', popular: false, perVideo: '—',
    features: ['Vídeos ilimitados', 'Multi-usuário', 'API + webhooks', 'White-label', 'Gerente dedicado', 'Garantia 7 dias'],
  },
]

const FAQS = [
  { q: 'Preciso aparecer na câmera ou ter experiência com vídeo?', a: 'Não. Esse é exatamente o ponto. Você não aparece, não grava nada, não precisa de câmera, microfone ou software de edição. A IA faz tudo — roteiro, voz e montagem.' },
  { q: 'O que ganho ao criar conta?', a: '1 vídeo grátis, sem precisar de cartão. Você cria a conta, gera um vídeo completo com narração e imagens, baixa e publica — antes de gastar qualquer centavo.' },
  { q: 'O conteúdo gerado é original?', a: 'Todo roteiro é criado do zero pelo GPT-4o com base no seu tema. Não é cópia de nenhum canal existente. As imagens vêm do Pexels com licença comercial.' },
  { q: 'Funciona para monetização no YouTube?', a: 'Sim. Os vídeos seguem as diretrizes do YouTube. Canais faceless de dark content são um dos nichos que mais crescem e mais monetizam na plataforma atualmente.' },
  { q: 'Quanto tempo leva para gerar um vídeo?', a: 'Menos de 3 minutos. Você digita o tema, clica em gerar, e em menos de 3 minutos tem roteiro + narração + imagens + player pronto para baixar e publicar.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim, sem burocracia. Cancele a qualquer momento direto pelo painel. E se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do valor.' },
  { q: 'Quantos canais posso criar com uma conta?', a: 'Sem limite. Com uma conta Pro, você pode criar 100 vídeos por mês e distribuir entre quantos canais quiser — YouTube, TikTok, Instagram, Shorts.' },
]

const TESTIMONIALS = [
  { name: 'Rafael M.', role: 'Criador · Canal True Crime', avatar: 'R', color: '#C5183A', text: 'Criei 3 canais em 6 semanas sem aparecer em nenhum. O canal maior já tem 12 mil inscritos. Jamais teria conseguido produzindo manualmente.', metric: '12k inscritos em 6 semanas' },
  { name: 'Camila R.', role: 'Criadora · Canal Mistério', avatar: 'C', color: '#7C3AED', text: 'Testei outras ferramentas mas o roteiro saía genérico. Aqui o GPT-4o gera algo que parece escrito por um roteirista de verdade. A voz é assustadoramente boa.', metric: '47 vídeos no 1º mês' },
  { name: 'Diego S.', role: 'Criador · Dark Finance', avatar: 'D', color: '#059669', text: 'R$4.200 no terceiro mês. Ainda não acredito. Trabalho 20 minutos por dia só escolhendo temas. O resto a IA resolve.', metric: 'R$4.200 no 3º mês' },
  { name: 'Thiago P.', role: 'Criador · Conspirações BR', avatar: 'T', color: '#D97706', text: 'Era editor freelancer cobrando R$400 por vídeo. Hoje meu canal faceless gera mais do que meus clientes me pagavam. Essa ferramenta destruiu meu emprego de um jeito bom.', metric: '8 canais ativos simultâneos' },
]

const LIVE_EVENTS = [
  { name: 'João G.', city: 'São Paulo', action: 'acabou de gerar um vídeo sobre Illuminati' },
  { name: 'Ana L.', city: 'Rio de Janeiro', action: 'alcançou 10k views no TikTok' },
  { name: 'Pedro M.', city: 'Curitiba', action: 'criou seu 1º dark channel' },
  { name: 'Mariana S.', city: 'BH', action: 'gerou 5 vídeos hoje' },
  { name: 'Lucas R.', city: 'Porto Alegre', action: 'assinou o plano Pro' },
  { name: 'Carla F.', city: 'Brasília', action: 'monetizou o canal em 30 dias' },
  { name: 'Bruno T.', city: 'Salvador', action: 'gerou vídeo de true crime' },
  { name: 'Fernanda K.', city: 'Recife', action: 'atingiu 5k inscritos' },
  { name: 'Rodrigo A.', city: 'Fortaleza', action: 'baixou seu 3º vídeo hoje' },
  { name: 'Juliana C.', city: 'Florianópolis', action: 'gerou vídeo de mistério' },
]

// ── Countdown urgency banner ──────────────────────────────────────────────────
function CountdownBanner() {
  const [time, setTime] = useState({ h: 23, m: 59, s: 59 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const now = new Date()
      const end = new Date(); end.setHours(23, 59, 59, 0)
      const diff = Math.max(0, end.getTime() - now.getTime())
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  if (!mounted) return null
  const p = (n: number) => n.toString().padStart(2, '0')
  return (
    <div style={{ background: 'linear-gradient(90deg,#6B0A1C,#C5183A,#6B0A1C)', padding: '10px 20px', textAlign: 'center', fontSize: '13px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <span>🔥 Oferta de lançamento — <strong>1 vídeo GRÁTIS</strong> ao criar conta · Expira em</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", background: 'rgba(0,0,0,.3)', padding: '2px 8px', borderRadius: '5px', fontSize: '13px', letterSpacing: '0.04em' }}>
        {p(time.h)}:{p(time.m)}:{p(time.s)}
      </span>
      <Link href="/register" style={{ color: '#FFE55C', fontWeight: 700, textDecoration: 'underline', fontSize: '13px' }}>Pegar meu crédito grátis →</Link>
    </div>
  )
}

// ── Live social proof notifications ──────────────────────────────────────────
function LiveNotification() {
  const [visible, setVisible] = useState(false)
  const [ev, setEv] = useState(LIVE_EVENTS[0])
  useEffect(() => {
    const show = () => {
      setEv(LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)])
      setVisible(true)
      setTimeout(() => setVisible(false), 5000)
    }
    const delay = setTimeout(show, 5000)
    const id = setInterval(show, 20000)
    return () => { clearTimeout(delay); clearInterval(id) }
  }, [])
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '20px', zIndex: 999, background: '#080D1A', border: '1px solid #203050', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,.7)', animation: 'fadeUp .3s ease', maxWidth: '300px', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#C5183A,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>🎬</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ECF2FA', lineHeight: 1.35 }}>{ev.name} <span style={{ color: '#6E8099', fontWeight: 400 }}>de {ev.city}</span></div>
        <div style={{ fontSize: '11px', color: '#6E8099', marginTop: '2px' }}>{ev.action}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', marginTop: '3px' }}>agora mesmo · NOCTURN.AI</div>
      </div>
    </div>
  )
}

// ── Sticky bottom CTA ─────────────────────────────────────────────────────────
function StickyCtaBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 998, background: 'rgba(5,8,15,.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid #192436', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6E8099' }}>1 vídeo grátis · sem cartão · cancele quando quiser</span>
      <Link href="/register" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '10px 32px', borderRadius: '9px', fontWeight: 700, fontSize: '14px', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.01em', boxShadow: '0 4px 20px rgba(197,24,58,.4)' }}>
        Começar grátis agora →
      </Link>
    </div>
  )
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#080D1A', border: `1px solid ${open ? 'rgba(197,24,58,.25)' : '#192436'}`, borderRadius: '12px', padding: '20px 24px', cursor: 'pointer', transition: 'border-color .15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 600, color: '#ECF2FA', letterSpacing: '-0.02em', lineHeight: 1.4 }}>{q}</div>
        <div style={{ color: open ? '#C5183A' : '#364A62', fontSize: '20px', flexShrink: 0, transition: 'color .15s, transform .15s', transform: open ? 'rotate(45deg)' : 'none' }}>+</div>
      </div>
      {open && <div style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.75, marginTop: '14px' }}>{a}</div>}
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    const dur = 1800, step = 16
    const inc = target / (dur / step)
    let cur = 0
    const id = setInterval(() => { cur = Math.min(cur + inc, target); setVal(Math.floor(cur)); if (cur >= target) clearInterval(id) }, step)
    return () => clearInterval(id)
  }, [started, target])
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    const el = document.getElementById('stats-section')
    if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <>{val.toLocaleString('pt-BR')}{suffix}</>
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Head>
        <title>NOCTURN.AI — Crie Dark Channels com IA em 3 Minutos</title>
        <meta name="description" content="1 vídeo grátis ao criar conta. Roteiro, voz e edição automáticos — sem câmera, sem aparecer, sem experiência." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="NOCTURN.AI — Dark Channels com IA" />
        <meta property="og:description" content="Você digita. A IA publica. Dark channel em menos de 3 minutos." />
      </Head>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        a { text-decoration:none; }
        .cta-red { transition: box-shadow .18s, transform .15s !important; }
        .cta-red:hover { box-shadow: 0 12px 48px rgba(197,24,58,.55) !important; transform: translateY(-2px) !important; }
        .ghost-btn:hover { border-color: #364A62 !important; color: #ECF2FA !important; }
        .plan-card { transition: border-color .18s, transform .18s, box-shadow .18s !important; }
        .plan-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 60px rgba(0,0,0,.4) !important; }
        .pain-item { transition: border-color .18s, background .18s !important; }
        .pain-item:hover { border-color: rgba(197,24,58,.3) !important; background: rgba(197,24,58,.03) !important; }
        .testimonial-card { transition: border-color .18s, transform .18s !important; }
        .testimonial-card:hover { transform: translateY(-3px) !important; border-color: #203050 !important; }
        .step-card { transition: border-color .18s !important; }
        .step-card:hover { border-color: rgba(197,24,58,.2) !important; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.35} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes ticker { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
      `}</style>

      <LiveNotification />
      <StickyCtaBar />

      <div style={{ background: '#02040A', color: '#ECF2FA', fontFamily: "'Inter',system-ui,sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

        {/* AMBIENT */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-25%', left: '-5%', width: '900px', height: '900px', background: 'radial-gradient(circle,rgba(197,24,58,.06) 0%,transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '800px', height: '800px', background: 'radial-gradient(circle,rgba(124,58,237,.05) 0%,transparent 60%)' }} />
        </div>

        {/* ── NAV ── */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,4,10,.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #192436' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#fff', fontSize: '13px', boxShadow: '0 2px 10px rgba(197,24,58,.35)' }}>N</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '-0.03em' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="#planos" className="ghost-btn" style={{ color: '#6E8099', fontSize: '13px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', border: '1px solid #192436', transition: 'all .15s' }}>Planos</Link>
              <Link href="/login" className="ghost-btn" style={{ color: '#6E8099', fontSize: '13px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', border: '1px solid #192436', transition: 'all .15s' }}>Entrar</Link>
              <Link href="/register" className="cta-red" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '7px 18px', borderRadius: '8px', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 4px 18px rgba(197,24,58,.3)' }}>
                1 vídeo grátis →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '96px 24px 80px', maxWidth: '840px', margin: '0 auto' }}>

          {/* Social proof pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.18)', color: '#059669', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, marginBottom: '28px', fontFamily: "'JetBrains Mono',monospace" }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,.8)', animation: 'pulse 2s infinite' }} />
            +847 criadores ativos · R$4.200/mês de média
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(44px,7.5vw,86px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.048em', marginBottom: '22px', color: '#ECF2FA' }}>
            Você digita.<br />
            <span style={{ color: '#C5183A' }}>A IA publica.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#6E8099', lineHeight: 1.6, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
            Dark channel completo em <strong style={{ color: '#ECF2FA' }}>menos de 3 minutos</strong>.<br />
            Roteiro + narração + vídeo. Sem câmera. Sem aparecer.
          </p>

          {/* Primary CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Link href="/register" className="cta-red" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '18px 52px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 8px 40px rgba(197,24,58,.42)' }}>
              Gerar meu 1º vídeo grátis →
            </Link>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Sem cartão', '1 vídeo grátis', 'Cancele quando quiser'].map((t, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#364A62', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Trust logos row */}
          <div style={{ marginTop: '52px', display: 'flex', justifyContent: 'center', gap: '32px', alignItems: 'center', flexWrap: 'wrap', opacity: 0.5 }}>
            {['GPT-4o', 'OpenAI TTS', 'Pexels API', 'WebM Export', 'PT-BR'].map((t, i) => (
              <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#6E8099', letterSpacing: '0.08em', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </section>

        {/* ── ANTES vs DEPOIS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>Realidade vs IA</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>
              O mesmo vídeo.<br /><span style={{ color: '#6E8099' }}>Dois mundos diferentes.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', border: '1px solid #192436', borderRadius: '20px', overflow: 'hidden' }}>
            {/* Antes */}
            <div style={{ background: '#080D1A', padding: '32px 28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 600 }}>Sem NOCTURN.AI</div>
              {[
                { label: 'Roteiro', val: '3–4 horas', icon: '✍️' },
                { label: 'Narração', val: 'Microfone + estúdio', icon: '🎙️' },
                { label: 'Edição', val: '4–8 horas no CapCut', icon: '🎬' },
                { label: 'Freelancer', val: 'R$200–500 por vídeo', icon: '💸' },
                { label: 'Frequência', val: '1 vídeo por semana', icon: '📅' },
                { label: 'Custo mensal', val: 'R$1.000–2.000+', icon: '❌' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#364A62', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#6E8099', fontWeight: 500, marginTop: '2px' }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* VS divider */}
            <div style={{ background: '#02040A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', borderLeft: '1px solid #192436', borderRight: '1px solid #192436' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 800, color: '#364A62', letterSpacing: '-0.02em', writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>VS</div>
            </div>

            {/* Depois */}
            <div style={{ background: 'linear-gradient(135deg,rgba(197,24,58,.04),rgba(124,58,237,.03))', padding: '32px 28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 600 }}>Com NOCTURN.AI</div>
              {[
                { label: 'Roteiro', val: '30 segundos — GPT-4o', icon: '⚡' },
                { label: 'Narração', val: 'OpenAI TTS automático', icon: '🤖' },
                { label: 'Edição', val: 'Zero — gerado com IA', icon: '✅' },
                { label: 'Freelancer', val: 'Não precisa', icon: '🎯' },
                { label: 'Frequência', val: 'Ilimitado no Enterprise', icon: '🚀' },
                { label: 'Custo mensal', val: 'A partir de R$47/mês', icon: '💚' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#C5183A', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#ECF2FA', fontWeight: 600, marginTop: '2px' }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOR ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>O problema</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA', maxWidth: '620px', margin: '0 auto' }}>
              Você sabe que dark channels faturam.<br />
              <span style={{ color: '#6E8099' }}>O problema é a execução.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '10px' }}>
            {[
              { icon: '😰', title: 'Aparecer na câmera não é opção', desc: 'Privacidade, timidez ou preferência. Mas todos os tutoriais ensinam a aparecer.' },
              { icon: '⏳', title: 'Editar vídeo leva horas', desc: 'CapCut, Premiere, DaVinci. Curva enorme para um vídeo de 10 minutos.' },
              { icon: '✍️', title: 'Roteiro é a parte mais difícil', desc: 'Gancho, estrutura, ritmo — escrever roteiro é uma habilidade separada.' },
              { icon: '💸', title: 'Contratar editor custa caro', desc: 'R$200–500 por vídeo. Para 3 vídeos por semana, inviabiliza o negócio.' },
              { icon: '🎙️', title: 'Locução profissional é inacessível', desc: 'Microfone, tratamento acústico, horas de gravação para uma voz decente.' },
              { icon: '📉', title: 'Consistência é impossível', desc: 'Produção manual não escala. Um criador sozinho consegue 1–2 vídeos por semana.' },
            ].map((item, i) => (
              <div key={i} className="pain-item" style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '14px', padding: '22px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 700, color: '#ECF2FA', letterSpacing: '-0.02em', marginBottom: '5px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#6E8099', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NÚMEROS ── */}
        <section id="stats-section" style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #192436' }}>
            {[
              { value: '< 3min', label: 'por vídeo', sub: 'do prompt ao arquivo' },
              { value: '2.4M+', label: 'views geradas', sub: 'pelos nossos criadores' },
              { value: 'R$0,97', label: 'por vídeo', sub: 'no plano Pro' },
              { value: '7 dias', label: 'de garantia', sub: 'devolução total, sem perguntas' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#080D1A', padding: '28px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid #192436' : 'none' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: '#ECF2FA', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#C5183A', marginBottom: '3px' }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>Como funciona</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>Três passos.<br />Um vídeo publicado.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'start', gap: '0' }}>
            {[
              { n: '01', icon: '✍️', title: 'Digite o tema', desc: 'Qualquer nicho dark: conspiração, true crime, mistério, crypto, terror. Em português, sem precisar saber inglês.' },
              { n: '02', icon: '⚡', title: 'IA trabalha por você', desc: 'GPT-4o escreve o roteiro. TTS gera a voz grave. Pexels busca imagens por cena. Tudo automático em 2 minutos.' },
              { n: '03', icon: '🎬', title: 'Baixe e publique', desc: 'Player com legenda karaoke sincronizada, narração e download. Pronto para YouTube, TikTok e Reels.' },
            ].map((step, i) => (
              <>
                <div key={step.n} className="step-card" style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '16px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '64px', fontWeight: 800, color: 'rgba(197,24,58,.05)', position: 'absolute', bottom: '-10px', right: '12px', lineHeight: 1, pointerEvents: 'none' }}>{step.n}</div>
                  <div style={{ fontSize: '28px', marginBottom: '14px', lineHeight: 1 }}>{step.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '-0.025em', color: '#ECF2FA', marginBottom: '8px' }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: '#6E8099', lineHeight: 1.7 }}>{step.desc}</div>
                </div>
                {i < 2 && (
                  <div key={`arr-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', paddingTop: '28px' }}>
                    <div style={{ color: '#364A62', fontSize: '22px' }}>→</div>
                  </div>
                )}
              </>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/register" className="cta-red" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '14px 40px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 6px 28px rgba(197,24,58,.35)' }}>
              Testar agora — é de graça →
            </Link>
          </div>
        </section>

        {/* ── DEPOIMENTOS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>Resultados reais</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>O que os criadores estão fazendo.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: '#D97706', fontSize: '12px' }}>★</span>)}</div>
                <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.75, flex: 1, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ background: `rgba(${t.color === '#C5183A' ? '197,24,58' : t.color === '#7C3AED' ? '124,58,237' : t.color === '#D97706' ? '217,119,6' : '5,150,105'},.08)`, border: `1px solid ${t.color}30`, borderRadius: '8px', padding: '8px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: t.color, fontWeight: 700, textAlign: 'center' }}>{t.metric}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #192436', paddingTop: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg,${t.color},#02040A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', fontWeight: 700, color: '#ECF2FA', letterSpacing: '-0.01em' }}>{t.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', marginTop: '1px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="planos" style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>Planos</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA', marginBottom: '12px' }}>1 crédito = 1 vídeo completo</h2>
            <p style={{ fontSize: '14px', color: '#6E8099' }}>Roteiro + voz + edição. Renova todo mês. Sem fidelidade.</p>
            {/* Urgency badge */}
            <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,24,58,.08)', border: '1px solid rgba(197,24,58,.2)', color: '#C5183A', padding: '6px 16px', borderRadius: '20px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 600 }}>
              <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#C5183A' }} />
              Preço de lançamento · Pode subir a qualquer momento
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '24px' }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="plan-card" style={{ background: '#080D1A', border: `1px solid ${plan.popular ? 'rgba(197,24,58,.4)' : '#192436'}`, borderRadius: '18px', padding: '28px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: plan.popular ? '0 0 60px rgba(197,24,58,.09)' : 'none' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 18px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '0.08em', boxShadow: '0 4px 14px rgba(197,24,58,.4)' }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: plan.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '44px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: '#ECF2FA' }}>R${plan.price}</span>
                  <span style={{ fontSize: '13px', color: '#364A62' }}>/mês</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#6E8099', marginBottom: '20px' }}>
                  {plan.credits === 99999 ? 'vídeos ilimitados' : `R$${plan.perVideo} por vídeo`}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '22px', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: '13px', color: '#6E8099', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: plan.color, fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.url} className={plan.popular ? 'cta-red' : ''} style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.02em', background: plan.popular ? 'linear-gradient(135deg,#C5183A,#8B0A22)' : 'transparent', border: plan.popular ? 'none' : `1px solid ${plan.color}`, color: plan.popular ? '#fff' : plan.color, boxShadow: plan.popular ? '0 4px 20px rgba(197,24,58,.3)' : 'none', marginBottom: '10px', transition: 'opacity .15s' }}>
                  Assinar {plan.name} →
                </a>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textAlign: 'center' }}>
                  7 dias garantia · cancele quando quiser
                </div>
              </div>
            ))}
          </div>

          {/* Free trial CTA below plans */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <Link href="/register" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#6E8099', borderBottom: '1px solid #364A62', paddingBottom: '1px' }}>
              Não quer pagar ainda? Comece com 1 vídeo grátis →
            </Link>
          </div>
        </section>

        {/* ── GARANTIA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,.06),rgba(5,150,105,.02))', border: '1px solid rgba(5,150,105,.2)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px', lineHeight: 1 }}>🛡️</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#ECF2FA', marginBottom: '14px', lineHeight: 1.15 }}>Garantia incondicional de 7 dias</h2>
            <p style={{ fontSize: '14px', color: '#6E8099', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 20px' }}>
              Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias — <strong style={{ color: '#ECF2FA' }}>devolvemos 100% do valor, sem perguntas, sem formulário</strong>. Reembolso em até 48h.
            </p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Reembolso em 48h', 'Sem burocracia', 'Sem perguntas'].map((t, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>✓</span>{t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500 }}>Dúvidas</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 140px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(160deg,rgba(197,24,58,.09),rgba(124,58,237,.05))', border: '1px solid rgba(197,24,58,.22)', borderRadius: '24px', padding: '72px 40px', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(197,24,58,.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 500, position: 'relative' }}>Comece hoje</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.05, marginBottom: '16px', color: '#ECF2FA', position: 'relative' }}>
              Seu canal começa<br /><span style={{ color: '#C5183A' }}>agora.</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#6E8099', marginBottom: '36px', lineHeight: 1.6, position: 'relative' }}>
              Sem câmera. Sem aparecer. Sem experiência.<br />
              <strong style={{ color: '#ECF2FA' }}>1 vídeo grátis para você testar agora.</strong>
            </p>
            <Link href="/register" className="cta-red" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '18px 54px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 8px 40px rgba(197,24,58,.45)', marginBottom: '20px', position: 'relative' }}>
              Criar conta e gerar grátis →
            </Link>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#364A62', letterSpacing: '0.03em', position: 'relative' }}>
              Sem cartão · 1 vídeo grátis · 7 dias de garantia
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid #192436', padding: '32px 24px', position: 'relative', zIndex: 1, marginBottom: '56px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#fff', fontSize: '11px' }}>N</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '-0.025em' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="#planos" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>Planos</Link>
              <Link href="/login" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>Entrar</Link>
              <Link href="/register" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>Criar conta</Link>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>© 2025 NOCTURN.AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
