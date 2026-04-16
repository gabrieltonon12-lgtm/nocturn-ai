import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Starter', price: 47, credits: 20,
    url: 'https://pay.cakto.com.br/8euvzxd',
    color: '#059669', popular: false, perVideo: '2,35',
    features: ['20 vídeos / mês', 'YouTube + TikTok + Shorts', 'Roteiro GPT-4o', 'Voz IA PT-BR', 'Garantia 7 dias'],
  },
  {
    name: 'Pro', price: 97, credits: 100,
    url: 'https://pay.cakto.com.br/37beu86',
    color: '#C5183A', popular: true, perVideo: '0,97',
    features: ['100 vídeos / mês', 'Todas as plataformas', 'Roteiro avançado', 'Voz personalizada', 'Suporte prioritário'],
  },
  {
    name: 'Enterprise', price: 297, credits: 99999,
    url: 'https://pay.cakto.com.br/izhvx9t',
    color: '#7C3AED', popular: false, perVideo: '—',
    features: ['Vídeos ilimitados', 'Multi-usuário', 'API + webhooks', 'White-label', 'Gerente dedicado'],
  },
]

const FAQS = [
  {
    q: 'Preciso aparecer na câmera ou ter experiência com vídeo?',
    a: 'Não. Esse é exatamente o ponto. Você não aparece, não grava nada, não precisa de câmera, microfone ou software de edição. A IA faz tudo — roteiro, voz e montagem.',
  },
  {
    q: 'O conteúdo gerado é original ou pode causar plágio?',
    a: 'Todo roteiro é criado do zero pelo GPT-4o com base no seu tema. Não é cópia de nenhum canal existente. As imagens vêm do Pexels com licença comercial.',
  },
  {
    q: 'Funciona para monetização no YouTube?',
    a: 'Sim. Os vídeos gerados seguem as diretrizes de conteúdo do YouTube. Canais faceless de dark content são um dos nichos que mais crescem e mais monetizam na plataforma.',
  },
  {
    q: 'Quanto tempo leva para gerar um vídeo?',
    a: 'Menos de 3 minutos. Você digita o tema, clica em gerar, e em menos de 3 minutos tem roteiro + narração + imagens + player pronto para baixar e publicar.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem burocracia. Cancele a qualquer momento direto pelo painel. E se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do valor.',
  },
  {
    q: 'Quantos canais posso criar com uma conta?',
    a: 'Sem limite. Com uma conta Pro, por exemplo, você pode criar 100 vídeos por mês e distribuir entre quantos canais quiser — YouTube, TikTok, Instagram, Shorts.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Rafael M.',
    role: 'Criador · Canal True Crime',
    avatar: 'R',
    color: '#C5183A',
    text: 'Criei 3 canais em 6 semanas sem aparecer em nenhum. O canal maior já tem 12 mil inscritos. Jamais teria conseguido produzindo manualmente.',
    metric: '12k inscritos em 6 semanas',
  },
  {
    name: 'Camila R.',
    role: 'Criadora · Canal Mistério',
    avatar: 'C',
    color: '#7C3AED',
    text: 'Eu testei outras ferramentas mas o roteiro saía genérico. Aqui o GPT-4o gera algo que parece escrito por um roteirista de verdade. A voz então é assustadoramente boa.',
    metric: '47 vídeos publicados no 1º mês',
  },
  {
    name: 'Diego S.',
    role: 'Criador · Dark Finance',
    avatar: 'D',
    color: '#059669',
    text: 'R$4.200 no terceiro mês. Ainda não acredito. Trabalho 20 minutos por dia só escolhendo temas. O resto a IA resolve.',
    metric: 'R$4.200 no 3º mês',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: '#080D1A',
        border: `1px solid ${open ? 'rgba(197,24,58,.25)' : '#192436'}`,
        borderRadius: '12px',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'border-color .15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 600, color: '#ECF2FA', letterSpacing: '-0.02em', lineHeight: 1.4 }}>{q}</div>
        <div style={{ color: open ? '#C5183A' : '#364A62', fontSize: '18px', flexShrink: 0, transition: 'color .15s, transform .15s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>+</div>
      </div>
      {open && (
        <div style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.75, marginTop: '14px', fontWeight: 400 }}>{a}</div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>NOCTURN.AI — Dark Channels com IA em 3 Minutos</title>
        <meta name="description" content="Você digita o tema. A IA faz o resto: roteiro, voz e vídeo pronto para publicar. Sem câmera. Sem aparecer." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        .cta-red { transition: box-shadow .18s, transform .15s !important; }
        .cta-red:hover { box-shadow: 0 10px 48px rgba(197,24,58,.5) !important; transform: translateY(-2px) !important; }
        .ghost-btn:hover { border-color: #364A62 !important; color: #ECF2FA !important; }
        .plan-card { transition: border-color .18s, transform .18s, box-shadow .18s !important; }
        .plan-card:hover { transform: translateY(-4px) !important; }
        .pain-item { transition: border-color .18s, background .18s !important; }
        .pain-item:hover { border-color: rgba(197,24,58,.3) !important; background: rgba(197,24,58,.04) !important; }
        .testimonial-card { transition: border-color .18s, transform .18s !important; }
        .testimonial-card:hover { transform: translateY(-3px) !important; border-color: #203050 !important; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ background: '#02040A', color: '#ECF2FA', fontFamily: "'Inter',system-ui,sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

        {/* AMBIENT */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-5%', width: '900px', height: '900px', background: 'radial-gradient(circle,rgba(197,24,58,.055) 0%,transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '800px', height: '800px', background: 'radial-gradient(circle,rgba(124,58,237,.045) 0%,transparent 60%)' }} />
        </div>

        {/* ── NAV ── */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,4,10,.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid #192436' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#fff', fontSize: '13px', boxShadow: '0 2px 10px rgba(197,24,58,.35)' }}>N</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '-0.03em' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="/login" className="ghost-btn" style={{ color: '#6E8099', fontSize: '13px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', border: '1px solid #192436', transition: 'all .15s' }}>
                Entrar
              </Link>
              <Link href="/register" className="cta-red" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '7px 18px', borderRadius: '8px', letterSpacing: '-0.01em', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 4px 18px rgba(197,24,58,.3)' }}>
                Começar agora
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '104px 24px 88px', maxWidth: '800px', margin: '0 auto' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.18)', color: '#059669', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, marginBottom: '32px', letterSpacing: '0.03em', fontFamily: "'JetBrains Mono',monospace" }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669', flexShrink: 0, boxShadow: '0 0 8px rgba(5,150,105,.8)', animation: 'pulse 2s infinite' }} />
            +847 criadores · R$4.200/mês de média
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(42px,7.5vw,84px)', fontWeight: 800, lineHeight: 1.01, letterSpacing: '-0.048em', marginBottom: '22px', color: '#ECF2FA' }}>
            Você digita.<br />
            <span style={{ color: '#C5183A' }}>A IA publica.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#6E8099', lineHeight: 1.6, marginBottom: '44px', maxWidth: '540px', margin: '0 auto 44px' }}>
            Dark channel do zero em <strong style={{ color: '#ECF2FA', fontWeight: 600 }}>menos de 3 minutos</strong>.<br />
            Roteiro, voz e vídeo — sem câmera, sem aparecer.
          </p>

          <Link href="/register" className="cta-red" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '17px 48px', borderRadius: '12px', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 8px 36px rgba(197,24,58,.38)', marginBottom: '18px' }}>
            Gerar meu primeiro vídeo →
          </Link>

          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#364A62', letterSpacing: '0.03em' }}>
            Sem cartão · Cancele quando quiser · Garantia 7 dias
          </div>
        </section>

        {/* ── DOR ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>O problema</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA', maxWidth: '640px', margin: '0 auto' }}>
              Você sabe que dark channels faturam.<br />
              <span style={{ color: '#6E8099' }}>O problema é a execução.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '12px' }}>
            {[
              { icon: '😰', title: 'Aparecer na câmera não é opção', desc: 'Privacidade, timidez ou simplesmente preferência. Mas todos os tutoriais ensinam a aparecer.' },
              { icon: '⏳', title: 'Editar vídeo leva horas', desc: 'CapCut, Premiere, DaVinci. Curva de aprendizado enorme para um vídeo de 10 minutos.' },
              { icon: '✍️', title: 'Roteiro é a parte mais difícil', desc: 'Saber o tema não é suficiente. Estrutura, gancho, ritmo — escrever roteiro é uma habilidade separada.' },
              { icon: '💸', title: 'Contratar editor custa caro', desc: 'R$200–500 por vídeo. Para escalar para 3 vídeos por semana, o custo inviabiliza o negócio.' },
              { icon: '🎙️', title: 'Locução profissional é inacessível', desc: 'Microfone bom, tratamento acústico, horas de gravação. Tudo isso só para ter uma voz decente.' },
              { icon: '📉', title: 'Consistência é impossível', desc: 'A produção manual não escala. Um criador sozinho consegue 1–2 vídeos por semana no máximo.' },
            ].map((item, i) => (
              <div key={i} className="pain-item" style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '14px', padding: '22px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 700, color: '#ECF2FA', letterSpacing: '-0.02em', marginBottom: '6px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#6E8099', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOLUÇÃO — MOCKUP ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

            {/* Copy lado esquerdo */}
            <div>
              <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>A solução</div>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA', marginBottom: '20px' }}>
                Uma IA que faz<br />tudo que você não quer fazer.
              </h2>
              <p style={{ fontSize: '14px', color: '#6E8099', lineHeight: 1.75, marginBottom: '28px' }}>
                O NOCTURN.AI conecta GPT-4o, OpenAI TTS e Pexels em um pipeline que transforma qualquer tema dark em um vídeo completo — roteiro, narração e edição — sem você tocar em nada.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Roteiro', desc: 'GPT-4o escreve com gancho, ritmo e CTA', color: '#C5183A' },
                  { label: 'Narração', desc: 'OpenAI TTS sintetiza voz grave em PT-BR', color: '#7C3AED' },
                  { label: 'Imagens', desc: 'Pexels busca B-roll dark por cena', color: '#059669' },
                  { label: 'Download', desc: 'WebM pronto para publicar em qualquer plataforma', color: '#D97706' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.color, flexShrink: 0, boxShadow: `0 0 8px ${f.color}` }} />
                    <div>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', fontWeight: 700, color: '#ECF2FA', letterSpacing: '-0.01em' }}>{f.label}</span>
                      <span style={{ fontSize: '12px', color: '#6E8099', marginLeft: '8px' }}>{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup lado direito */}
            <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.02)' }}>
              <div style={{ background: '#05080F', borderBottom: '1px solid #192436', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#2A1A1A', '#2A2518', '#152018'].map((c, i) => <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>nocturn-ai.vercel.app/dashboard</span>
                <div style={{ width: '9px' }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                  {[{ l: 'Vídeos', v: '247', c: '#C5183A' }, { l: 'Créditos', v: '73', c: '#ECF2FA' }, { l: 'Views', v: '2.4M', c: '#059669' }].map((s, i) => (
                    <div key={i} style={{ background: '#0C1222', border: '1px solid #192436', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', color: '#364A62', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>{s.l}</div>
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '22px', fontWeight: 800, color: s.c, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0C1222', border: '1px solid #192436', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '11px', fontWeight: 700, color: '#ECF2FA', marginBottom: '10px', letterSpacing: '-0.01em' }}>Agente de Vídeo</div>
                  <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '7px', padding: '8px 10px', fontSize: '9px', color: '#6E8099', fontFamily: "'JetBrains Mono',monospace", marginBottom: '10px' }}>
                    "Documentário: o Illuminati e o sistema financeiro..."
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {['YouTube', 'TikTok', 'Reels'].map(p => (
                      <span key={p} style={{ background: 'rgba(197,24,58,.1)', color: '#C5183A', fontSize: '8px', fontWeight: 600, padding: '2px 8px', borderRadius: '9px', fontFamily: "'JetBrains Mono',monospace", border: '1px solid rgba(197,24,58,.2)' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: '#D97706', marginBottom: '5px' }}>ENCODE  Codificando vídeo final... 84%</div>
                  <div style={{ height: '3px', background: '#192436', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '84%', background: 'linear-gradient(90deg,#C5183A,#E05070)', borderRadius: '2px' }} />
                  </div>
                </div>

                {/* Mini video cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '6px' }}>
                  {[
                    { title: 'O Illuminati e o Caos Global', img: true },
                    { title: 'MKUltra: Experimentos Secretos', img: false },
                  ].map((v, i) => (
                    <div key={i} style={{ background: '#0C1222', border: '1px solid #192436', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '48px', background: `linear-gradient(135deg,#0A0E1A,${i === 0 ? '#1A0810' : '#0D0818'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>▶</div>
                      <div style={{ padding: '6px 8px', fontSize: '8px', fontWeight: 600, color: '#ECF2FA', fontFamily: "'Inter',sans-serif", lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NÚMEROS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #192436' }}>
            {[
              { value: '< 3min', label: 'por vídeo', sub: 'do prompt ao arquivo' },
              { value: '2.4M+', label: 'views geradas', sub: 'pelos nossos criadores' },
              { value: 'R$0,97', label: 'por vídeo', sub: 'no plano Pro' },
              { value: '7 dias', label: 'de garantia', sub: 'devolução total' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#080D1A', padding: '28px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid #192436' : 'none' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: '#ECF2FA', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#C5183A', marginBottom: '3px' }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', letterSpacing: '0.04em' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>Como funciona</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>
              Três passos.<br />Um vídeo publicado.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: '0' }}>
            {[
              { n: '01', icon: '✍️', title: 'Digite o tema', desc: 'Qualquer nicho dark: conspiração, true crime, mistério, crypto, terror...' },
              { n: '02', icon: '⚡', title: 'IA trabalha', desc: 'GPT-4o escreve o roteiro. TTS gera a voz. Pexels busca as imagens. Tudo automático.' },
              { n: '03', icon: '🎬', title: 'Baixe e publique', desc: 'Player com legenda, áudio e download pronto. Em menos de 3 minutos.' },
            ].map((step, i) => (
              <>
                <div key={step.n} style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '16px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '64px', fontWeight: 800, color: 'rgba(197,24,58,.05)', position: 'absolute', bottom: '-10px', right: '12px', lineHeight: 1, letterSpacing: '-0.04em', pointerEvents: 'none' }}>{step.n}</div>
                  <div style={{ fontSize: '28px', marginBottom: '14px', lineHeight: 1 }}>{step.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '-0.025em', color: '#ECF2FA', marginBottom: '8px' }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: '#6E8099', lineHeight: 1.65 }}>{step.desc}</div>
                </div>
                {i < 2 && (
                  <div key={`arr-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
                    <div style={{ color: '#364A62', fontSize: '20px' }}>→</div>
                  </div>
                )}
              </>
            ))}
          </div>
        </section>

        {/* ── DEPOIMENTOS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>Resultados reais</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>
              O que os criadores estão fazendo.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '14px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: '#D97706', fontSize: '12px' }}>★</span>)}
                </div>
                <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.75, flex: 1, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ background: `rgba(${t.color === '#C5183A' ? '197,24,58' : t.color === '#7C3AED' ? '124,58,237' : '5,150,105'},.08)`, border: `1px solid ${t.color === '#C5183A' ? 'rgba(197,24,58,.2)' : t.color === '#7C3AED' ? 'rgba(124,58,237,.2)' : 'rgba(5,150,105,.2)'}`, borderRadius: '8px', padding: '8px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: t.color, fontWeight: 600, textAlign: 'center' }}>
                  {t.metric}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #192436', paddingTop: '14px' }}>
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
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>Planos</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA', marginBottom: '12px' }}>
              1 crédito = 1 vídeo completo
            </h2>
            <p style={{ fontSize: '14px', color: '#6E8099' }}>Roteiro + voz + edição. Renova todo mês. Sem fidelidade.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '24px' }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="plan-card" style={{
                background: '#080D1A',
                border: `1px solid ${plan.popular ? 'rgba(197,24,58,.4)' : '#192436'}`,
                borderRadius: '18px', padding: '28px', position: 'relative',
                display: 'flex', flexDirection: 'column',
                boxShadow: plan.popular ? '0 0 60px rgba(197,24,58,.08)' : 'none',
              }}>
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
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#6E8099', marginBottom: '22px' }}>
                  {plan.credits === 99999 ? 'vídeos ilimitados' : `R$${plan.perVideo} por vídeo`}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: '13px', color: '#6E8099', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: plan.color, fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.url} className={plan.popular ? 'cta-red' : ''} style={{
                  display: 'block', textAlign: 'center', padding: '13px', borderRadius: '10px',
                  fontWeight: 700, fontSize: '14px', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.02em',
                  background: plan.popular ? 'linear-gradient(135deg,#C5183A,#8B0A22)' : 'transparent',
                  border: plan.popular ? 'none' : `1px solid ${plan.color}`,
                  color: plan.popular ? '#fff' : plan.color,
                  boxShadow: plan.popular ? '0 4px 20px rgba(197,24,58,.3)' : 'none',
                  marginBottom: '10px', transition: 'opacity .15s',
                }}>
                  Assinar {plan.name} →
                </Link>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textAlign: 'center', letterSpacing: '0.03em' }}>
                  7 dias garantia · cancele quando quiser
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GARANTIA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,.06),rgba(5,150,105,.02))', border: '1px solid rgba(5,150,105,.2)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '18px', lineHeight: 1 }}>🛡️</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#ECF2FA', marginBottom: '14px', lineHeight: 1.15 }}>
              Garantia incondicional de 7 dias
            </h2>
            <p style={{ fontSize: '14px', color: '#6E8099', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 20px' }}>
              Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias — <strong style={{ color: '#ECF2FA' }}>devolvemos 100% do valor, sem perguntas</strong>. Sem burocracia, sem formulário, sem espera.
            </p>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#059669', letterSpacing: '0.04em', fontWeight: 500 }}>
              ✓ Reembolso automático em até 48h
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>Dúvidas</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ECF2FA' }}>
              Perguntas frequentes
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 120px', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(160deg,rgba(197,24,58,.07),rgba(124,58,237,.04))', border: '1px solid rgba(197,24,58,.2)', borderRadius: '24px', padding: '72px 40px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 500 }}>Comece hoje</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(30px,5vw,54px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.06, marginBottom: '18px', color: '#ECF2FA' }}>
              Seu canal começa<br /><span style={{ color: '#C5183A' }}>agora.</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#6E8099', marginBottom: '36px', lineHeight: 1.6 }}>
              Sem câmera. Sem aparecer. Sem experiência necessária.
            </p>
            <Link href="/register" className="cta-red" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '18px 52px', borderRadius: '12px', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 8px 40px rgba(197,24,58,.4)', marginBottom: '20px' }}>
              Criar conta grátis →
            </Link>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#364A62', letterSpacing: '0.03em' }}>
              Sem cartão · 7 dias de garantia · Cancele quando quiser
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid #192436', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#fff', fontSize: '11px' }}>N</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '-0.025em' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="#planos" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62', letterSpacing: '0.04em' }}>Planos</Link>
              <Link href="/login" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62', letterSpacing: '0.04em' }}>Entrar</Link>
              <Link href="/register" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62', letterSpacing: '0.04em' }}>Criar conta</Link>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62', letterSpacing: '0.02em' }}>© 2025 NOCTURN.AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
