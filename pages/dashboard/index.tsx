import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PLAN_URLS: Record<string,string> = {
  starter: 'https://pay.cakto.com.br/8euvzxd',
  pro: 'https://pay.cakto.com.br/37beu86',
  enterprise: 'https://pay.cakto.com.br/izhvx9t',
}

const QUICK_PROMPTS = [
  { icon:'✝️', label:'Fé & Deus', text:'Um vídeo inspirador sobre a presença de Deus na vida das pessoas e como a fé transforma vidas' },
  { icon:'💀', label:'True Crime', text:'O caso real mais perturbador do true crime brasileiro que a mídia tentou esconder' },
  { icon:'🌿', label:'Natureza', text:'Os lugares mais belos e inexplorados do planeta Terra que poucos seres humanos já viram' },
  { icon:'💰', label:'Dinheiro', text:'Como pessoas comuns ficaram ricas do zero usando estratégias que os ricos não querem que você saiba' },
  { icon:'🏆', label:'Esportes', text:'A história real por trás do maior feito esportivo do Brasil que emocionou o mundo inteiro' },
  { icon:'🧠', label:'Ciência', text:'As descobertas científicas mais surpreendentes dos últimos anos que vão mudar sua visão de mundo' },
  { icon:'👽', label:'Mistério', text:'Os maiores mistérios não resolvidos da história que cientistas e governos ainda não conseguem explicar' },
  { icon:'🍕', label:'Gastronomia', text:'Os segredos das receitas mais famosas do mundo e a história por trás de cada prato icônico' },
]

const PLAN_CREDITS: Record<string,number> = { starter:20, pro:100, enterprise:99999 }

// ── Design tokens (in sync with globals.css CSS vars) ──────────────────────
const C = {
  void:    '#02040A',
  base:    '#05080F',
  layer:   '#080D1A',
  card:    '#0C1222',
  raised:  '#101828',
  focus:   '#152035',
  line:    '#192436',
  lineHi:  '#203050',
  red:     '#C5183A',
  redDim:  'rgba(197,24,58,.09)',
  redGlow: 'rgba(197,24,58,.18)',
  violet:  '#7C3AED',
  vDim:    'rgba(124,58,237,.1)',
  green:   '#059669',
  gDim:    'rgba(5,150,105,.1)',
  amber:   '#D97706',
  aDim:    'rgba(217,119,6,.1)',
  t1:      '#ECF2FA',
  t2:      '#6E8099',
  t3:      '#364A62',
}
const F = {
  body: "'Inter',system-ui,sans-serif",
  head: "'Space Grotesk',system-ui,sans-serif",
  mono: "'JetBrains Mono',monospace",
}
const shadow = {
  card:  '0 1px 3px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02)',
  float: '0 8px 24px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35)',
  modal: '0 32px 80px rgba(0,0,0,.85),0 4px 16px rgba(0,0,0,.5)',
  red:   '0 4px 20px rgba(197,24,58,.25)',
}
// ──────────────────────────────────────────────────────────────────────────

const selStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.line}`,
  borderRadius: '8px',
  padding: '9px 12px',
  color: C.t1,
  fontSize: '13px',
  outline: 'none',
  fontFamily: F.body,
  width: '100%',
  cursor: 'pointer',
  transition: 'border-color .15s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [view, setView] = useState('generator')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [platforms, setPlatforms] = useState(['youtube','tiktok'])
  const [contentType, setContentType] = useState('faceless')
  const [duration, setDuration] = useState('medium')
  const [voice, setVoice] = useState('masculine')
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [rewards, setRewards] = useState<any[]>([])
  const [rewardToast, setRewardToast] = useState('')
  const [claimingId, setClaimingId] = useState('')
  const [viewsInput, setViewsInput] = useState('')
  const [reportingVideoId, setReportingVideoId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [scriptPreview, setScriptPreview] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [toast, setToast] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    const token = t
    fetch('/api/videos', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setVideos(d.videos || []))
    fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setRewards(d.rewards || []))
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const togglePlat = (p: string) =>
    setPlatforms(prev => (prev||[]).includes(p) ? (prev||[]).filter(x => x !== p) : [...(prev||[]), p])

  const logSteps = [
    'INIT   Inicializando agente NOCTURN.AI...',
    'SCRIPT Gerando roteiro com GPT-4o...',
    'VOICE  Sintetizando narracao OpenAI TTS...',
    'VISUAL Buscando imagens no Pexels...',
    'EDIT   Aplicando efeitos cinematograficos...',
    'SUBS   Gerando legendas automaticas...',
    'ENCODE Codificando video final...',
    'THUMB  Otimizando thumbnail...',
    'DONE   Video gerado com sucesso!',
  ]

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const copyText = (text: string, label = 'Copiado!') => {
    navigator.clipboard.writeText(text).then(() => showToast(label))
  }

  const handlePreviewScript = async () => {
    if (!prompt.trim()) return
    setPreviewLoading(true); setScriptPreview(null)
    const token = localStorage.getItem('token') || ''
    try {
      const res = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ prompt, contentType, duration, voice }),
      })
      const data = await res.json()
      if (res.ok) setScriptPreview(data)
      else showToast(data.error || 'Erro ao gerar roteiro')
    } catch { showToast('Erro de conexão') }
    setPreviewLoading(false)
  }

  const handleGenerate = async (preScript?: any) => {
    if (!prompt.trim()) return
    setGenerating(true); setProgress(0); setLogs([])
    setScriptPreview(null)
    const token = localStorage.getItem('token') || ''
    let step = 0
    const iv = setInterval(() => {
      if (step >= logSteps.length) { clearInterval(iv); return }
      if (logSteps[step] !== undefined) { setLogs(p => [...p, logSteps[step]]) }
      setProgress(Math.round((step + 1) / logSteps.length * 100))
      step++
    }, 900)
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ prompt, contentType, duration, voice, platforms, scriptData: preScript || undefined })
      })
      const data = await res.json()
      setTimeout(async () => {
        clearInterval(iv); setGenerating(false); setProgress(100)
        if (res.ok && data.video) {
          setVideos(v => [data.video, ...v])
          const u = JSON.parse(localStorage.getItem('user') || '{}')
          u.credits = data.creditsRemaining
          localStorage.setItem('user', JSON.stringify(u))
          setUser((prev: any) => ({ ...prev, credits: data.creditsRemaining }))
          const rr = await fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
          const rd = await rr.json()
          setRewards(rd.rewards || [])
          const eligible = (rd.rewards || []).filter((r: any) => r.eligible)
          if (eligible.length > 0) {
            setRewardToast('Novo reward: ' + eligible[0].badge + ' ' + eligible[0].label)
            setTimeout(() => setRewardToast(''), 5000)
          }
        } else { alert(data.error || 'Erro ao gerar video') }
      }, logSteps.length * 900 + 600)
    } catch { clearInterval(iv); setGenerating(false); alert('Erro de conexao.') }
  }

  const handleClaimReward = async (rewardId: string) => {
    setClaimingId(rewardId)
    const token = localStorage.getItem('token') || ''
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ action: 'claim', rewardId })
      })
      const data = await res.json()
      if (res.ok) {
        setRewardToast(data.message || 'Reward resgatado!')
        setTimeout(() => setRewardToast(''), 4000)
        if (data.creditsEarned > 0) {
          const u = JSON.parse(localStorage.getItem('user') || '{}')
          u.credits = data.newCredits
          localStorage.setItem('user', JSON.stringify(u))
          setUser((prev: any) => ({ ...prev, credits: data.newCredits }))
        }
        const rr = await fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
        setRewards((await rr.json()).rewards || [])
      } else { alert(data.error) }
    } catch { alert('Erro ao resgatar') }
    setClaimingId('')
  }

  const handleReportViews = async (videoId: string) => {
    const views = parseInt(viewsInput)
    if (!views || views <= 0) return
    const token = localStorage.getItem('token') || ''
    const res = await fetch('/api/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ action: 'report_views', views, videoId })
    })
    if (res.ok) {
      setViewsInput(''); setReportingVideoId('')
      const rr = await fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
      setRewards((await rr.json()).rewards || [])
      setRewardToast('Views registradas!')
      setTimeout(() => setRewardToast(''), 3000)
    }
  }

  const logout = () => { localStorage.clear(); router.push('/') }

  if (!user) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:C.base,color:C.t3,fontFamily:F.body,fontSize:'13px',gap:'10px'}}>
      <div style={{width:'16px',height:'16px',borderRadius:'50%',border:`2px solid ${C.lineHi}`,borderTopColor:C.red,animation:'spin 0.8s linear infinite'}}/>
      Carregando...
    </div>
  )

  const maxCredits = PLAN_CREDITS[user.plan?.toLowerCase()] || 20
  const usedCredits = maxCredits === 99999 ? 0 : Math.max(0, maxCredits - (user.credits ?? maxCredits))
  const creditPct = maxCredits === 99999 ? 100 : Math.round(((user.credits ?? 0) / maxCredits) * 100)
  const eligibleRewards = rewards.filter(r => r.eligible)

  const NAV_ITEMS = [
    { id:'generator', icon:'◈', label:'Gerar Vídeo', badge:'IA', badgeColor: C.green, badgeBg: C.gDim },
    { id:'videos', icon:'▤', label:'Biblioteca', badge: videos.length > 0 ? String(videos.length) : undefined },
{ id:'rewards', icon:'◆', label:'Rewards', badge: eligibleRewards.length > 0 ? String(eligibleRewards.length) : undefined, badgeColor: C.red, badgeBg: C.redDim, badgeRed: true },
    { id:'billing', icon:'◎', label:'Assinatura' },
  ]

  const planColor = user.plan === 'enterprise' ? C.violet : user.plan === 'pro' ? C.red : C.green
  const planLabel = (user.plan || 'free').charAt(0).toUpperCase() + (user.plan || 'free').slice(1)

  return (
    <>
      <Head><title>Dashboard — NOCTURN.AI</title></Head>

      <style>{`
        .nav-item { transition: background .15s, color .15s, border-color .15s !important; }
        .nav-item:hover { background: rgba(255,255,255,.03) !important; color: ${C.t2} !important; }
        .card-hover { transition: border-color .18s, box-shadow .18s, transform .18s !important; }
        .card-hover:hover { border-color: ${C.lineHi} !important; box-shadow: ${shadow.float} !important; transform: translateY(-2px) !important; }
        .btn-primary { transition: background .15s, box-shadow .15s, opacity .15s !important; }
        .btn-primary:hover:not(:disabled) { box-shadow: ${shadow.red} !important; }
        .btn-ghost { transition: border-color .15s, color .15s, background .15s !important; }
        .btn-ghost:hover { border-color: ${C.lineHi} !important; color: ${C.t2} !important; background: rgba(255,255,255,.03) !important; }
        .chip { transition: border-color .15s, background .15s, color .15s !important; }
        .chip:hover { border-color: rgba(197,24,58,.3) !important; }
        .quick-prompt { transition: border-color .15s, background .15s !important; }
        .quick-prompt:hover { border-color: ${C.lineHi} !important; background: ${C.raised} !important; }
        .sel-row select:focus { border-color: ${C.red} !important; }
        .textarea-prompt:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px rgba(197,24,58,.08) !important; }
        .sidebar-footer-btn { transition: background .12s !important; }
        .sidebar-footer-btn:hover { background: rgba(255,255,255,.06) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.lineHi}; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      `}</style>

      {/* Toast */}
      {(rewardToast || toast) && (
        <div style={{position:'fixed',top:'24px',right:'24px',zIndex:9999,background:C.card,border:`1px solid ${C.red}`,color:C.t1,padding:'12px 18px',borderRadius:'10px',fontWeight:600,fontSize:'13px',boxShadow:shadow.float,fontFamily:F.body,maxWidth:'300px',animation:'fadeUp .2s ease'}}>
          {rewardToast || toast}
        </div>
      )}

      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:C.base,color:C.t1,fontFamily:F.body}}>

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <div style={{width:'240px',background:C.layer,borderRight:`1px solid ${C.line}`,display:'flex',flexDirection:'column',flexShrink:0}}>

          {/* Logo */}
          <div style={{padding:'20px 18px 18px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{
              width:'32px',height:'32px',
              background:`linear-gradient(135deg,${C.red},#8B0A22)`,
              borderRadius:'8px',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:F.head,fontWeight:800,color:'#fff',fontSize:'15px',
              flexShrink:0,letterSpacing:'-0.5px',
              boxShadow:'0 2px 8px rgba(197,24,58,.35)',
            }}>N</div>
            <div>
              <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,lineHeight:1.2}}>NOCTURN.AI</div>
              <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.12em',textTransform:'uppercase',marginTop:'2px'}}>Video SaaS</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{padding:'12px 10px',flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'2px'}}>
            <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.12em',padding:'2px 8px 8px',textTransform:'uppercase'}}>Menu</div>
            {NAV_ITEMS.map(item => {
              const active = view === item.id
              return (
                <div key={item.id} onClick={() => setView(item.id)}
                  className="nav-item"
                  style={{
                    display:'flex',alignItems:'center',gap:'10px',
                    padding:'9px 10px',
                    borderRadius:'8px',
                    cursor:'pointer',
                    fontSize:'13px',
                    fontWeight: active ? 600 : 400,
                    color: active ? C.t1 : C.t3,
                    background: active ? C.focus : 'transparent',
                    borderLeft: `2px solid ${active ? C.red : 'transparent'}`,
                    paddingLeft: '8px',
                  }}>
                  <span style={{fontFamily:F.mono,fontSize:'12px',color:active?C.red:C.t3,lineHeight:1}}>{item.icon}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontFamily:F.mono,
                      fontSize:'9px',padding:'2px 6px',borderRadius:'9px',fontWeight:600,
                      background: (item as any).badgeRed ? C.redDim : item.badge === 'IA' ? C.gDim : C.redDim,
                      color: (item as any).badgeRed ? C.red : item.badge === 'IA' ? C.green : C.t2,
                      border:`1px solid ${(item as any).badgeRed ? 'rgba(197,24,58,.2)' : item.badge === 'IA' ? 'rgba(5,150,105,.2)' : C.line}`,
                    }}>{item.badge}</span>
                  )}
                </div>
              )
            })}
            {user.role === 'admin' && (
              <>
                <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.12em',padding:'14px 8px 4px',textTransform:'uppercase'}}>Admin</div>
                <div onClick={() => router.push('/admin')}
                  className="nav-item"
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',paddingLeft:'8px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',color:C.t3,borderLeft:'2px solid transparent'}}>
                  <span style={{fontFamily:F.mono,fontSize:'12px',color:C.t3}}>⬡</span>
                  Painel Admin
                </div>
              </>
            )}
          </nav>

          {/* Bottom: Credits + User */}
          <div style={{padding:'12px',borderTop:`1px solid ${C.line}`,display:'flex',flexDirection:'column',gap:'8px'}}>
            {/* Credits card */}
            <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'12px',boxShadow:shadow.card}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                <span style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Créditos</span>
                <span style={{fontFamily:F.mono,fontSize:'11px',fontWeight:600,color:creditPct<25?C.red:creditPct<50?C.amber:C.green}}>
                  {maxCredits===99999 ? '∞' : `${Math.min(user.credits??0,maxCredits)}/${maxCredits}`}
                </span>
              </div>
              {maxCredits !== 99999 && (
                <>
                  <div style={{height:'3px',background:C.line,borderRadius:'2px',overflow:'hidden',marginBottom:'6px'}}>
                    <div style={{height:'100%',width:`${Math.min(100,creditPct)}%`,background:creditPct<25?C.red:creditPct<50?C.amber:C.green,borderRadius:'2px',transition:'width .5s'}}/>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>{usedCredits} de {maxCredits} usados</div>
                  {creditPct < 30 && (
                    <div onClick={() => setView('billing')}
                      style={{marginTop:'8px',padding:'5px 8px',background:C.redDim,border:`1px solid rgba(197,24,58,.15)`,borderRadius:'6px',fontSize:'10px',color:C.red,cursor:'pointer',fontFamily:F.body,fontWeight:500,transition:'background .12s'}}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(197,24,58,.14)'}
                      onMouseLeave={e => e.currentTarget.style.background=C.redDim}>
                      Créditos baixos — upgrade →
                    </div>
                  )}
                </>
              )}
            </div>

            {/* User row */}
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',background:C.card,border:`1px solid ${C.line}`,boxShadow:shadow.card}}>
              <div style={{
                width:'28px',height:'28px',borderRadius:'50%',
                background:`linear-gradient(135deg,${C.violet},${C.red})`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'11px',fontWeight:700,color:'#fff',flexShrink:0,
              }}>
                {(user.name||'U')[0].toUpperCase()}
              </div>
              <div style={{flex:1,overflow:'hidden'}}>
                <div style={{fontSize:'12px',color:C.t1,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.3}}>{user.name}</div>
                <div style={{fontFamily:F.mono,fontSize:'8px',color:planColor,letterSpacing:'0.06em',textTransform:'uppercase',marginTop:'1px'}}>{planLabel}</div>
              </div>
              <button onClick={logout}
                className="sidebar-footer-btn"
                style={{background:'none',border:'none',color:C.t3,fontSize:'11px',cursor:'pointer',fontFamily:F.body,padding:'4px 6px',borderRadius:'5px',whiteSpace:'nowrap',lineHeight:1}}>
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN ─────────────────────────────────────────────── */}
        <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column'}}>

          {/* Top bar */}
          <div style={{padding:'0 32px',height:'56px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(5,8,15,.92)`,position:'sticky',top:0,zIndex:10,backdropFilter:'blur(12px)',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1}}>
                {view==='generator'?'Gerar Vídeo':view==='videos'?'Biblioteca':view==='rewards'?'Rewards':'Assinatura'}
              </div>
              {view === 'generator' && (
                <span style={{fontFamily:F.mono,fontSize:'9px',background:C.gDim,border:'1px solid rgba(5,150,105,.2)',color:C.green,padding:'3px 8px',borderRadius:'9px',fontWeight:500,letterSpacing:'0.04em'}}>GPT-4o · OpenAI TTS · Pexels</span>
              )}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,letterSpacing:'0.04em'}}>
                {user.name?.split(' ')[0]}
              </div>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:C.green,boxShadow:'0 0 6px rgba(5,150,105,.6)'}}/>
            </div>
          </div>

          {/* Content */}
          <div style={{padding:'28px 32px',flex:1}}>

            {/* ── ONBOARDING BANNER — free user, 0 videos generated ─── */}
            {user.plan === 'free' && (user.videoCount === 0 || videos.length === 0) && (user.credits ?? 0) >= 1 && view === 'generator' && (
              <div style={{background:'linear-gradient(135deg,rgba(197,24,58,.12),rgba(124,58,237,.08))',border:'1px solid rgba(197,24,58,.3)',borderRadius:'14px',padding:'20px 24px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{fontSize:'26px',lineHeight:1}}>🎁</div>
                  <div>
                    <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,color:C.t1,marginBottom:'3px'}}>Você tem 1 crédito grátis!</div>
                    <div style={{fontFamily:F.body,fontSize:'12px',color:C.t2}}>Gere seu primeiro vídeo agora — sem precisar de cartão.</div>
                  </div>
                </div>
                <button onClick={() => { const el = document.getElementById('prompt-textarea'); el?.focus(); el?.scrollIntoView({behavior:'smooth'}) }}
                  className="btn-primary"
                  style={{background:`linear-gradient(135deg,${C.red},#8B0A22)`,border:'none',color:'#fff',padding:'10px 20px',borderRadius:'9px',fontFamily:F.head,fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,boxShadow:shadow.red,whiteSpace:'nowrap'}}>
                  Gerar agora →
                </button>
              </div>
            )}

            {/* ── UPGRADE BANNER — free user, used their 1 free credit ── */}
            {user.plan === 'free' && (user.credits ?? 0) === 0 && videos.length >= 1 && view === 'generator' && (
              <div style={{background:'linear-gradient(135deg,rgba(217,119,6,.1),rgba(197,24,58,.08))',border:'1px solid rgba(217,119,6,.35)',borderRadius:'14px',padding:'20px 24px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{fontSize:'26px',lineHeight:1}}>⚡</div>
                  <div>
                    <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,color:C.t1,marginBottom:'3px'}}>Seu crédito grátis foi usado!</div>
                    <div style={{fontFamily:F.body,fontSize:'12px',color:C.t2}}>Faça upgrade para continuar gerando vídeos virais todos os dias.</div>
                  </div>
                </div>
                <button onClick={() => setView('billing')}
                  className="btn-primary"
                  style={{background:`linear-gradient(135deg,#D97706,#b45309)`,border:'none',color:'#fff',padding:'10px 20px',borderRadius:'9px',fontFamily:F.head,fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(217,119,6,.3)'}}>
                  Ver planos →
                </button>
              </div>
            )}

            {/* ── GENERATOR ─────────────────────────────────────── */}
            {view === 'generator' && (
              <div style={{maxWidth:'960px'}}>

                {/* Stats row */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
                  {[
                    {label:'Vídeos Gerados', value:videos.length, sub:'total na biblioteca', highlight:true},
                    {label:'Créditos', value:maxCredits===99999?'∞':Math.min(user.credits??0,maxCredits), sub:maxCredits===99999?'ilimitados':`de ${maxCredits} disponíveis`},
                    {label:'Plano', value:planLabel, sub:'plano atual', color:planColor},
                  ].map((stat,i) => (
                    <div key={i} className="card-hover" style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'12px',padding:'20px 22px',boxShadow:shadow.card,cursor:'default'}}>
                      <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>{stat.label}</div>
                      <div style={{fontFamily:F.head,fontSize:'28px',fontWeight:800,color:stat.color||(stat.highlight?C.red:C.t1),letterSpacing:'-0.04em',lineHeight:1,marginBottom:'6px'}}>{stat.value}</div>
                      <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Generator card */}
                <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'16px',padding:'28px',marginBottom:'16px',boxShadow:shadow.card}}>

                  {/* Card header */}
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'24px'}}>
                    <div>
                      <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'4px'}}>Agente de Vídeo</div>
                      <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>Roteiro → Voz → Imagens → Player</div>
                    </div>
                    <div style={{display:'flex',gap:'6px'}}>
                      {['GPT-4o','TTS','Pexels'].map(badge => (
                        <span key={badge} style={{fontFamily:F.mono,fontSize:'8px',background:C.raised,border:`1px solid ${C.lineHi}`,color:C.t2,padding:'3px 8px',borderRadius:'6px',letterSpacing:'0.04em'}}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="sel-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Tipo de Conteúdo</label>
                      <select value={contentType} onChange={e=>setContentType(e.target.value)} style={selStyle}>
                        <option value="faceless">Faceless / Dark Channel</option>
                        <option value="educational">Educativo / Documentário</option>
                        <option value="inspirational">Inspiracional / Motivacional</option>
                        <option value="religious">Religioso / Espiritual</option>
                        <option value="news">Notícias / Atualidades</option>
                        <option value="mystery">Mistério e Conspirações</option>
                        <option value="truecrime">True Crime</option>
                        <option value="finance">Finanças / Dinheiro</option>
                        <option value="nature">Natureza / Viagem</option>
                        <option value="sports">Esportes / Entretenimento</option>
                        <option value="food">Gastronomia / Culinária</option>
                        <option value="horror">Terror e Creepypasta</option>
                        <option value="asmr">ASMR / Relaxamento</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Duração</label>
                      <select value={duration} onChange={e=>setDuration(e.target.value)} style={selStyle}>
                        <option value="short">Short / Reel (30–60s)</option>
                        <option value="medium">Médio (5–10 min)</option>
                        <option value="long">Longo (15–30 min)</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick prompts */}
                  <div style={{marginBottom:'20px'}}>
                    <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>Temas populares</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                      {QUICK_PROMPTS.map((qp,i) => {
                        const active = prompt === qp.text
                        return (
                          <div key={i} onClick={() => setPrompt(qp.text)}
                            className="quick-prompt"
                            style={{
                              background: active ? C.focus : C.raised,
                              border: `1px solid ${active ? C.red : C.line}`,
                              borderRadius:'10px',padding:'12px 10px',cursor:'pointer',
                            }}>
                            <div style={{fontSize:'16px',marginBottom:'5px',lineHeight:1}}>{qp.icon}</div>
                            <div style={{fontFamily:F.body,fontSize:'11px',fontWeight:600,color:active?C.red:C.t2,lineHeight:1.3,letterSpacing:'-0.01em'}}>{qp.label}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Prompt textarea */}
                  <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'20px'}}>
                    <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Prompt / Tema do Vídeo</label>
                    <textarea
                      id="prompt-textarea"
                      className="textarea-prompt"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Ex: Um documentário sobre sociedades secretas que controlam o mundo..."
                      style={{
                        background:C.raised,
                        border:`1px solid ${C.line}`,
                        borderRadius:'10px',
                        padding:'14px 16px',
                        color:C.t1,
                        fontSize:'13px',
                        outline:'none',
                        resize:'vertical',
                        minHeight:'80px',
                        fontFamily:F.body,
                        lineHeight:1.6,
                        transition:'border-color .15s, box-shadow .15s',
                      }}
                    />
                  </div>

                  {/* Voice + Platforms */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Voz IA</label>
                      <select value={voice} onChange={e=>setVoice(e.target.value)} style={selStyle}>
                        <option value="masculine">Grave Masculina (PT-BR)</option>
                        <option value="feminine">Misteriosa Feminina (PT-BR)</option>
                        <option value="neutral">Neutro (PT-BR)</option>
                        <option value="asmr">Sussurrada (ASMR)</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Plataformas</label>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap',paddingTop:'2px'}}>
                        {['youtube','tiktok','instagram','shorts'].map(p => {
                          const on = (platforms||[]).includes(p)
                          return (
                            <div key={p} onClick={() => togglePlat(p)}
                              className="chip"
                              style={{
                                padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:500,cursor:'pointer',
                                border:`1px solid ${on ? 'rgba(197,24,58,.4)' : C.line}`,
                                color: on ? C.red : C.t3,
                                background: on ? C.redDim : 'transparent',
                              }}>
                              {p==='youtube'?'YouTube':p==='tiktok'?'TikTok':p==='instagram'?'Instagram':'Shorts'}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CTA row */}
                  <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
                    <button onClick={() => handleGenerate(scriptPreview)} disabled={generating || !prompt.trim()}
                      className="btn-primary"
                      style={{
                        padding:'12px 28px',
                        background: generating || !prompt.trim() ? C.raised : `linear-gradient(135deg,${C.red},#9A1028)`,
                        color:'#fff',
                        border:'none',borderRadius:'10px',
                        fontSize:'13px',fontWeight:700,
                        cursor: generating || !prompt.trim() ? 'not-allowed' : 'pointer',
                        opacity: generating || !prompt.trim() ? 0.45 : 1,
                        flexShrink:0,fontFamily:F.head,
                        letterSpacing:'-0.02em',
                      }}>
                      {generating ? 'Gerando...' : scriptPreview ? 'Gerar com este roteiro →' : 'Gerar Vídeo com IA →'}
                    </button>
                    {!generating && (
                      <button onClick={handlePreviewScript} disabled={previewLoading || !prompt.trim()}
                        className="btn-ghost"
                        style={{padding:'11px 18px',background:'transparent',border:`1px solid ${C.lineHi}`,color:C.t2,borderRadius:'10px',fontSize:'12px',fontWeight:600,cursor: previewLoading || !prompt.trim() ? 'not-allowed' : 'pointer',opacity: previewLoading || !prompt.trim() ? 0.4 : 1,flexShrink:0,fontFamily:F.body}}>
                        {previewLoading ? 'Gerando roteiro...' : '👁 Ver roteiro antes'}
                      </button>
                    )}
                    {generating && (
                      <>
                        <div style={{flex:1,height:'3px',background:C.line,borderRadius:'2px',overflow:'hidden'}}>
                          <div style={{height:'100%',background:`linear-gradient(90deg,${C.red},#E05070)`,borderRadius:'2px',transition:'width .5s',width:progress+'%'}}/>
                        </div>
                        <span style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,minWidth:'36px',textAlign:'right'}}>{progress}%</span>
                      </>
                    )}
                  </div>

                  {/* Logs */}
                  {logs.length > 0 && (
                    <div ref={logRef}
                      style={{background:C.void,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'14px 16px',fontFamily:F.mono,fontSize:'11px',color:C.t1,maxHeight:'136px',overflowY:'auto',marginTop:'16px',lineHeight:1.8}}>
                      {logs.map((l,i) => {
                        const line = l || ''
                        const tag = line.split(' ')[0] || ''
                        const msg = line.split(' ').slice(1).join(' ')
                        return (
                          <div key={i} style={{display:'flex',gap:'10px'}}>
                            <span style={{color:C.t3,minWidth:'28px',fontSize:'10px'}}>{String(i*3).padStart(2,'0')}s</span>
                            <span style={{color:line.includes('DONE')?C.green:C.amber,minWidth:'54px',fontWeight:500}}>{tag}</span>
                            <span style={{color:C.t2}}>{msg}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Script preview panel */}
                {scriptPreview && !generating && (
                  <div style={{background:C.card,border:`1px solid rgba(124,58,237,.3)`,borderRadius:'14px',padding:'20px 22px',boxShadow:shadow.card}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                      <div>
                        <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,color:C.t1,letterSpacing:'-0.02em'}}>Roteiro Gerado — Edite antes de gerar o vídeo</div>
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:C.violet,marginTop:'3px'}}>{scriptPreview.scenes?.length || 0} cenas · clique em gerar quando estiver pronto</div>
                      </div>
                      <button onClick={() => setScriptPreview(null)} style={{background:'transparent',border:'none',color:C.t3,cursor:'pointer',fontSize:'18px',lineHeight:1}}>×</button>
                    </div>
                    <div style={{marginBottom:'14px'}}>
                      <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>Título</div>
                      <input value={scriptPreview.title||''} onChange={e=>setScriptPreview((p:any)=>({...p,title:e.target.value}))}
                        style={{width:'100%',background:C.raised,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'9px 12px',color:C.t1,fontSize:'13px',outline:'none',fontFamily:F.body,boxSizing:'border-box'}}/>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'10px',maxHeight:'300px',overflowY:'auto'}}>
                      {(scriptPreview.scenes||[]).map((scene:any, i:number) => (
                        <div key={i} style={{background:C.raised,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'12px 14px'}}>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'8px'}}>CENA {i+1}</div>
                          <textarea value={scene.text||''} onChange={e=>{const s=[...scriptPreview.scenes]; s[i]={...s[i],text:e.target.value}; setScriptPreview((p:any)=>({...p,scenes:s}))}}
                            style={{width:'100%',background:'transparent',border:'none',color:C.t2,fontSize:'13px',outline:'none',resize:'vertical',minHeight:'60px',fontFamily:F.body,lineHeight:1.6,boxSizing:'border-box'}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent videos */}
                {videos.length > 0 && (
                  <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',overflow:'hidden',boxShadow:shadow.card}}>
                    <div style={{padding:'16px 22px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1}}>Gerados Recentemente</div>
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'2px'}}>{videos.length} vídeo{videos.length!==1?'s':''} no total</div>
                      </div>
                      <button onClick={() => setView('videos')}
                        className="btn-ghost"
                        style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t3,borderRadius:'8px',padding:'6px 14px',fontSize:'11px',cursor:'pointer',fontFamily:F.body,fontWeight:500}}>
                        Ver todos →
                      </button>
                    </div>
                    <div style={{padding:'16px 20px'}}>
                      <VideoGrid videos={videos.slice(0,3)} onSelect={setSelectedVideo}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── VIDEOS ─────────────────────────────────────────── */}
            {view === 'videos' && (
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',gap:'12px',flexWrap:'wrap'}}>
                  <div>
                    <h2 style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'4px'}}>Biblioteca</h2>
                    <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3}}>{videos.length} vídeo{videos.length!==1?'s':''} gerado{videos.length!==1?'s':''}</div>
                  </div>
                  <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                    <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                      placeholder="Buscar vídeos..." style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'8px 12px',color:C.t1,fontSize:'12px',outline:'none',fontFamily:F.body,width:'200px'}}
                      onFocus={e=>e.target.style.borderColor=C.red} onBlur={e=>e.target.style.borderColor=C.line}/>
                    <button onClick={() => setView('generator')}
                      className="btn-primary"
                      style={{background:`linear-gradient(135deg,${C.red},#9A1028)`,color:'#fff',border:'none',borderRadius:'10px',padding:'10px 20px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F.head,letterSpacing:'-0.02em',whiteSpace:'nowrap'}}>
                      + Novo Vídeo
                    </button>
                  </div>
                </div>
                {videos.length === 0 ? (
                  <div style={{textAlign:'center',padding:'80px 20px',color:C.t3}}>
                    <div style={{fontSize:'40px',marginBottom:'16px',opacity:.25}}>🎬</div>
                    <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,marginBottom:'8px',color:C.t2,letterSpacing:'-0.02em'}}>Nenhum vídeo ainda</div>
                    <div style={{fontSize:'13px',color:C.t3}}>Gere seu primeiro vídeo agora.</div>
                  </div>
                ) : <VideoGrid videos={videos.filter(v => !searchQuery || v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.prompt?.toLowerCase().includes(searchQuery.toLowerCase()))} onSelect={setSelectedVideo}/>}
              </div>
            )}

            {/* ── REWARDS ─────────────────────────────────────────── */}
            {view === 'rewards' && (
              <div style={{maxWidth:'900px'}}>
                <div style={{background:C.redDim,border:`1px solid rgba(197,24,58,.15)`,borderRadius:'14px',padding:'20px 24px',marginBottom:'28px'}}>
                  <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'6px'}}>Sistema de Rewards</div>
                  <div style={{fontSize:'13px',color:C.t2,lineHeight:1.7,fontWeight:400}}>Complete milestones gerando vídeos e acumulando views. Ganhe até <strong style={{color:C.red,fontWeight:600}}>2 créditos bônus por mês</strong>.</div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px',marginBottom:'32px'}}>
                  {(rewards||[]).filter((r:any) => r && r.id).map((r:any) => (
                    <div key={r.id} className="card-hover" style={{background:C.card,border:`1px solid ${r.unlocked?'rgba(5,150,105,.25)':r.eligible?'rgba(197,24,58,.3)':C.line}`,borderRadius:'12px',padding:'20px',opacity:r.unlocked?.65:1,boxShadow:shadow.card}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
                        <div style={{fontSize:'28px',lineHeight:1}}>{r.badge}</div>
                        <div>
                          <div style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,letterSpacing:'-0.025em',color:r.unlocked?C.green:r.eligible?C.red:C.t1,marginBottom:'2px'}}>
                            {r.unlocked?'✓ ':''}{r.label}
                          </div>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>
                            {r.type==='views'?'Milestone de views':'Milestone de criação'}
                            {r.credits>0&&<span style={{color:C.red,marginLeft:'8px',fontWeight:600}}>+{r.credits} crédito</span>}
                          </div>
                        </div>
                      </div>
                      {!r.unlocked && (
                        <div style={{marginBottom:'14px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'6px'}}>
                            <span>Progresso</span><span>{r.progress}/{r.target}</span>
                          </div>
                          <div style={{height:'3px',background:C.line,borderRadius:'2px',overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${Math.min(100,Math.round(r.progress/r.target*100))}%`,background:r.eligible?C.red:C.t3,borderRadius:'2px',transition:'width .6s'}}/>
                          </div>
                        </div>
                      )}
                      {r.eligible && !r.unlocked && (
                        <button onClick={() => handleClaimReward(r.id)} disabled={claimingId===r.id}
                          style={{width:'100%',background:`linear-gradient(135deg,${C.red},#9A1028)`,color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontSize:'12px',fontWeight:700,cursor:'pointer',opacity:claimingId===r.id?.5:1,fontFamily:F.head,letterSpacing:'-0.01em'}}>
                          {claimingId===r.id?'Resgatando...':r.credits>0?`Resgatar +${r.credits} crédito`:'Resgatar Badge'}
                        </button>
                      )}
                      {r.unlocked && <div style={{fontFamily:F.mono,fontSize:'10px',color:C.green,textAlign:'center',letterSpacing:'0.04em',fontWeight:500}}>Resgatado ✓</div>}
                    </div>
                  ))}
                </div>

                <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'24px',boxShadow:shadow.card}}>
                  <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'6px'}}>Reportar Views</div>
                  <div style={{fontSize:'13px',color:C.t2,marginBottom:'20px',lineHeight:1.7}}>Publique no YouTube/TikTok e reporte as views para desbloquear milestones.</div>
                  {videos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'24px',color:C.t3,fontSize:'13px'}}>Gere vídeos primeiro.</div>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {(videos||[]).slice(0,5).filter((v:any) => v&&v.id).map((v:any) => (
                        <div key={v.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:C.raised,border:`1px solid ${C.line}`,borderRadius:'10px'}}>
                          <div style={{flex:1,fontSize:'12px',color:C.t1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:500}}>{v.title}</div>
                          {reportingVideoId === v.id ? (
                            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                              <input type="number" value={viewsInput} onChange={e=>setViewsInput(e.target.value)} placeholder="ex: 1500"
                                style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'7px',padding:'6px 10px',color:C.t1,fontSize:'12px',outline:'none',width:'90px',fontFamily:F.body,transition:'border-color .15s'}}
                                onFocus={e=>e.target.style.borderColor=C.red}
                                onBlur={e=>e.target.style.borderColor=C.line}/>
                              <button onClick={() => handleReportViews(v.id)}
                                style={{background:C.red,color:'#fff',border:'none',borderRadius:'7px',padding:'6px 14px',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:F.head}}>
                                Salvar
                              </button>
                              <button onClick={() => setReportingVideoId('')}
                                className="btn-ghost"
                                style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t3,borderRadius:'7px',padding:'6px 10px',fontSize:'11px',cursor:'pointer',fontFamily:F.body}}>
                                ×
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setReportingVideoId(v.id)}
                              className="btn-ghost"
                              style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t3,borderRadius:'7px',padding:'5px 12px',fontSize:'11px',cursor:'pointer',whiteSpace:'nowrap',fontFamily:F.body,fontWeight:500}}>
                              + Views
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── BILLING ─────────────────────────────────────────── */}
            {view === 'billing' && (
              <div style={{maxWidth:'900px'}}>
                <div style={{marginBottom:'32px'}}>
                  <h2 style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'8px'}}>Assinatura</h2>
                  <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,background:C.card,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'10px 16px',display:'inline-block',boxShadow:shadow.card}}>
                    1 crédito = 1 vídeo completo · roteiro + voz + imagens + player · renova mensalmente
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px'}}>
                  {[
                    {n:'Starter',p:47,credits:20,url:PLAN_URLS.starter,color:C.green,features:['20 vídeos/mês','YouTube + TikTok','Roteiro GPT-4o','Voz IA PT-BR','Garantia 7 dias']},
                    {n:'Pro',p:97,credits:100,url:PLAN_URLS.pro,color:C.red,hot:true,features:['100 vídeos/mês','Todas as plataformas','Roteiro avançado','Voz personalizada','Suporte prioritário']},
                    {n:'Enterprise',p:297,credits:999,url:PLAN_URLS.enterprise,color:C.violet,features:['Créditos ilimitados','Multi-usuário','API completa','White-label','Gerente dedicado']},
                  ].map((pl,i) => {
                    const isCurrent = user.plan?.toLowerCase() === pl.n.toLowerCase()
                    return (
                      <div key={i} style={{
                        background:C.card,
                        border:`1px solid ${(pl as any).hot?'rgba(197,24,58,.3)':isCurrent?'rgba(5,150,105,.3)':C.line}`,
                        borderRadius:'16px',padding:'24px',position:'relative',display:'flex',flexDirection:'column',
                        boxShadow:(pl as any).hot?`${shadow.card},0 0 40px rgba(197,24,58,.08)`:shadow.card,
                      }}>
                        {(pl as any).hot && (
                          <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:`linear-gradient(135deg,${C.red},#9A1028)`,color:'#fff',fontSize:'9px',fontWeight:700,padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap',letterSpacing:'0.08em',boxShadow:shadow.red}}>
                            MAIS POPULAR
                          </div>
                        )}
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:pl.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'12px',fontWeight:600}}>{pl.n}</div>
                        <div style={{fontFamily:F.head,fontSize:'34px',fontWeight:800,letterSpacing:'-0.05em',marginBottom:'14px',lineHeight:1,color:C.t1}}>
                          R${pl.p}<span style={{fontSize:'12px',fontWeight:400,color:C.t3,letterSpacing:'0'}}>/mês</span>
                        </div>
                        <div style={{background:C.raised,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'12px',textAlign:'center',marginBottom:'16px'}}>
                          <div style={{fontFamily:F.head,fontSize:'24px',fontWeight:800,color:pl.color,letterSpacing:'-0.04em'}}>{pl.credits===999?'∞':pl.credits}</div>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'3px'}}>créditos / mês</div>
                        </div>
                        <ul style={{listStyle:'none',marginBottom:'20px',flex:1,display:'flex',flexDirection:'column',gap:'8px'}}>
                          {pl.features.map((f,j) => (
                            <li key={j} style={{fontSize:'12px',color:C.t2,display:'flex',alignItems:'center',gap:'8px',fontWeight:400}}>
                              <span style={{color:pl.color,fontSize:'10px',fontWeight:700}}>✓</span>{f}
                            </li>
                          ))}
                        </ul>
                        <a href={pl.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            display:'block',textAlign:'center',
                            background:(pl as any).hot?`linear-gradient(135deg,${C.red},#9A1028)`:'transparent',
                            border:(pl as any).hot?'none':`1px solid ${pl.color}`,
                            color:(pl as any).hot?'#fff':pl.color,
                            padding:'11px',borderRadius:'10px',fontWeight:700,fontSize:'13px',fontFamily:F.head,
                            letterSpacing:'-0.02em',
                            transition:'opacity .15s',
                          }}
                          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='.85'}
                          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
                          {isCurrent ? 'Plano atual ✓' : `Assinar ${pl.n} →`}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)}/>}
    </>
  )
}

// ── VIDEO GRID ───────────────────────────────────────────────────────────────
function VideoGrid({videos, onSelect}: {videos:any[], onSelect:(v:any)=>void}) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'}}>
      {(videos||[]).filter(v=>v&&v.id).map(v=>(
        <div key={v.id} onClick={()=>onSelect(v)}
          style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'border-color .18s,box-shadow .18s,transform .18s',boxShadow:'0 1px 3px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02)'}}
          onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='#203050';el.style.transform='translateY(-2px)';el.style.boxShadow='0 8px 24px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35)'}}
          onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='#192436';el.style.transform='translateY(0)';el.style.boxShadow='0 1px 3px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02)'}}>

          {/* Thumbnail */}
          <div style={{height:'124px',background:'linear-gradient(160deg,#08101C,#060910)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
            {v.images&&v.images[0]
              ?<img src={v.images[0]} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.4}}/>
              :<div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 35%,rgba(197,24,58,.07),transparent 60%)'}}/>
            }
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(2,4,10,.7),transparent 50%)'}}/>
            <div style={{position:'relative',zIndex:1,width:'42px',height:'42px',background:'rgba(197,24,58,.92)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'16px',boxShadow:'0 4px 20px rgba(197,24,58,.45)',backdropFilter:'blur(4px)'}}>▶</div>
            <div style={{position:'absolute',top:'8px',left:'8px',display:'flex',gap:'4px',zIndex:2}}>
              {(Array.isArray(v.platforms)?v.platforms:[]).slice(0,2).map((p:string)=>(
                <span key={p} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',fontWeight:600,padding:'2px 6px',borderRadius:'5px',background:'rgba(2,4,10,.85)',color:'#6E8099',backdropFilter:'blur(4px)',letterSpacing:'0.04em'}}>
                  {p==='youtube'?'YT':p==='tiktok'?'TT':'IG'}
                </span>
              ))}
            </div>
            <div style={{position:'absolute',bottom:'8px',right:'8px',zIndex:2,display:'flex',gap:'4px'}}>
              {v.hasAudio&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',padding:'2px 6px',borderRadius:'5px',background:'rgba(5,150,105,.9)',color:'#fff',fontWeight:600}}>VOZ</span>}
              {v.hasImages&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',padding:'2px 6px',borderRadius:'5px',background:'rgba(124,58,237,.9)',color:'#fff',fontWeight:600}}>IMG</span>}
            </div>
          </div>

          {/* Info */}
          <div style={{padding:'10px 14px 12px'}}>
            <div style={{fontSize:'12px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'#ECF2FA',marginBottom:'6px',fontFamily:"'Inter',sans-serif",letterSpacing:'-0.01em',lineHeight:1.3}}>{v.title||'Sem título'}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'#364A62'}}>
              <span>{v.duration==='short'?'30–60s':v.duration==='long'?'15–30min':'5–10min'}</span>
              <span style={{color:'rgba(197,24,58,.9)',fontWeight:600,letterSpacing:'0.02em'}}>Assistir →</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── VIDEO PLAYER MODAL ───────────────────────────────────────────────────────
function VideoPlayerModal({video, onClose}: {video:any, onClose:()=>void}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const animRef = React.useRef<number | null>(null)
  const sceneTimingRef = React.useRef<Array<{start:number, end:number}>>([])
  const isPlayingRef = React.useRef(false)
  const loadedImgsRef = React.useRef<(HTMLImageElement|null)[]>([])

  const [tab, setTab] = React.useState("player")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentScene, setCurrentScene] = React.useState(0)
  const [downloading, setDownloading] = React.useState(false)
  const [dlPct, setDlPct] = React.useState(0)
  const [dlLabel, setDlLabel] = React.useState("")
  const [loadedImgs, setLoadedImgs] = React.useState<(HTMLImageElement|null)[]>([])
  const [imgsReady, setImgsReady] = React.useState(false)
  const [audioReady, setAudioReady] = React.useState(!video.audioBase64)
  const [audioDuration, setAudioDuration] = React.useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = React.useState(0)
  const [copied, setCopied] = React.useState('')

  const M = {
    bg:    '#02040A',
    card:  '#080D1A',
    raised:'#0C1222',
    line:  '#192436',
    lineHi:'#203050',
    red:   '#C5183A',
    redDim:'rgba(197,24,58,.09)',
    violet:'#7C3AED',
    green: '#059669',
    t1:    '#ECF2FA',
    t2:    '#6E8099',
    t3:    '#364A62',
  }

  const images = video.images || []
  const scenes = video.scenes || []
  const N = Math.max(scenes.length, images.length, 1)
  const hasAudio = !!video.audioBase64
  const secPerScene = video.duration === "short" ? 4 : video.duration === "long" ? 10 : 6

  // ── Load images ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (images.length === 0) { setImgsReady(true); return }
    let done = 0
    const loaded: (HTMLImageElement|null)[] = new Array(images.length).fill(null)
    images.forEach((url: string, i: number) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loaded[i] = img; done++
        if (done === images.length) { loadedImgsRef.current = loaded; setLoadedImgs(loaded); setImgsReady(true) }
      }
      img.onerror = () => {
        done++
        if (done === images.length) { loadedImgsRef.current = loaded; setLoadedImgs(loaded); setImgsReady(true) }
      }
      img.src = url
    })
  }, [])

  // ── Compute scene timing from audio duration (word-count based) ────────────
  const computeSceneTiming = React.useCallback((duration: number) => {
    if (scenes.length === 0 || duration <= 0) return
    const wcs = scenes.map((s: any) => Math.max(1, (s.text || '').split(/\s+/).filter(Boolean).length))
    const totalW = wcs.reduce((a: number, b: number) => a + b, 0)
    let t = 0
    sceneTimingRef.current = wcs.map((wc: number) => {
      const start = t
      t += (wc / totalW) * duration
      return { start, end: t }
    })
  }, [scenes])

  const onAudioLoaded = React.useCallback(() => {
    const dur = audioRef.current?.duration || 0
    if (dur > 0) {
      setAudioDuration(dur)
      computeSceneTiming(dur)
    }
    setAudioReady(true)
  }, [computeSceneTiming])

  // ── All words flat list (for global subtitle tracking) ──────────────────────
  const allWords = React.useMemo(() =>
    scenes.flatMap((s: any) => (s.text || '').split(/\s+/).filter(Boolean)),
  [scenes])

  // ── Draw subtitles: global karaoke window (12 words visible, current highlighted)
  const drawSubtitles = (ctx: CanvasRenderingContext2D, currentWordIdx: number, W: number, H: number) => {
    if (allWords.length === 0) return
    ctx.save()
    ctx.font = 'bold 26px Arial, sans-serif'
    ctx.textBaseline = 'alphabetic'

    // Show a window of up to 12 words, centered ~3 words before current
    const WINDOW = 12
    const winStart = Math.max(0, currentWordIdx - 3)
    const winEnd = Math.min(allWords.length, winStart + WINDOW)
    const windowWords = allWords.slice(winStart, winEnd)
    const localIdx = currentWordIdx - winStart // index within window

    const maxLineW = W - 100
    type LineData = { words: string[], startIdx: number }
    const lines: LineData[] = []
    let line: string[] = [], lineW = 0, lineStartIdx = 0

    windowWords.forEach((word: string, i: number) => {
      const ww = ctx.measureText(word + ' ').width
      if (lineW + ww > maxLineW && line.length > 0) {
        lines.push({ words: [...line], startIdx: lineStartIdx })
        lineStartIdx = i; line = [word]; lineW = ww
      } else {
        if (line.length === 0) lineStartIdx = i
        line.push(word); lineW += ww
      }
    })
    if (line.length > 0) lines.push({ words: line, startIdx: lineStartIdx })

    const lineH = 38
    const totalH = lines.length * lineH + 20
    const baseY = H - 16

    // Background pill
    ctx.fillStyle = 'rgba(0,0,0,0.68)'
    ctx.beginPath()
    const bgX = 24, bgY = baseY - totalH - 2, bgW = W - 48, bgHH = totalH + 4, r = 10
    ctx.moveTo(bgX + r, bgY); ctx.lineTo(bgX + bgW - r, bgY)
    ctx.arcTo(bgX + bgW, bgY, bgX + bgW, bgY + r, r)
    ctx.lineTo(bgX + bgW, bgY + bgHH - r)
    ctx.arcTo(bgX + bgW, bgY + bgHH, bgX + bgW - r, bgY + bgHH, r)
    ctx.lineTo(bgX + r, bgY + bgHH)
    ctx.arcTo(bgX, bgY + bgHH, bgX, bgY + bgHH - r, r)
    ctx.lineTo(bgX, bgY + r)
    ctx.arcTo(bgX, bgY, bgX + r, bgY, r)
    ctx.closePath(); ctx.fill()

    let gi = 0
    lines.forEach((ln, li) => {
      const lineWidth = ln.words.reduce((acc: number, w: string) => acc + ctx.measureText(w + ' ').width, 0)
      const y = baseY - (lines.length - 1 - li) * lineH - 6
      let x = (W - lineWidth) / 2
      ln.words.forEach((word: string) => {
        const wIdx = ln.startIdx + gi - (gi - ln.words.indexOf(word))
        const absIdx = ln.startIdx + ln.words.indexOf(word)
        const isCurrent = absIdx === localIdx
        const isSpoken = absIdx < localIdx
        if (isCurrent) {
          ctx.shadowColor = 'rgba(255,229,92,0.7)'; ctx.shadowBlur = 16; ctx.fillStyle = '#FFE55C'
        } else if (isSpoken) {
          ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 6; ctx.fillStyle = '#FFFFFF'
        } else {
          ctx.shadowColor = 'none'; ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.35)'
        }
        ctx.fillText(word, x, y)
        x += ctx.measureText(word + ' ').width
        gi++
      })
    })
    ctx.restore()
  }

  // ── Draw canvas frame ──────────────────────────────────────────────────────
  const drawFrame = React.useCallback((ctx: CanvasRenderingContext2D, sceneIdx: number, pct: number, globalT?: number) => {
    const W = 1280, H = 720
    ctx.clearRect(0, 0, W, H)
    const imgs = loadedImgsRef.current
    const img = imgs[sceneIdx] || imgs[0] || null

    if (img) {
      const scale = 1 + pct * 0.035
      ctx.save()
      ctx.filter = 'brightness(0.4) saturate(0.65)'
      ctx.drawImage(img, (W - W*scale)/2, (H - H*scale)/2, W*scale, H*scale)
      ctx.restore()
    } else {
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 640)
      g.addColorStop(0, '#0D0515'); g.addColorStop(1, '#020408')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    }

    // Vignette overlay
    const ov = ctx.createLinearGradient(0, H*0.28, 0, H)
    ov.addColorStop(0, 'rgba(0,0,0,0)'); ov.addColorStop(0.6, 'rgba(0,0,0,0.55)'); ov.addColorStop(1, 'rgba(0,0,0,0.96)')
    ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)

    // ── Global word tracking for subtitles ──────────────────────────────────
    // Use audio currentTime mapped globally to all words (not per-scene pct)
    // This ensures subtitles never drift even if TTS speed varies per word
    const totalDurForSubs = audioDuration > 0 ? audioDuration : N * secPerScene
    const effectiveT = globalT !== undefined ? globalT
      : (sceneTimingRef.current[sceneIdx]
        ? sceneTimingRef.current[sceneIdx].start + pct * (sceneTimingRef.current[sceneIdx].end - sceneTimingRef.current[sceneIdx].start)
        : sceneIdx * secPerScene + pct * secPerScene)
    const currentWordIdx = allWords.length > 0 && totalDurForSubs > 0
      ? Math.min(Math.floor((effectiveT / totalDurForSubs) * allWords.length), allWords.length - 1)
      : 0
    drawSubtitles(ctx, currentWordIdx, W, H)

    // Watermark
    ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(14, 14, 154, 34)
    ctx.fillStyle = '#C5183A'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left'; ctx.shadowBlur = 0
    ctx.fillText('NOCTURN.AI', 26, 37)

    // Scene counter badge
    ctx.fillStyle = 'rgba(197,24,58,0.88)'; ctx.fillRect(W - 66, 14, 52, 28)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'
    ctx.fillText(`${sceneIdx+1}/${N}`, W - 40, 33)

    // Progress bar
    const prog = (sceneIdx + pct) / N
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, H - 5, W, 5)
    ctx.fillStyle = '#C5183A'; ctx.fillRect(0, H - 5, W * prog, 5)
  }, [scenes, N, allWords, audioDuration, secPerScene, video.script])

  // ── Playback loop ──────────────────────────────────────────────────────────
  const cancelLoop = React.useCallback(() => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
  }, [])

  const startPlay = React.useCallback(() => {
    if (!canvasRef.current || !imgsReady) return
    const ctx = canvasRef.current.getContext('2d')!
    const audio = audioRef.current
    isPlayingRef.current = true
    setIsPlaying(true)

    if (audio && hasAudio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    // Timer fallback for no-audio / no timing computed yet
    let timerStart = performance.now()

    const loop = () => {
      if (!isPlayingRef.current) return
      let sceneIdx: number, pct: number, t = 0

      if (audio && hasAudio && sceneTimingRef.current.length > 0) {
        // ── Audio-driven (primary mode) ──
        t = audio.currentTime
        setAudioCurrentTime(t)

        // Find which scene we're in
        sceneIdx = 0
        for (let i = sceneTimingRef.current.length - 1; i >= 0; i--) {
          if (t >= sceneTimingRef.current[i].start) { sceneIdx = i; break }
        }
        const timing = sceneTimingRef.current[sceneIdx]
        const sceneDur = timing.end - timing.start
        pct = sceneDur > 0 ? Math.min((t - timing.start) / sceneDur, 1) : 0

        if (audio.ended || t >= (audioDuration || N * secPerScene)) {
          drawFrame(ctx, N - 1, 1, audioDuration || N * secPerScene)
          isPlayingRef.current = false; setIsPlaying(false); setCurrentScene(0); setAudioCurrentTime(0)
          return
        }
      } else {
        // ── Timer-driven fallback ──
        const elapsed = (performance.now() - timerStart) / 1000
        setAudioCurrentTime(elapsed)
        t = elapsed
        sceneIdx = Math.min(Math.floor(elapsed / secPerScene), N - 1)
        pct = Math.min((elapsed % secPerScene) / secPerScene, 1)

        if (elapsed >= N * secPerScene) {
          drawFrame(ctx, N - 1, 1, N * secPerScene)
          isPlayingRef.current = false; setIsPlaying(false); setCurrentScene(0); setAudioCurrentTime(0)
          if (audio) { audio.pause(); audio.currentTime = 0 }
          return
        }
      }

      setCurrentScene(sceneIdx)
      drawFrame(ctx, sceneIdx, pct, t)
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
  }, [imgsReady, hasAudio, drawFrame, N, secPerScene, audioDuration, cancelLoop])

  const stopPlay = React.useCallback(() => {
    isPlayingRef.current = false; setIsPlaying(false); setCurrentScene(0); setAudioCurrentTime(0)
    cancelLoop()
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
    const canvas = canvasRef.current
    if (canvas && imgsReady) drawFrame(canvas.getContext('2d')!, 0, 0)
  }, [imgsReady, drawFrame, cancelLoop])

  const seekTo = React.useCallback((pct: number) => {
    const audio = audioRef.current
    const dur = audioDuration || N * secPerScene
    if (audio && hasAudio) {
      audio.currentTime = pct * dur
    }
    if (!isPlayingRef.current && canvasRef.current && imgsReady) {
      const t = pct * dur
      let sceneIdx = 0
      if (sceneTimingRef.current.length > 0) {
        for (let i = sceneTimingRef.current.length - 1; i >= 0; i--) {
          if (t >= sceneTimingRef.current[i].start) { sceneIdx = i; break }
        }
        const timing = sceneTimingRef.current[sceneIdx]
        const scenePct = timing ? Math.min((t - timing.start) / (timing.end - timing.start), 1) : 0
        drawFrame(canvasRef.current.getContext('2d')!, sceneIdx, scenePct, t)
      }
    }
  }, [audioDuration, N, secPerScene, hasAudio, imgsReady, drawFrame])

  React.useEffect(() => {
    if (imgsReady && canvasRef.current) drawFrame(canvasRef.current.getContext('2d')!, 0, 0)
  }, [imgsReady, drawFrame])

  React.useEffect(() => () => { isPlayingRef.current = false; cancelLoop() }, [cancelLoop])

  const downloadVideo = async () => {
    if (images.length===0) { alert("Gere um novo vídeo para ter imagens."); return }
    setDownloading(true); setDlPct(0); setDlLabel("Preparando...")
    try {
      const off = document.createElement("canvas")
      off.width=1280; off.height=720
      const ctx = off.getContext("2d")!
      const stream = off.captureStream(30)
      if (video.audioBase64) {
        try {
          const ac=new AudioContext()
          const buf=await(await fetch(video.audioBase64)).arrayBuffer()
          const dec=await ac.decodeAudioData(buf)
          const dest=ac.createMediaStreamDestination()
          const src=ac.createBufferSource()
          src.buffer=dec; src.connect(dest); src.start()
          dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t))
        } catch(e){console.log("audio",e)}
      }
      const chunks: Blob[] = []
      const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm"
      const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3000000})
      rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data)}
      rec.start(100)
      const FPS=30, totalFrames=N*secPerScene*FPS
      for (let f=0;f<totalFrames;f++) {
        const sc=Math.floor(f/(secPerScene*FPS))
        const pct=(f%(secPerScene*FPS))/(secPerScene*FPS)
        drawFrame(ctx,Math.min(sc,N-1),pct)
        if (f%30===0) { setDlPct(Math.round((f/totalFrames)*90)); setDlLabel("Renderizando cena "+(Math.min(sc,N-1)+1)+" de "+N+"..."); await new Promise(r=>setTimeout(r,0)) }
      }
      setDlLabel("Finalizando..."); rec.stop()
      await new Promise(res=>{rec.onstop=res})
      setDlPct(97)
      const blob=new Blob(chunks,{type:mime})
      const url=URL.createObjectURL(blob)
      const a=document.createElement("a")
      a.href=url; a.download=(video.title||"video").replace(/[^a-zA-Z0-9]/g,"_").substring(0,50)+".webm"
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDlPct(100); setDlLabel("Download concluído!")
      setTimeout(()=>{setDownloading(false);setDlPct(0);setDlLabel("")},2500)
    } catch(e:any) {
      console.error(e); alert("Erro ao gerar vídeo: "+e.message); setDownloading(false); setDlPct(0)
    }
  }

  // ── Format time mm:ss ──────────────────────────────────────────────────────
  const fmt = (s: number) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const totalDur = audioDuration || N * secPerScene
  const seekPct = totalDur > 0 ? Math.min(audioCurrentTime / totalDur, 1) : 0

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px",backdropFilter:"blur(16px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:M.bg,border:`1px solid ${M.lineHi}`,borderRadius:"20px",width:"100%",maxWidth:"820px",maxHeight:"95vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.9),0 4px 16px rgba(0,0,0,.5)"}}>

        {/* Header */}
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${M.line}`,display:"flex",alignItems:"center",gap:"12px",flexShrink:0}}>
          <div style={{flex:1,overflow:"hidden"}}>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"14px",fontWeight:700,color:M.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:"-0.025em"}}>{video.title||"Vídeo"}</div>
            <div style={{display:"flex",gap:"5px",marginTop:"5px",flexWrap:"wrap"}}>
              {(video.platforms||[]).map((p:string)=>(
                <span key={p} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",padding:"2px 7px",borderRadius:"5px",background:"rgba(255,255,255,.04)",color:M.t3,fontWeight:500,border:`1px solid ${M.line}`}}>{p}</span>
              ))}
              {video.hasAudio&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",padding:"2px 7px",borderRadius:"5px",background:"rgba(5,150,105,.1)",color:M.green,fontWeight:500,border:"1px solid rgba(5,150,105,.2)"}}>
                {audioReady ? "TTS sincronizado" : "Carregando áudio..."}
              </span>}
              {images.length>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",padding:"2px 7px",borderRadius:"5px",background:"rgba(124,58,237,.1)",color:"#A78BFA",fontWeight:500,border:"1px solid rgba(124,58,237,.2)"}}>{images.length} cenas</span>}
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:"2px",background:M.raised,borderRadius:"10px",padding:"3px",border:`1px solid ${M.line}`}}>
            {["player","roteiro","tags"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                background:tab===t?M.red:'transparent',
                color:tab===t?'#fff':M.t3,
                border:'none',borderRadius:"7px",padding:"5px 14px",
                fontSize:"11px",fontWeight:tab===t?700:400,cursor:"pointer",
                fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em",transition:"all .12s",
              }}>
                {t==="player"?"Player":t==="roteiro"?"Roteiro":"Tags"}
              </button>
            ))}
          </div>
          <button onClick={()=>{stopPlay();onClose()}}
            style={{background:"rgba(255,255,255,.04)",border:`1px solid ${M.line}`,color:M.t2,fontSize:"14px",cursor:"pointer",width:"30px",height:"30px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.09)";e.currentTarget.style.color=M.t1}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color=M.t2}}>×</button>
        </div>

        <div style={{flex:1,overflow:"auto"}}>

          {tab==="player"&&<div>
            {/* Canvas */}
            <div style={{position:"relative",background:"#000",lineHeight:0}}>
              <canvas ref={canvasRef} width={1280} height={720} style={{width:"100%",display:"block",aspectRatio:"16/9",maxHeight:"420px"}}/>
              {!isPlaying&&imgsReady&&audioReady&&(
                <div onClick={startPlay} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <div style={{width:"68px",height:"68px",background:"rgba(197,24,58,.92)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",color:"#fff",boxShadow:"0 8px 40px rgba(197,24,58,.5)",backdropFilter:"blur(4px)",transition:"transform .15s"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="scale(1.1)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="scale(1)"}>▶</div>
                </div>
              )}
              {(!imgsReady||!audioReady)&&(
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.7)"}}>
                  <div style={{textAlign:"center",color:M.t3,fontSize:"12px",fontFamily:"'JetBrains Mono',monospace"}}>
                    <div style={{width:"20px",height:"20px",border:`2px solid ${M.lineHi}`,borderTopColor:M.red,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 10px"}}/>
                    {!imgsReady ? "Carregando cenas..." : "Carregando áudio..."}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden audio with metadata handler */}
            {video.audioBase64&&(
              <audio ref={audioRef} src={video.audioBase64} style={{display:"none"}}
                onLoadedMetadata={onAudioLoaded}
                onEnded={()=>{isPlayingRef.current=false;setIsPlaying(false);setCurrentScene(0);setAudioCurrentTime(0);cancelLoop()}}/>
            )}

            {/* Controls */}
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${M.line}`,display:"flex",flexDirection:"column",gap:"10px"}}>
              {/* Seekbar */}
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:M.t3,minWidth:"36px"}}>{fmt(audioCurrentTime)}</span>
                <div style={{flex:1,height:"4px",background:M.line,borderRadius:"2px",cursor:"pointer",position:"relative"}}
                  onClick={e=>{
                    const rect=e.currentTarget.getBoundingClientRect()
                    seekTo((e.clientX-rect.left)/rect.width)
                  }}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:`${seekPct*100}%`,background:M.red,borderRadius:"2px",transition:"width .08s linear"}}/>
                  <div style={{position:"absolute",top:"50%",left:`${seekPct*100}%`,transform:"translate(-50%,-50%)",width:"10px",height:"10px",background:M.red,borderRadius:"50%",boxShadow:`0 0 6px ${M.red}`,transition:"left .08s linear"}}/>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:M.t3,minWidth:"36px",textAlign:"right"}}>{fmt(totalDur)}</span>
              </div>

              {/* Buttons row */}
              <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
                {imgsReady&&audioReady&&(!isPlaying
                  ?<button onClick={startPlay} style={{background:`linear-gradient(135deg,${M.red},#9A1028)`,color:"#fff",border:"none",borderRadius:"9px",padding:"9px 22px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:"-0.02em",boxShadow:"0 4px 20px rgba(197,24,58,.25)"}}>
                    ▶ Reproduzir{video.hasAudio?" com narração":""}
                  </button>
                  :<button onClick={stopPlay} style={{background:M.raised,color:M.t1,border:`1px solid ${M.line}`,borderRadius:"9px",padding:"9px 20px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>■ Parar</button>
                )}
                {images.length>0&&(
                  <button onClick={downloadVideo} disabled={downloading}
                    style={{background:downloading?"transparent":"rgba(124,58,237,.12)",color:downloading?M.t3:"#A78BFA",border:`1px solid ${downloading?M.line:"rgba(124,58,237,.3)"}`,borderRadius:"9px",padding:"9px 20px",fontSize:"13px",fontWeight:600,cursor:downloading?"not-allowed":"pointer",opacity:downloading?.6:1,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                    {downloading?"Gerando...":"↓ Baixar .webm"}
                  </button>
                )}
                {isPlaying&&(
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:M.green,display:"flex",alignItems:"center",gap:"5px",marginLeft:"auto"}}>
                    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:M.green,display:"inline-block",animation:"pulse 1s ease-in-out infinite"}}/>
                    Cena {currentScene+1}/{N}
                  </span>
                )}
              </div>
            </div>

            {/* Download progress */}
            {downloading&&(
              <div style={{padding:"10px 16px",borderBottom:`1px solid ${M.line}`}}>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:M.t3,marginBottom:"5px"}}>
                  <span>{dlLabel}</span><span>{dlPct}%</span>
                </div>
                <div style={{height:"3px",background:M.line,borderRadius:"2px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:dlPct+"%",background:"linear-gradient(90deg,#7C3AED,#A855F7)",borderRadius:"2px",transition:"width .2s"}}/>
                </div>
              </div>
            )}

            {/* Scene strip */}
            {images.length>0&&(
              <div style={{padding:"12px 16px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:M.t3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"8px"}}>{N} cenas — clique para pular</div>
                <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"4px"}}>
                  {images.map((img:string,i:number)=>(
                    <div key={i}
                      onClick={()=>{
                        cancelLoop(); isPlayingRef.current=false; setIsPlaying(false); setCurrentScene(i)
                        // Seek audio to scene start
                        if (audioRef.current && sceneTimingRef.current[i]) {
                          audioRef.current.currentTime = sceneTimingRef.current[i].start
                          setAudioCurrentTime(sceneTimingRef.current[i].start)
                        }
                        if (canvasRef.current&&imgsReady) drawFrame(canvasRef.current.getContext("2d")!,i,0)
                      }}
                      style={{flexShrink:0,borderRadius:"8px",overflow:"hidden",cursor:"pointer",border:currentScene===i?`2px solid ${M.red}`:`2px solid ${M.line}`,transition:"border-color .12s",position:"relative",width:"90px",height:"56px"}}>
                      <img src={img} alt="" style={{width:"90px",height:"56px",objectFit:"cover",filter:currentScene===i?"brightness(0.65)":"brightness(0.4)"}}/>
                      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"4px 5px"}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"rgba(255,255,255,.8)",fontWeight:700}}>C{i+1}</div>
                        {scenes[i]?.text&&<div style={{fontSize:"7px",color:"rgba(255,255,255,.4)",lineHeight:1.2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{scenes[i].text.substring(0,30)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length===0&&(
              <div style={{padding:"36px",textAlign:"center",color:M.t3}}>
                <div style={{fontSize:"32px",marginBottom:"12px",opacity:.2}}>🎬</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"13px",fontWeight:700,color:M.t2,marginBottom:"6px",letterSpacing:"-0.02em"}}>Sem imagens neste vídeo</div>
                <div style={{fontSize:"12px",lineHeight:1.7,color:M.t3}}>Gere um novo vídeo para ter imagens + narração sincronizada.</div>
              </div>
            )}
          </div>}

          {tab==="roteiro"&&<div style={{padding:"18px"}}>
            {/* Title copy */}
            {video.title&&(
              <div style={{background:M.raised,border:`1px solid ${M.line}`,borderRadius:"10px",padding:"12px 14px",marginBottom:"10px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:M.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Título</div>
                  <div style={{fontSize:"13px",color:M.t1,fontWeight:600,lineHeight:1.4}}>{video.title}</div>
                </div>
                <button onClick={()=>{navigator.clipboard.writeText(video.title||"");setCopied("title")}}
                  style={{background:copied==="title"?"rgba(5,150,105,.1)":"transparent",border:`1px solid ${copied==="title"?"rgba(5,150,105,.3)":M.line}`,color:copied==="title"?M.green:M.t3,borderRadius:"7px",padding:"6px 12px",fontSize:"11px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",flexShrink:0,transition:"all .15s"}}>
                  {copied==="title"?"✓ Copiado":"Copiar"}
                </button>
              </div>
            )}
            {/* Script */}
            <div style={{background:M.raised,border:`1px solid ${M.line}`,borderRadius:"10px",padding:"16px",marginBottom:"10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:M.t3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Roteiro completo</div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>{navigator.clipboard.writeText(video.script||"");setCopied("script")}}
                    style={{background:copied==="script"?"rgba(5,150,105,.1)":"transparent",border:`1px solid ${copied==="script"?"rgba(5,150,105,.3)":M.line}`,color:copied==="script"?M.green:M.t3,borderRadius:"6px",padding:"4px 10px",fontSize:"10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"all .15s"}}>
                    {copied==="script"?"✓ Copiado":"Copiar"}
                  </button>
                  <button onClick={()=>{const b=new Blob([video.script||""],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(video.title||"roteiro").replace(/[^a-zA-Z0-9]/g,"_").substring(0,40)+".txt";a.click();URL.revokeObjectURL(u)}}
                    style={{background:"transparent",border:`1px solid ${M.line}`,color:M.t3,borderRadius:"6px",padding:"4px 10px",fontSize:"10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=M.lineHi;e.currentTarget.style.color=M.t2}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=M.line;e.currentTarget.style.color=M.t3}}>
                    ↓ .txt
                  </button>
                </div>
              </div>
              <div style={{maxHeight:"220px",overflowY:"auto"}}>
                <pre style={{fontFamily:"'Inter',sans-serif",fontSize:"13px",color:"#C8D6E8",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>{video.script||"Roteiro não disponível."}</pre>
              </div>
            </div>
            {/* Description */}
            {video.description&&(
              <div style={{background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)",borderRadius:"10px",padding:"14px",marginBottom:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#A78BFA",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Descrição para publicação</div>
                  <button onClick={()=>{navigator.clipboard.writeText(video.description||"");setCopied("desc")}}
                    style={{background:copied==="desc"?"rgba(5,150,105,.1)":"transparent",border:`1px solid ${copied==="desc"?"rgba(5,150,105,.3)":"rgba(124,58,237,.2)"}`,color:copied==="desc"?M.green:"#A78BFA",borderRadius:"6px",padding:"4px 10px",fontSize:"10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"all .15s"}}>
                    {copied==="desc"?"✓ Copiado":"Copiar"}
                  </button>
                </div>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",color:M.t2,lineHeight:1.75,margin:0}}>{video.description}</p>
              </div>
            )}
            {/* Download audio */}
            {video.audioBase64&&(
              <button onClick={()=>{const a=document.createElement("a");a.href=video.audioBase64;a.download=(video.title||"audio").replace(/[^a-zA-Z0-9]/g,"_").substring(0,40)+".mp3";a.click()}}
                style={{background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.2)",color:M.green,borderRadius:"8px",padding:"9px 18px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:"8px",transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(5,150,105,.15)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(5,150,105,.08)"}>
                ↓ Baixar áudio (.mp3)
              </button>
            )}
          </div>}

          {tab==="tags"&&<div style={{padding:"18px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"16px"}}>
              {(video.tags||[]).map((tag:string,i:number)=>(
                <span key={i} style={{background:"rgba(5,150,105,.07)",border:"1px solid rgba(5,150,105,.18)",color:"#059669",padding:"6px 14px",borderRadius:"20px",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:500,letterSpacing:"0.02em",cursor:"pointer"}}
                  onClick={()=>{navigator.clipboard.writeText("#"+tag);setCopied("tag_"+tag)}}
                  title="Clique para copiar">
                  {copied==="tag_"+tag?"✓":"#"}{tag}
                </span>
              ))}
            </div>
            {(video.tags||[]).length>0&&(
              <button onClick={()=>{navigator.clipboard.writeText((video.tags||[]).map((t:string)=>"#"+t).join(" "));setCopied("alltags")}}
                style={{background:copied==="alltags"?"rgba(5,150,105,.1)":"transparent",border:`1px solid ${copied==="alltags"?"rgba(5,150,105,.3)":M.line}`,color:copied==="alltags"?M.green:M.t3,borderRadius:"8px",padding:"8px 16px",fontSize:"12px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:500,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=M.lineHi;e.currentTarget.style.color=M.t2}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=copied==="alltags"?"rgba(5,150,105,.3)":M.line;e.currentTarget.style.color=copied==="alltags"?M.green:M.t3}}>
                {copied==="alltags"?"✓ Copiadas!":"Copiar todas as tags"}
              </button>
            )}
          </div>}

        </div>
      </div>
    </div>
  )
}
