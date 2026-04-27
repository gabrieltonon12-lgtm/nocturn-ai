import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

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
  { q: 'O YouTube vai banir meu canal por usar IA?', a: 'Não. O YouTube não proíbe conteúdo gerado com IA — o que importa é que o conteúdo siga as diretrizes da plataforma. Canais faceless e de IA estão entre os que mais crescem no YouTube atualmente. Você precisa apenas declarar que usa IA nas configurações do canal, o que o NOCTURN.AI orienta no onboarding.' },
  { q: 'O conteúdo gerado é realmente original? Não é cópia de outros canais?', a: 'Sim, totalmente original. Todo roteiro é criado do zero pelo GPT-4o com base no tema que você escolhe — não é cópia de nenhum canal ou artigo existente. As imagens vêm do Pexels com licença comercial livre. Cada vídeo é único, mesmo que o tema seja o mesmo de outro criador.' },
]

const TESTIMONIALS = [
  { name: 'Rafael M.', role: 'Canal True Crime', avatar: 'R', color: '#C5183A', text: 'Criei 3 canais em 6 semanas sem aparecer em nenhum. O canal maior já tem 12 mil inscritos.', metric: '12k inscritos em 6 semanas' },
  { name: 'Camila R.', role: 'Canal Mistério', avatar: 'C', color: '#7C3AED', text: 'O GPT-4o gera algo que parece escrito por um roteirista de verdade. A voz é assustadoramente boa.', metric: '47 vídeos no 1º mês' },
  { name: 'Diego S.', role: 'Dark Finance', avatar: 'D', color: '#059669', text: 'R$4.200 no terceiro mês. Trabalho 20 minutos por dia só escolhendo temas. O resto a IA resolve.', metric: 'R$4.200 no 3º mês' },
  { name: 'Thiago P.', role: 'Conspirações BR', avatar: 'T', color: '#D97706', text: 'Era editor cobrando R$400 por vídeo. Hoje meu canal faceless gera mais do que meus clientes pagavam.', metric: '8 canais ativos' },
]

const LIVE_EVENTS = [
  { name: 'João G.', city: 'São Paulo', action: 'acabou de gerar um vídeo sobre Illuminati' },
  { name: 'Ana L.', city: 'Rio de Janeiro', action: 'alcançou 10k views no TikTok' },
  { name: 'Pedro M.', city: 'Curitiba', action: 'criou seu 1º dark channel' },
  { name: 'Mariana S.', city: 'BH', action: 'gerou 5 vídeos hoje' },
  { name: 'Lucas R.', city: 'Porto Alegre', action: 'assinou o plano Pro' },
  { name: 'Carla F.', city: 'Brasília', action: 'monetizou o canal em 30 dias' },
  { name: 'Bruno T.', city: 'Salvador', action: 'gerou vídeo de true crime' },
]

// Real Pexels thumbnails for visual mockups
const THUMB_IMGS = [
  'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&w=160&h=90&fit=crop',
  'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&w=160&h=90&fit=crop',
  'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&w=160&h=90&fit=crop',
  'https://images.pexels.com/photos/2694434/pexels-photo-2694434.jpeg?auto=compress&w=160&h=90&fit=crop',
  'https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg?auto=compress&w=160&h=90&fit=crop',
  'https://images.pexels.com/photos/1591305/pexels-photo-1591305.jpeg?auto=compress&w=160&h=90&fit=crop',
]

const MARQUEE_ITEMS = [
  '🔴 True Crime', '👽 Ovnis & OVNI', '🌑 Conspiração', '💀 Terror Urbano',
  '🛸 Área 51', '🕵️ Mistério', '🐍 Deep Web', '⛪ Religioso', '🌊 Catástrofes',
  '💰 Dark Finance', '🧠 Psicologia Sombria', '🔮 Ocultismo', '🌋 Fim do Mundo',
  '🦠 Pandemias', '🕳️ Buracos Negros', '🔴 True Crime', '👽 Ovnis & OVNI',
  '🌑 Conspiração', '💀 Terror Urbano', '🛸 Área 51', '🕵️ Mistério',
]

// ── Generation stages shown in mockup ────────────────────────────────────────
const GEN_STAGES = [
  { label: 'Gerando roteiro...', sub: 'GPT-4o analisando o tema', pct: 18, color: '#C5183A' },
  { label: 'Sintetizando voz...', sub: 'OpenAI TTS HD em PT-BR', pct: 42, color: '#7C3AED' },
  { label: 'Gerando vídeo IA...', sub: 'Runway ML Gen-4.5 · MP4', pct: 78, color: '#C5183A' },
  { label: 'Sincronizando legendas...', sub: 'Canvas rAF · karaoke sync', pct: 92, color: '#D97706' },
  { label: '✓ Pronto para publicar', sub: 'MP4 · 1280×720 · 00:02:47', pct: 100, color: '#059669' },
]

// ── Interactive product demo ──────────────────────────────────────────────────
const DEMO_PROMPTS = [
  'Os maiores segredos da Maçonaria que nunca te contaram',
  'O caso real mais perturbador do true crime brasileiro',
  'Como pessoas comuns ficaram ricas do zero em 2024',
  'Os mistérios da NASA que o governo tenta esconder',
]
const DEMO_STEPS = [
  { icon: '✦', label: 'GPT-4o', desc: 'Gerando roteiro cinematográfico...', done: 'Roteiro: 6 cenas · 847 palavras', color: '#C5183A' },
  { icon: '🎙', label: 'OpenAI TTS', desc: 'Sintetizando narração em PT-BR...', done: 'Narração: voz onyx · 2min 47s', color: '#7C3AED' },
  { icon: '🎬', label: 'Runway ML', desc: 'Gerando vídeo cinematográfico...', done: 'Vídeo: Gen-4.5 · MP4 1280×720', color: '#C5183A' },
  { icon: '✓', label: 'Pronto!', desc: 'Exportando MP4 final...', done: 'Vídeo gerado em 2:53 ✓', color: '#059669' },
]

function ProductDemo() {
  const [phase, setPhase] = useState<'idle'|'typing'|'generating'|'done'>('idle')
  const [typedPrompt, setTypedPrompt] = useState('')
  const [doneSteps, setDoneSteps] = useState<number[]>([])
  const [activeStep, setActiveStep] = useState(-1)
  const [promptIdx] = useState(() => Math.floor(Math.random() * DEMO_PROMPTS.length))
  const fullPrompt = DEMO_PROMPTS[promptIdx]

  useEffect(() => {
    // Start typing after 1.5s
    const t = setTimeout(() => setPhase('typing'), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'typing') return
    let i = 0
    const type = () => {
      if (i <= fullPrompt.length) {
        setTypedPrompt(fullPrompt.slice(0, i))
        i++
        setTimeout(type, 35 + Math.random() * 25)
      } else {
        setTimeout(() => setPhase('generating'), 600)
      }
    }
    type()
  }, [phase, fullPrompt])

  useEffect(() => {
    if (phase !== 'generating') return
    let step = 0
    setActiveStep(0)
    const delays = [2200, 1800, 4000, 1200]
    function next() {
      if (step >= DEMO_STEPS.length) { setPhase('done'); setActiveStep(-1); return }
      setActiveStep(step)
      setTimeout(() => {
        setDoneSteps(d => [...d, step])
        step++
        setTimeout(next, 200)
      }, delays[step] || 2000)
    }
    next()
  }, [phase])

  // Reset loop after done
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => {
      setPhase('idle'); setTypedPrompt(''); setDoneSteps([]); setActiveStep(-1)
      setTimeout(() => setPhase('typing'), 800)
    }, 4000)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Demo ao vivo</div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>
          Veja acontecendo<br /><span style={{ color: '#C5183A' }}>em tempo real.</span>
        </h2>
      </div>

      <div style={{ background: '#02040A', border: '1px solid #192436', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.5)' }}>
        {/* Window chrome */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #192436', display: 'flex', alignItems: 'center', gap: '10px', background: '#080D1A' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <div style={{ flex: 1, background: '#02040A', border: '1px solid #192436', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#364A62', fontFamily: "'JetBrains Mono',monospace" }}>nocturn.ai/dashboard</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />online
          </div>
        </div>

        <div style={{ padding: '28px 28px 32px' }}>
          {/* Prompt input */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: '#364A62', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Tema do vídeo</div>
            <div style={{ background: '#080D1A', border: `1px solid ${phase === 'idle' ? '#192436' : '#C5183A40'}`, borderRadius: '10px', padding: '14px 16px', fontFamily: "'Figtree',sans-serif", fontSize: '14px', color: '#ECF2FA', minHeight: '52px', transition: 'border-color .3s', position: 'relative' }}>
              {typedPrompt || <span style={{ color: '#364A62' }}>Digite o tema do seu vídeo...</span>}
              {(phase === 'typing') && <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#C5183A', marginLeft: '2px', verticalAlign: 'middle', animation: 'pulse .8s infinite' }} />}
            </div>
          </div>

          {/* Generation steps */}
          {(phase === 'generating' || phase === 'done') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {DEMO_STEPS.map((step, i) => {
                const isDone = doneSteps.includes(i)
                const isActive = activeStep === i && !isDone
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: isActive ? `${step.color}10` : isDone ? 'rgba(16,185,129,.06)' : '#080D1A', border: `1px solid ${isActive ? step.color + '40' : isDone ? 'rgba(16,185,129,.2)' : '#192436'}`, transition: 'all .4s' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isActive ? step.color : isDone ? '#10B981' : '#0C1222', border: `1px solid ${isActive ? step.color : isDone ? '#10B981' : '#192436'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isActive ? `0 0 12px ${step.color}60` : 'none', transition: 'all .4s' }}>
                      {isActive
                        ? <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin .8s linear infinite' }} />
                        : isDone
                        ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                        : <span style={{ color: '#364A62', fontSize: '11px' }}>{step.icon}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, color: isActive ? step.color : isDone ? '#10B981' : '#364A62', transition: 'color .3s' }}>{step.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', marginTop: '2px' }}>{isDone ? step.done : isActive ? step.desc : '—'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Result preview */}
          {phase === 'done' && (
            <div style={{ background: 'linear-gradient(135deg,rgba(197,24,58,.1),rgba(124,58,237,.06))', border: '1px solid rgba(197,24,58,.3)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', animation: 'fadeUp .4s ease' }}>
              <div style={{ width: '80px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#0C1222' }}>
                <img src={THUMB_IMGS[promptIdx % THUMB_IMGS.length]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.7)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px' }}>▶</span>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: 700, color: '#ECF2FA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{fullPrompt}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['MP4 pronto', 'Runway ML', 'Narração PT-BR', '2:53'].map((b, i) => (
                    <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: '#10B981', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', padding: '2px 7px', borderRadius: '4px' }}>{b}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#10B981', fontWeight: 700, flexShrink: 0 }}>✓ Feito!</div>
            </div>
          )}

          {phase === 'idle' && (
            <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>Iniciando demonstração...</div>
            </div>
          )}

          {phase === 'typing' && doneSteps.length === 0 && activeStep === -1 && (
            <div style={{ height: '32px' }} />
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} } @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </section>
  )
}

// ── Animated hero mockup ──────────────────────────────────────────────────────
function HeroMockup() {
  const [stage, setStage] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Delay start so first render isn't mid-cycle
    const t0 = setTimeout(() => setShown(true), 400)
    return () => clearTimeout(t0)
  }, [])

  useEffect(() => {
    if (!shown) return
    const intervals = [2200, 1800, 2000, 1800, 3000]
    const id = setTimeout(() => {
      setStage(s => (s + 1) % GEN_STAGES.length)
    }, intervals[stage] || 2000)
    return () => clearTimeout(id)
  }, [stage, shown])

  const cur = GEN_STAGES[stage]
  const isDone = stage === GEN_STAGES.length - 1

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '480px',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.8 }} />)}
        </div>
        <div style={{ flex: 1, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: '#94A3B8', fontFamily: "'JetBrains Mono',monospace" }}>
          nocturn.ai/dashboard
        </div>
      </div>

      {/* Thumb grid — real Pexels images */}
      <div style={{ padding: '16px 18px 10px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', background: '#FFFFFF' }}>
        {THUMB_IMGS.map((src, i) => (
          <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#F1F5F9' }}>
            <img
              src={src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.9) saturate(0.95)', transition: 'opacity 0.5s' }}
              loading="lazy"
            />
            {isDone && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px' }}>▶</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status area */}
      <div style={{ padding: '10px 18px 18px', background: '#FFFFFF' }}>
        {/* Progress bar */}
        <div style={{ height: '3px', background: '#F1F5F9', borderRadius: '3px', marginBottom: '14px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${cur.pct}%`,
            background: `linear-gradient(90deg, ${cur.color}, ${cur.color}99)`,
            borderRadius: '3px',
            transition: 'width 0.9s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDone ? '#10B981' : '#0F172A', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
              {cur.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#94A3B8', marginTop: '3px' }}>
              {cur.sub}
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: cur.color, fontWeight: 700, flexShrink: 0, transition: 'color 0.3s' }}>
            {cur.pct}%
          </div>
        </div>

        {/* Stage dots */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
          {GEN_STAGES.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '2px', borderRadius: '2px',
              background: i <= stage ? cur.color : '#E2E8F0',
              transition: 'background 0.4s',
            }} />
          ))}
        </div>
      </div>

      {/* Glow */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: `radial-gradient(circle, ${cur.color}18 0%, transparent 60%)`, pointerEvents: 'none', transition: 'background 0.6s' }} />
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
    const delay = setTimeout(show, 6000)
    const id = setInterval(show, 22000)
    return () => { clearTimeout(delay); clearInterval(id) }
  }, [])
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '20px', zIndex: 999, background: 'rgba(255,255,255,0.98)', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 12px 40px rgba(0,0,0,.12)', animation: 'fadeUp .3s ease', maxWidth: '300px', fontFamily: "'Figtree',sans-serif", backdropFilter: 'blur(16px)' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#C5183A,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎬</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', lineHeight: 1.35 }}>{ev.name} <span style={{ color: '#64748B', fontWeight: 400 }}>· {ev.city}</span></div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{ev.action}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '3px' }}>agora mesmo</div>
      </div>
    </div>
  )
}

// ── Sticky bottom CTA ─────────────────────────────────────────────────────────
function StickyCtaBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 998, background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid #192436', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#64748B' }}>1 vídeo grátis · sem cartão · cancele quando quiser</span>
      <Link href="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '10px 32px', borderRadius: '9px', fontWeight: 700, fontSize: '14px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.01em', boxShadow: '0 4px 20px rgba(197,24,58,.4)' }}>
        Criar Meu Vídeo — Grátis →
      </Link>
    </div>
  )
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${open ? 'rgba(197,24,58,.3)' : '#E2E8F0'}`, borderRadius: '14px', padding: '20px 24px', cursor: 'pointer', transition: 'border-color .2s', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '15px', fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>{q}</div>
        <div style={{ color: open ? '#C5183A' : '#94A3B8', fontSize: '20px', flexShrink: 0, transition: 'color .2s, transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</div>
      </div>
      {open && <div style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.8, marginTop: '14px', fontFamily: "'Figtree',sans-serif" }}>{a}</div>}
    </div>
  )
}

// ── Exit intent popup ─────────────────────────────────────────────────────────
function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const fired = typeof window !== 'undefined' && (window as any).__exitFired

  useEffect(() => {
    if (fired) return
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 10 && !show && !(window as any).__exitFired) {
        ;(window as any).__exitFired = true
        setShow(true)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [show, fired])

  if (!show) return null

  return (
    <div style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(2,6,14,.88)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',animation:'fadeIn .3s ease' }}>
      <div style={{ background:'#fff',borderRadius:'22px',padding:'40px 36px',maxWidth:'480px',width:'100%',boxShadow:'0 40px 100px rgba(0,0,0,.35)',position:'relative',animation:'fadeUp .35s ease',textAlign:'center' }}>
        <button onClick={() => setShow(false)} style={{ position:'absolute',top:'16px',right:'16px',background:'none',border:'none',fontSize:'22px',color:'#94A3B8',cursor:'pointer',lineHeight:1 }}>×</button>

        <div style={{ fontSize:'52px',marginBottom:'16px',lineHeight:1 }}>🎁</div>
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:'28px',fontWeight:800,letterSpacing:'-0.04em',color:'#0F172A',marginBottom:'10px',lineHeight:1.1 }}>
          Espera! Você tem<br /><span style={{ color:'#C5183A' }}>3 créditos grátis</span> esperando
        </h2>
        <p style={{ fontSize:'14px',color:'#64748B',lineHeight:1.7,marginBottom:'24px' }}>
          Crie sua conta agora e ganhe 3 vídeos grátis para testar. Sem cartão, sem compromisso.
        </p>

        {!sent ? (
          <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
            <Link href="/register" onClick={() => setShow(false)}
              style={{ display:'block',background:'linear-gradient(135deg,#C5183A,#8B0A22)',color:'#fff',padding:'14px 28px',borderRadius:'11px',fontWeight:700,fontSize:'16px',fontFamily:"'Syne',sans-serif",letterSpacing:'-0.02em',boxShadow:'0 6px 30px rgba(197,24,58,.4)',textDecoration:'none' }}>
              Quero meus 3 vídeos grátis →
            </Link>
            <button onClick={() => setShow(false)} style={{ background:'none',border:'none',fontSize:'12px',color:'#94A3B8',cursor:'pointer',padding:'4px',fontFamily:"'Figtree',sans-serif" }}>
              Não, prefiro pagar R$400 por vídeo
            </button>
          </div>
        ) : (
          <div style={{ padding:'16px',background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.3)',borderRadius:'12px',color:'#059669',fontWeight:600,fontSize:'14px' }}>
            ✅ Conta criada! Seus créditos já estão disponíveis.
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Head>
        <title>NOCTURN.AI — Crie Canais com IA em 3 Minutos</title>
        <meta name="description" content="1 vídeo grátis ao criar conta. Roteiro, voz e imagens automáticos — sem câmera, sem aparecer. Dark channel, religioso, true crime, natureza e muito mais." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="dark channel ia, canal youtube ia, criar video com ia, faceless channel, nocturn ai, roteiro ia, tts ia" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nocturn-ai.vercel.app" />
        <meta property="og:title" content="NOCTURN.AI — Crie Canais Faceless com IA" />
        <meta property="og:description" content="Você digita o tema. A IA escreve o roteiro, narra com voz realista e monta o vídeo. 1 vídeo grátis, sem cartão." />
        <meta property="og:image" content="https://nocturn-ai.vercel.app/og-image.jpg" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NOCTURN.AI — Crie Canais Faceless com IA" />
        <meta name="twitter:description" content="Roteiro + voz + imagens em menos de 3 minutos. 1 vídeo grátis, sem cartão." />
        <meta name="twitter:image" content="https://nocturn-ai.vercel.app/og-image.jpg" />
        <link rel="canonical" href="https://nocturn-ai.vercel.app" />
      </Head>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        a { text-decoration:none; }
        body { -webkit-font-smoothing:antialiased; }
        .cta-btn { transition: box-shadow .2s, transform .18s !important; }
        .cta-btn:hover { box-shadow: 0 16px 56px rgba(197,24,58,.6) !important; transform: translateY(-2px) !important; }
        .ghost-btn:hover { background: rgba(0,0,0,.04) !important; color: #0F172A !important; border-color: #CBD5E1 !important; }
        .plan-card { transition: border-color .2s, transform .2s, box-shadow .2s !important; }
        .plan-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(197,24,58,.15) !important; }
        .plan-card-popular:hover { box-shadow: 0 24px 64px rgba(197,24,58,.25), 0 0 0 1px rgba(197,24,58,.4) !important; }
        .step-card { transition: border-color .2s, background .2s !important; }
        .step-card:hover { border-color: rgba(197,24,58,.25) !important; background: rgba(197,24,58,.025) !important; }
        .testimonial-card { transition: border-color .2s, transform .2s !important; }
        .testimonial-card:hover { transform: translateY(-4px) !important; border-color: #203050 !important; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.35} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{opacity:.5}50%{opacity:1}100%{opacity:.5} }
        @media(max-width:767px){
          .hero-split{flex-direction:column !important; text-align:center !important;}
          .hero-split .hero-cta{align-items:center !important;}
          .hide-mobile{display:none !important;}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important;}
          .steps-grid{grid-template-columns:1fr !important;}
        }
      `}</style>

      <LiveNotification />
      <StickyCtaBar />
      <ExitIntentPopup />

      <div style={{ background: '#F8FAFC', color: '#0F172A', fontFamily: "'Figtree',system-ui,sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

        {/* AMBIENT BG */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle,rgba(197,24,58,.05) 0%,transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(124,58,237,.04) 0%,transparent 65%)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '40%', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(197,24,58,.03) 0%,transparent 60%)', transform: 'translate(-50%,-50%)' }} />
        </div>

        {/* ── ANNOUNCEMENT BAR ── */}
        <div style={{ background: 'linear-gradient(90deg,rgba(197,24,58,.15),rgba(124,58,237,.1),rgba(197,24,58,.15))', borderBottom: '1px solid rgba(197,24,58,.2)', padding: '9px 24px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 101, backdropFilter: 'blur(12px)' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#D97706', fontWeight: 600, letterSpacing: '0.04em' }}>
            🔥 OFERTA DE LANÇAMENTO
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#64748B', marginLeft: '12px' }}>
            50% de desconto no plano Pro por tempo limitado · <Link href="/register" style={{ color: '#C5183A', fontWeight: 700, textDecoration: 'underline' }}>Garantir agora →</Link>
          </span>
        </div>

        {/* ── NAV ── */}
        <nav style={{ position: 'sticky', top: '38px', zIndex: 100, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#fff', fontSize: '14px', boxShadow: '0 2px 12px rgba(197,24,58,.4)', letterSpacing: '-0.5px' }}>N</div>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '16px', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Link href="#planos" className="ghost-btn" style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, padding: '7px 14px', borderRadius: '8px', border: '1px solid #192436', transition: 'all .2s' }}>Planos</Link>
              <Link href="/login" className="ghost-btn" style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, padding: '7px 14px', borderRadius: '8px', border: '1px solid #192436', transition: 'all .2s' }}>Entrar</Link>
              <Link href="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '8px 20px', borderRadius: '8px', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 18px rgba(197,24,58,.32)', whiteSpace: 'nowrap' }}>
                Criar conta grátis →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO — SPLIT LAYOUT ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 60px', maxWidth: '1120px', margin: '0 auto' }}>
          <div className="hero-split" style={{ display: 'flex', alignItems: 'center', gap: '60px', justifyContent: 'space-between' }}>

            {/* Left: Text */}
            <div style={{ flex: '0 0 auto', maxWidth: '540px' }}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.2)', color: '#10B981', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, marginBottom: '32px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.02em' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px rgba(16,185,129,.8)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                +1.200 criadores ativos · R$4.200/mês de média
              </div>

              <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(42px,5.5vw,76px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.045em', marginBottom: '24px', color: '#0F172A' }}>
                Você digita.<br />
                <span style={{ color: '#C5183A', display: 'inline-block' }}>A IA publica.</span>
              </h1>

              <p style={{ fontSize: '17px', color: '#64748B', lineHeight: 1.7, marginBottom: '40px', maxWidth: '460px', fontWeight: 400 }}>
                Dark channel completo em{' '}
                <strong style={{ color: '#0F172A', fontWeight: 600 }}>menos de 3 minutos</strong>.{' '}
                Roteiro GPT-4o · narração TTS · montagem automática.{' '}
                <strong style={{ color: '#0F172A', fontWeight: 600 }}>Sem câmera. Sem aparecer.</strong>
              </p>

              <div className="hero-cta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <Link href="/register" className="cta-btn" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '16px 44px', borderRadius: '12px', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.02em', fontFamily: "'Syne',sans-serif", boxShadow: '0 8px 44px rgba(197,24,58,.42)' }}>
                  Criar Meu Primeiro Vídeo — Grátis →
                </Link>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {['Sem cartão', '1 vídeo grátis', 'Cancele quando quiser'].map((t, i) => (
                    <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech logos */}
              <div style={{ marginTop: '44px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', opacity: 0.45 }}>
                {['GPT-4o', 'OpenAI TTS', 'Runway ML', 'MP4', 'PT-BR'].map((t, i) => (
                  <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748B', letterSpacing: '0.1em', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right: Animated mockup */}
            <div className="hide-mobile" style={{ flex: '0 0 auto', width: '100%', maxWidth: '460px', animation: 'floatY 6s ease-in-out infinite' }}>
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ── PRODUCT DEMO ── */}
        <ProductDemo />

        {/* ── POWERED BY ── */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(0,0,0,.05)', padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#CBD5E1', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Powered by</span>
            {['GPT-4o', 'OpenAI TTS', 'Runway ML', 'Vercel', 'Next.js'].map((t, i) => (
              <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', opacity: 0.7 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── MARQUEE STRIP ── */}
        <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', borderTop: '1px solid rgba(0,0,0,.06)', borderBottom: '1px solid rgba(0,0,0,.06)', background: 'rgba(241,245,249,0.8)', padding: '14px 0', marginBottom: '0' }}>
          <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', width: 'max-content' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#94A3B8', padding: '0 28px', whiteSpace: 'nowrap', letterSpacing: '0.05em', fontWeight: 500 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── ANTES vs DEPOIS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '96px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Realidade vs IA</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>
              O mesmo vídeo.<br /><span style={{ color: '#64748B', fontWeight: 600 }}>Dois mundos diferentes.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', border: '1px solid #192436', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(255,255,255,0.92)', padding: '32px 28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '22px', fontWeight: 600 }}>Sem NOCTURN.AI</div>
              {[
                { label: 'Roteiro', val: '3–4 horas', icon: '✍️' },
                { label: 'Narração', val: 'Microfone + estúdio', icon: '🎙️' },
                { label: 'Edição', val: '4–8 horas', icon: '🎬' },
                { label: 'Freelancer', val: 'R$200–500 por vídeo', icon: '💸' },
                { label: 'Frequência', val: '1 vídeo por semana', icon: '📅' },
                { label: 'Custo mensal', val: 'R$1.000–2.000+', icon: '❌' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(0,0,0,.05)' : 'none' }}>
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', borderLeft: '1px solid #192436', borderRight: '1px solid #192436' }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '20px', fontWeight: 800, color: '#CBD5E1', writingMode: 'vertical-lr', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}>VS</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,rgba(197,24,58,.05),rgba(124,58,237,.04))', padding: '32px 28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '22px', fontWeight: 600 }}>Com NOCTURN.AI</div>
              {[
                { label: 'Roteiro', val: '30 segundos — GPT-4o', icon: '⚡' },
                { label: 'Narração', val: 'OpenAI TTS automático', icon: '🤖' },
                { label: 'Edição', val: 'Zero — gerado com IA', icon: '✅' },
                { label: 'Freelancer', val: 'Não precisa', icon: '🎯' },
                { label: 'Frequência', val: 'Ilimitado no Enterprise', icon: '🚀' },
                { label: 'Custo mensal', val: 'A partir de R$47/mês', icon: '💚' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(0,0,0,.05)' : 'none' }}>
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#C5183A', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Como funciona</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>Três passos.<br />Um vídeo publicado.</h2>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { n: '01', icon: '✍️', title: 'Digite o tema', desc: 'Qualquer nicho dark: conspiração, true crime, mistério, crypto, terror. Em português, sem saber inglês.' },
              { n: '02', icon: '⚡', title: 'IA trabalha por você', desc: 'GPT-4o escreve o roteiro. TTS gera a voz grave. Pexels busca imagens por cena. Tudo em menos de 2 minutos.' },
              { n: '03', icon: '🎬', title: 'Baixe e publique', desc: 'Player com legenda sincronizada, narração e download WebM. Pronto para YouTube, TikTok e Reels.' },
            ].map((step, i) => (
              <div key={i} className="step-card" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #192436', borderRadius: '18px', padding: '28px 24px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '72px', fontWeight: 800, color: 'rgba(197,24,58,.05)', position: 'absolute', bottom: '-16px', right: '14px', lineHeight: 1, pointerEvents: 'none', letterSpacing: '-0.05em' }}>{step.n}</div>
                <div style={{ fontSize: '28px', marginBottom: '16px', lineHeight: 1 }}>{step.icon}</div>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: '10px' }}>{step.title}</div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.75 }}>{step.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/register" className="cta-btn" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '14px 40px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', fontFamily: "'Syne',sans-serif", boxShadow: '0 6px 28px rgba(197,24,58,.35)' }}>
              Testar agora — é de graça →
            </Link>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px' }}>
          <div className="stats-grid" style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', borderRadius: '18px', overflow: 'hidden', border: '1px solid #192436' }}>
            {[
              { value: '< 3min', label: 'por vídeo', sub: 'do prompt ao arquivo' },
              { value: '2.4M+', label: 'views geradas', sub: 'pelos nossos criadores' },
              { value: 'R$0,97', label: 'por vídeo', sub: 'no plano Pro' },
              { value: '7 dias', label: 'de garantia', sub: 'devolução total, sem perguntas' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.97)', padding: '32px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid #192436' : 'none' }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(22px,3vw,40px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.045em', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#C5183A', marginBottom: '4px', fontFamily: "'Syne',sans-serif" }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PERSONAS / NICHOS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Para quem é</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>
              Qualquer nicho.<br /><span style={{ color: '#C5183A' }}>Resultados em dias.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '14px' }}>
            {[
              {
                icon: '💀', nicho: 'True Crime', color: '#C5183A',
                title: 'Canal true crime sem aparecer',
                desc: 'Roteiros investigativos baseados em casos reais brasileiros. Narração grave, imagens cinematográficas, subtítulos automáticos.',
                metric: '12k inscritos em 6 semanas',
              },
              {
                icon: '✝️', nicho: 'Religioso', color: '#7C3AED',
                title: 'Canal de fé e espiritualidade',
                desc: 'Mensagens de esperança, reflexões bíblicas e histórias de fé. Tom reverente, voz acolhedora, visual de luz divina.',
                metric: '47 vídeos no 1º mês',
              },
              {
                icon: '💰', nicho: 'Dark Finance', color: '#059669',
                title: 'Canal de educação financeira',
                desc: 'Estratégias que os ricos não querem que você saiba. Tom direto, visual premium de arranha-céus, scripts persuasivos.',
                metric: 'R$4.200/mês no 3º mês',
              },
              {
                icon: '🕵️', nicho: 'Mistério & Conspiração', color: '#D97706',
                title: 'Canal de mistérios e revelações',
                desc: 'Segredos, ovnis, conspirações e verdades ocultas. Tom suspense, visual noir, roteiro que prende do início ao fim.',
                metric: '8 canais ativos simultâneos',
              },
              {
                icon: '🌿', nicho: 'Natureza', color: '#059669',
                title: 'Canal de natureza e universo',
                desc: 'Os lugares mais inexplorados do planeta, fenômenos naturais e descobertas científicas. Visual épico, narração contemplativa.',
                metric: '2.4M de views acumuladas',
              },
              {
                icon: '👻', nicho: 'Terror & Horror', color: '#C5183A',
                title: 'Canal de terror psicológico',
                desc: 'Histórias baseadas em fatos reais, lendas urbanas e casos assustadores. Visual sombrio, narração tensa, trilha sonora dark.',
                metric: '< 3 minutos por vídeo',
              },
            ].map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #192436', borderRadius: '18px', padding: '26px 24px', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-16px', right: '14px', fontSize: '72px', opacity: 0.04, lineHeight: 1, pointerEvents: 'none' }}>{p.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '24px', lineHeight: 1 }}>{p.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: p.color, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{p.nicho}</div>
                </div>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '15px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.3 }}>{p.title}</div>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.75, marginBottom: '16px' }}>{p.desc}</p>
                <div style={{ background: `rgba(${p.color === '#C5183A' ? '197,24,58' : p.color === '#7C3AED' ? '124,58,237' : p.color === '#D97706' ? '217,119,6' : '5,150,105'},.08)`, border: `1px solid ${p.color}28`, borderRadius: '8px', padding: '7px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: p.color, fontWeight: 700 }}>✓ {p.metric}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/register" className="cta-btn" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '14px 40px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', fontFamily: "'Syne',sans-serif", boxShadow: '0 6px 28px rgba(197,24,58,.35)' }}>
              Escolher meu nicho e começar →
            </Link>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 64px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(197,24,58,.06),rgba(124,58,237,.04))', border: '1px solid rgba(197,24,58,.15)', borderRadius: '18px', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {/* Avatar stack */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', marginRight: '12px' }}>
                {['#C5183A','#7C3AED','#059669','#D97706','#C5183A'].map((c,i) => (
                  <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg,${c},#02040A)`, border: '2px solid #02040A', marginLeft: i === 0 ? '0' : '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', zIndex: 5 - i }}>
                    {['R','C','D','T','M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>+1.200 criadores</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>já usam o NOCTURN.AI</div>
              </div>
            </div>
            <div style={{ width: '1px', height: '36px', background: '#E2E8F0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', lineHeight: 1 }}>2.4M+</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>views geradas</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: '#E2E8F0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', lineHeight: 1 }}>&lt; 3min</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>tempo por vídeo</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: '#E2E8F0' }} />
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#D97706', fontSize: '16px' }}>★</span>)}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748B', marginLeft: '6px', alignSelf: 'center' }}>4.9/5</span>
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Resultados reais</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>O que os criadores estão fazendo.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #192436', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', gap: '3px' }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: '#D97706', fontSize: '13px' }}>★</span>)}</div>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                <div style={{ background: `rgba(${t.color === '#C5183A' ? '197,24,58' : t.color === '#7C3AED' ? '124,58,237' : t.color === '#D97706' ? '217,119,6' : '5,150,105'},.08)`, border: `1px solid ${t.color}28`, borderRadius: '8px', padding: '8px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: t.color, fontWeight: 700, textAlign: 'center' }}>{t.metric}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #192436', paddingTop: '14px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${t.color},#02040A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{t.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="planos" style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Planos</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A', marginBottom: '12px' }}>1 crédito = 1 vídeo completo</h2>
            <p style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Figtree',sans-serif" }}>Roteiro + voz + edição. Renova todo mês. Sem fidelidade.</p>
            <div style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,24,58,.08)', border: '1px solid rgba(197,24,58,.2)', color: '#C5183A', padding: '6px 16px', borderRadius: '20px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 600 }}>
              <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#C5183A' }} />
              Preço de lançamento · Pode subir a qualquer momento
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '24px' }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="plan-card" style={{ background: 'rgba(255,255,255,0.95)', border: `1px solid ${plan.popular ? 'rgba(197,24,58,.45)' : '#E2E8F0'}`, borderRadius: '20px', padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: plan.popular ? '0 0 80px rgba(197,24,58,.1)' : 'none', backdropFilter: 'blur(8px)' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 18px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '0.1em', boxShadow: '0 4px 16px rgba(197,24,58,.45)', fontFamily: "'JetBrains Mono',monospace" }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: plan.color, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '48px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: '#0F172A' }}>R${plan.price}</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>/mês</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748B', marginBottom: '22px' }}>
                  {plan.credits === 99999 ? 'vídeos ilimitados' : `R$${plan.perVideo} por vídeo`}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: plan.color, fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.url} className={plan.popular ? 'cta-btn' : ''} style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em', background: plan.popular ? 'linear-gradient(135deg,#C5183A,#8B0A22)' : 'transparent', border: plan.popular ? 'none' : `1px solid ${plan.color}50`, color: plan.popular ? '#fff' : plan.color, boxShadow: plan.popular ? '0 4px 22px rgba(197,24,58,.32)' : 'none', marginBottom: '12px', transition: 'opacity .15s' }}>
                  Assinar {plan.name} →
                </a>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', textAlign: 'center' }}>
                  7 dias garantia · cancele quando quiser
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/register" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#64748B', borderBottom: '1px solid #364A62', paddingBottom: '1px' }}>
              Não quer pagar ainda? Comece com 1 vídeo grátis →
            </Link>
          </div>
        </section>

        {/* ── GARANTIA ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,.07),rgba(5,150,105,.02))', border: '1px solid rgba(5,150,105,.18)', borderRadius: '22px', padding: '52px 44px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '56px', marginBottom: '18px', lineHeight: 1 }}>🛡️</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: '14px', lineHeight: 1.1 }}>Garantia incondicional de 7 dias</h2>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.85, maxWidth: '460px', margin: '0 auto 22px' }}>
              Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias — <strong style={{ color: '#0F172A' }}>devolvemos 100% do valor, sem perguntas, sem formulário</strong>. Reembolso em até 48h.
            </p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Reembolso em 48h', 'Sem burocracia', 'Sem perguntas'].map((t, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#10B981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>✓</span>{t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 60px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { icon: '🔒', label: 'Pagamento Seguro', sub: 'SSL 256-bit' },
              { icon: '🛡️', label: 'Garantia 7 dias', sub: 'Reembolso total' },
              { icon: '⚡', label: 'Cancele quando quiser', sub: 'Sem fidelidade' },
              { icon: '🤖', label: 'GPT-4o + OpenAI TTS', sub: 'Melhor IA do mundo' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(241,245,249,0.85)', border: '1px solid #192436', borderRadius: '12px', padding: '12px 18px', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{b.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '12px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{b.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#94A3B8', marginTop: '1px' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 96px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Dúvidas</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A' }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 140px', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(160deg,rgba(197,24,58,.1),rgba(124,58,237,.06))', border: '1px solid rgba(197,24,58,.2)', borderRadius: '26px', padding: '80px 44px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(16px)' }}>
            <div aria-hidden style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(197,24,58,.1) 0%,transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 600, position: 'relative' }}>Comece hoje</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.0, marginBottom: '18px', color: '#0F172A', position: 'relative' }}>
              Seu canal começa<br /><span style={{ color: '#C5183A' }}>agora.</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '40px', lineHeight: 1.7, position: 'relative', maxWidth: '440px', margin: '0 auto 40px' }}>
              Sem câmera. Sem aparecer. Sem experiência.<br />
              <strong style={{ color: '#0F172A' }}>1 vídeo grátis para você testar agora.</strong>
            </p>
            <Link href="/register" className="cta-btn" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '18px 56px', borderRadius: '13px', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', fontFamily: "'Syne',sans-serif", boxShadow: '0 8px 44px rgba(197,24,58,.48)', marginBottom: '22px', position: 'relative' }}>
              Criar Meu Canal Grátis Agora →
            </Link>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#94A3B8', letterSpacing: '0.03em', position: 'relative' }}>
              Sem cartão · 1 vídeo grátis · 7 dias de garantia
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(0,0,0,.06)', padding: '32px 24px', position: 'relative', zIndex: 1, marginBottom: '56px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#fff', fontSize: '12px' }}>N</div>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '14px', fontWeight: 800, letterSpacing: '-0.04em' }}>NOCTURN.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Planos', href: '#planos' },
                { label: 'Entrar', href: '/login' },
                { label: 'Criar conta', href: '/register' },
                { label: 'Termos', href: '/termos' },
                { label: 'Privacidade', href: '/privacidade' },
              ].map((link, i) => (
                <Link key={i} href={link.href} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#94A3B8', transition: 'color .15s' }}>
                  {link.label}
                </Link>
              ))}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#94A3B8' }}>© 2025 NOCTURN.AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
