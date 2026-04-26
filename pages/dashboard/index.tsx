import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'

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

// ── Design tokens — Linear.app style (light, purple accent) ───────────────
const C = {
  void:    '#FFFFFF',
  base:    '#FAFAFA',
  layer:   '#F4F4F5',
  card:    '#FFFFFF',
  raised:  '#F4F4F5',
  focus:   '#EEE9FE',
  line:    '#E4E4E7',
  lineHi:  '#D4D4D8',
  red:     '#6E56CF',
  redDim:  'rgba(110,86,207,.08)',
  redGlow: 'rgba(110,86,207,.12)',
  violet:  '#4C3899',
  vDim:    'rgba(110,86,207,.06)',
  green:   '#16A34A',
  gDim:    'rgba(22,163,74,.08)',
  amber:   '#CA8A04',
  aDim:    'rgba(202,138,4,.08)',
  t1:      '#09090B',
  t2:      '#52525B',
  t3:      '#A1A1AA',
}
const F = {
  body: "'Inter',system-ui,sans-serif",
  head: "'Space Grotesk',system-ui,sans-serif",
  mono: "'JetBrains Mono',monospace",
}
const shadow = {
  card:  '0 1px 2px rgba(0,0,0,.05)',
  float: '0 2px 8px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04)',
  modal: '0 8px 24px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04)',
  red:   '0 4px 14px rgba(110,86,207,.3)',
}
// ──────────────────────────────────────────────────────────────────────────

const selStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: '9px 12px',
  color: '#09090B',
  fontSize: '14px',
  outline: 'none',
  fontFamily: "'Inter',system-ui,sans-serif",
  width: '100%',
  cursor: 'pointer',
  transition: 'border-color .15s, box-shadow .15s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

// ── CountUp animation ─────────────────────────────────────────────────────
function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = React.useState(0)
  React.useEffect(() => {
    if (to === 0) return
    let start = 0
    const step = Math.ceil(to / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(timer) }
      else setVal(start)
    }, 16)
    return () => clearInterval(timer)
  }, [to, duration])
  return <>{val}</>
}

// ── Generation pipeline ───────────────────────────────────────────────────
const GEN_STAGES = [
  { label: 'Roteiro', icon: '✦', steps: [0,1], color: '#6E56CF' },
  { label: 'Narração', icon: '🎙', steps: [2], color: '#2563EB' },
  { label: 'Vídeo IA', icon: '🎬', steps: [3,4], color: '#4C3899' },
  { label: 'Sync', icon: '⟳', steps: [5,6], color: '#CA8A04' },
  { label: 'Exportar', icon: '✓', steps: [7,8], color: '#16A34A' },
]
const GEN_PIPELINE_SUB = [
  'Agente NOCTURN.AI ativado','GPT-4o analisando tema...','OpenAI TTS sintetizando voz...',
  'Runway ML Gen-4.5 recebendo prompt...','Runway gerando cenas em MP4...','Sincronizando narração + vídeo...',
  'Calculando timing das legendas...','Finalizando exportação MP4...','Vídeo pronto! 🎉',
]
function GenerationPipeline({ step, progress, C, F }: { step:number; progress:number; C:any; F:any }) {
  return (
    <div style={{marginTop:'20px',background:C.raised,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'20px 22px',position:'relative',overflow:'hidden'}}>
      <div style={{height:'2px',background:C.line,borderRadius:'2px',marginBottom:'18px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#6E56CF,#4C3899,#16A34A)',borderRadius:'2px',transition:'width .6s ease'}}/>
      </div>
      <div style={{display:'flex',gap:'4px'}}>
        {GEN_STAGES.map((stage,i)=>{
          const isActive = stage.steps.some(s=>s===step)
          const isDone = !isActive && stage.steps.every(s=>s<step) && step>stage.steps[stage.steps.length-1]
          return (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'10px 6px',borderRadius:'10px',background:isActive?`${stage.color}12`:isDone?'rgba(22,163,74,.06)':'transparent',border:`1px solid ${isActive?stage.color+'40':isDone?'rgba(22,163,74,.2)':C.line}`,transition:'all .4s'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:isActive?stage.color:isDone?'#16A34A':C.card,border:`1px solid ${isActive?stage.color:isDone?'#16A34A':C.line}`,boxShadow:isActive?`0 0 12px ${stage.color}50`:'none',transition:'all .4s'}}>
                {isActive
                  ? <div style={{width:'14px',height:'14px',borderRadius:'50%',border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite'}}/>
                  : isDone
                  ? <span style={{color:'#fff',fontSize:'11px',fontWeight:700}}>✓</span>
                  : <span style={{fontSize:'11px',opacity:.4}}>{stage.icon}</span>
                }
              </div>
              <div style={{fontFamily:F.body,fontSize:'10px',fontWeight:isActive?700:500,color:isActive?stage.color:isDone?'#16A34A':C.t3,textAlign:'center',lineHeight:1.2,transition:'color .3s'}}>{stage.label}</div>
            </div>
          )
        })}
      </div>
      {step>=0&&step<GEN_PIPELINE_SUB.length&&(
        <div style={{marginTop:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:GEN_STAGES.find(s=>s.steps.includes(step))?.color||C.red,animation:'pulse 1.2s ease infinite',flexShrink:0}}/>
          <span style={{fontFamily:F.mono,fontSize:'11px',color:C.t2}}>{GEN_PIPELINE_SUB[step]}</span>
          <span style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,marginLeft:'auto'}}>{progress}%</span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const isEN = i18n.language === 'en-US'
  const [user, setUser] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [view, setView] = useState('generator')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [platforms, setPlatforms] = useState(['youtube','tiktok'])
  const [contentType, setContentType] = useState('faceless')
  const [duration, setDuration] = useState('short')
  const [voice, setVoice] = useState('masculine')
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [rewards, setRewards] = useState<any[]>([])
  const [rewardToast, setRewardToast] = useState('')
  const [claimingId, setClaimingId] = useState('')

  const [viewsInput, setViewsInput] = useState('')
  const [reportingVideoId, setReportingVideoId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [libContentType, setLibContentType] = useState('all')
  const [libDuration, setLibDuration] = useState('all')
  const [genStep, setGenStep] = useState(-1)
  const [scriptPreview, setScriptPreview] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
  const [format, setFormat] = useState('landscape')
  const [language, setLanguage] = useState('pt')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [referral, setReferral] = useState<any>(null)
  const [videosLoading, setVideosLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFirstVideoSuccess, setShowFirstVideoSuccess] = useState(false)
  const [rewardToastMsg, setRewardToastMsg] = useState('')
  const [lastGeneratedVideo, setLastGeneratedVideo] = useState<any>(null)
  const [showUpsellModal, setShowUpsellModal] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwOk, setPwOk] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    if (!localStorage.getItem('onboarding_done')) setShowOnboarding(true)
    const token = t
    fetch('/api/videos', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => { setVideos(d.videos || []); setVideosLoading(false) })
    fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setRewards(d.rewards || []))
    fetch('/api/referral/stats', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setReferral(d))
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast(msg); setToastType(type); setTimeout(() => setToast(''), 4000)
  }

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

  const fireNotification = (title: string, body: string, icon = '/favicon.svg') => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    try {
      const n = new Notification(title, { body, icon, tag: 'nocturn-video' })
      n.onclick = () => { window.focus(); n.close() }
    } catch {}
  }

  const handleGenerate = async (preScript?: any) => {
    if (!prompt.trim()) return
    if ((user?.credits ?? 0) <= 0 && user?.plan !== 'enterprise') { setShowUpgradeModal(true); return }

    // Request notification permission on first generate click
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    setGenerating(true); setProgress(0); setLogs([]); setGenStep(0)
    setScriptPreview(null)
    if (typeof document !== 'undefined') document.title = '⏳ Gerando seu vídeo... — NOCTURN.AI'
    const token = localStorage.getItem('token') || ''
    let step = 0
    const iv = setInterval(() => {
      if (step >= logSteps.length) { clearInterval(iv); return }
      if (logSteps[step] !== undefined) { setLogs(p => [...p, logSteps[step]]) }
      setProgress(Math.round((step + 1) / logSteps.length * 100))
      setGenStep(step)
      step++
    }, 900)
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ prompt, contentType, duration, voice, platforms, format, language, scriptData: preScript || undefined })
      })
      const data = await res.json()
      setTimeout(async () => {
        clearInterval(iv); setGenerating(false); setProgress(100); setGenStep(-1)
        if (typeof document !== 'undefined') {
          document.title = '✅ Vídeo pronto! — NOCTURN.AI'
          setTimeout(() => { document.title = 'Dashboard — NOCTURN.AI' }, 6000)
        }
        if (res.ok && data.video) {
          const isFirstVideo = videos.length === 0
          setVideos(v => [data.video, ...v])
          const u = JSON.parse(localStorage.getItem('user') || '{}')
          u.credits = data.creditsRemaining
          localStorage.setItem('user', JSON.stringify(u))
          setUser((prev: any) => ({ ...prev, credits: data.creditsRemaining }))
          setLastGeneratedVideo(data.video)
          if (data.video.runwayError) {
            console.error('Runway falhou:', data.video.runwayError)
            showToast(`Runway indisponível — usando imagens Pexels. Erro: ${data.video.runwayError}`, 'error')
            fireNotification('Vídeo gerado com aviso ⚠️', `${data.video.title || 'Seu vídeo'} ficou pronto, mas o Runway falhou — usando imagens Pexels.`)
          } else if (isFirstVideo) {
            setShowConfetti(true); setShowFirstVideoSuccess(true); setTimeout(()=>setShowConfetti(false),5000)
            fireNotification('Primeiro vídeo pronto! 🎉', `${data.video.title || 'Seu vídeo'} foi gerado. Clique para assistir.`)
          } else {
            showToast('Vídeo gerado com sucesso! 🎉', 'success')
            fireNotification('Vídeo pronto! 🎬', `${data.video.title || 'Seu vídeo'} está pronto. Clique para assistir.`)
            // Show upsell for non-enterprise users after successful generation
            const credLeft = data.creditsRemaining
            const planMax = PLAN_CREDITS[data.user?.plan || user?.plan] || 20
            const isNonEnterprise = (user?.plan || 'starter') !== 'enterprise'
            if (isNonEnterprise && credLeft <= Math.floor(planMax * 0.3)) {
              setTimeout(() => setShowUpsellModal(true), 3000)
            }
          }
          const rr = await fetch('/api/rewards', { headers: { Authorization: 'Bearer ' + token } })
          const rd = await rr.json()
          setRewards(rd.rewards || [])
          const eligible = (rd.rewards || []).filter((r: any) => r.eligible)
          if (eligible.length > 0) {
            setRewardToast('Novo reward: ' + eligible[0].badge + ' ' + eligible[0].label)
            setTimeout(() => setRewardToast(''), 5000)
          }
        } else {
          showToast(data.error || 'Erro ao gerar vídeo. Tente novamente.', 'error')
          fireNotification('Erro na geração ❌', data.error || 'Ocorreu um erro. Tente novamente.')
        }
      }, logSteps.length * 900 + 600)
    } catch {
      clearInterval(iv); setGenerating(false)
      showToast('Erro de conexão. Verifique sua internet.', 'error')
      fireNotification('Erro de conexão ❌', 'Verifique sua internet e tente novamente.')
    }
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
      } else { showToast(data.error || 'Erro ao resgatar.', 'error') }
    } catch { showToast('Erro ao resgatar.', 'error') }
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
      {t('common.loading')}
    </div>
  )

  const maxCredits = PLAN_CREDITS[user.plan?.toLowerCase()] || 20
  const usedCredits = maxCredits === 99999 ? 0 : Math.max(0, maxCredits - (user.credits ?? maxCredits))
  const creditPct = maxCredits === 99999 ? 100 : Math.round(((user.credits ?? 0) / maxCredits) * 100)
  const eligibleRewards = rewards.filter(r => r.eligible)

  const handleChangePassword = async () => {
    if (!pwCurrent || !pwNew) return
    setPwLoading(true); setPwMsg(''); setPwOk(false)
    const token = localStorage.getItem('token') || ''
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      })
      const data = await res.json()
      if (res.ok) { setPwMsg('Senha alterada com sucesso!'); setPwOk(true); setPwCurrent(''); setPwNew('') }
      else setPwMsg(data.error || 'Erro ao alterar senha')
    } catch { setPwMsg('Erro de conexão') }
    setPwLoading(false)
  }

  const NAV_ITEMS = [
    { id:'generator', icon:'◈', label: t('nav.generate'), badge:'IA', badgeColor: C.green, badgeBg: C.gDim },
    { id:'videos', icon:'▤', label: t('nav.library'), badge: videos.length > 0 ? String(videos.length) : undefined },
    { id:'rewards', icon:'◆', label: t('nav.rewards'), badge: eligibleRewards.length > 0 ? String(eligibleRewards.length) : undefined, badgeColor: C.red, badgeBg: C.redDim, badgeRed: true },
    { id:'billing', icon:'◎', label: t('nav.billing') },
    { id:'settings', icon:'⚙', label: 'Configurações' },
  ]

  const planColor = user.plan === 'enterprise' ? C.violet : user.plan === 'pro' ? C.red : C.green
  const planLabel = (user.plan || 'free').charAt(0).toUpperCase() + (user.plan || 'free').slice(1)

  return (
    <>
      <Head><title>Dashboard — NOCTURN.AI</title></Head>

      <style>{`
        .nav-item { transition: background .15s, color .15s !important; }
        .nav-item:hover { background: ${C.layer} !important; color: ${C.t1} !important; }
        .card-hover { transition: border-color .18s, box-shadow .18s, transform .18s !important; }
        .card-hover:hover { border-color: ${C.lineHi} !important; box-shadow: ${shadow.float} !important; transform: translateY(-1px) !important; }
        .btn-primary { transition: background .15s, box-shadow .15s, transform .15s !important; }
        .btn-primary:hover:not(:disabled) { background: #5746AF !important; box-shadow: ${shadow.red} !important; transform: translateY(-1px) !important; }
        .btn-primary:active:not(:disabled) { transform: scale(.98) !important; }
        .btn-ghost { transition: border-color .15s, color .15s, background .15s !important; }
        .btn-ghost:hover { border-color: ${C.lineHi} !important; color: ${C.t1} !important; background: ${C.layer} !important; }
        .chip { transition: border-color .15s, background .15s, color .15s !important; }
        .chip:hover { border-color: rgba(110,86,207,.3) !important; }
        .quick-prompt { transition: border-color .15s, background .15s, transform .15s !important; }
        .quick-prompt:hover { border-color: ${C.lineHi} !important; background: ${C.layer} !important; transform: translateY(-1px) !important; }
        .sel-row select:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px rgba(110,86,207,.12) !important; }
        .textarea-prompt:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px rgba(110,86,207,.12) !important; }
        .sidebar-footer-btn { transition: background .12s !important; }
        .sidebar-footer-btn:hover { background: ${C.layer} !important; }
        .view-enter { animation: fadeUp .2s ease both; }
        .gen-card { background: linear-gradient(135deg,rgba(110,86,207,.04),rgba(76,56,153,.03)); background-size:300% 300%; animation:gradientShift 8s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 80%{opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
        @media(max-width:767px) {
          .sidebar-overlay { display:block !important; }
          .main-content { padding: 16px !important; }
          .topbar-inner { padding: 0 16px !important; }
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .sel-grid { grid-template-columns: 1fr !important; }
          .billing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Modals & overlays ── */}
      {showOnboarding && <OnboardingModal step={onboardingStep} onNext={()=>setOnboardingStep(s=>s+1)} onClose={()=>{setShowOnboarding(false);localStorage.setItem('onboarding_done','1')}} onGenerate={()=>{setShowOnboarding(false);localStorage.setItem('onboarding_done','1');setView('generator');setTimeout(()=>document.getElementById('prompt-textarea')?.focus(),200)}} C={C} F={F} shadow={shadow}/>}
      {showUpgradeModal && <UpgradeModal user={user} onClose={()=>setShowUpgradeModal(false)} onUpgrade={()=>{setShowUpgradeModal(false);setView('billing')}} C={C} F={F} shadow={shadow}/>}
      {showUpsellModal && <PostGenUpsellModal user={user} onClose={()=>setShowUpsellModal(false)} onUpgrade={()=>{setShowUpsellModal(false);setView('billing')}} C={C} F={F} shadow={shadow}/>}
      {showConfetti && <ConfettiEffect />}

      {/* First-video success banner */}
      {showFirstVideoSuccess && (
        <div style={{position:'fixed',top:'24px',left:'50%',transform:'translateX(-50%)',zIndex:9998,background:C.card,border:'1px solid rgba(22,163,74,.3)',borderRadius:'16px',padding:'20px 24px',boxShadow:shadow.modal,maxWidth:'520px',width:'calc(100% - 32px)',animation:'fadeUp .4s ease'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
            <div style={{fontSize:'28px',lineHeight:1,flexShrink:0}}>🎉</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,color:C.t1,marginBottom:'4px'}}>Primeiro vídeo gerado!</div>
              <div style={{fontSize:'13px',color:C.t2,lineHeight:1.6,marginBottom:'12px'}}>Você acabou de economizar ~R$400 em produção. Com o plano Pro, faz 100x por mês por menos de R$1 cada.</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <button onClick={()=>{setView('videos');setShowFirstVideoSuccess(false)}} style={{background:C.green,color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:F.head,whiteSpace:'nowrap'}}>Ver vídeo →</button>
                <button onClick={()=>{setShowFirstVideoSuccess(false);setView('generator')}} style={{background:C.raised,color:C.t1,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:500,cursor:'pointer',fontFamily:F.body,whiteSpace:'nowrap'}}>Gerar outro</button>
                <button onClick={()=>{setShowFirstVideoSuccess(false);setView('billing')}} style={{background:C.red,color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:F.head,whiteSpace:'nowrap'}}>Upgrade ⚡</button>
              </div>
            </div>
            <button onClick={()=>setShowFirstVideoSuccess(false)} style={{background:'none',border:'none',color:C.t3,fontSize:'18px',cursor:'pointer',lineHeight:1,padding:'4px',flexShrink:0}}>×</button>
          </div>
        </div>
      )}

      {/* Toast — bottom right */}
      {(rewardToast || toast) && (
        <div style={{position:'fixed',bottom:'24px',right:'24px',zIndex:9999,background:C.card,border:`1px solid ${toast&&toastType==='error'?'rgba(220,38,38,.3)':toast&&toastType==='success'?'rgba(22,163,74,.3)':C.line}`,color:C.t1,padding:'14px 18px',borderRadius:'12px',fontWeight:500,fontSize:'14px',boxShadow:shadow.float,fontFamily:F.body,maxWidth:'320px',animation:'fadeUp .25s ease',display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'16px',lineHeight:1,flexShrink:0}}>{rewardToast?'🏆':toastType==='error'?'⚠️':toastType==='success'?'✅':'ℹ️'}</span>
          <span>{rewardToast || toast}</span>
        </div>
      )}

      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:C.base,color:C.t1,fontFamily:F.body}}>

        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)}
            style={{position:'fixed',inset:0,background:'rgba(9,9,11,.5)',zIndex:40,backdropFilter:'blur(4px)',animation:'fadeIn .2s ease'}}/>
        )}

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <div style={{
          width:'240px',background:C.card,borderRight:`1px solid ${C.line}`,display:'flex',flexDirection:'column',flexShrink:0,
          ...(isMobile ? {position:'fixed',top:0,left:0,bottom:0,zIndex:50,transform:sidebarOpen?'translateX(0)':'translateX(-100%)',transition:'transform .25s ease',boxShadow:'4px 0 16px rgba(0,0,0,.08)'} : {}),
        }}>

          {/* Logo */}
          <div style={{padding:'20px 18px 18px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{
              width:'32px',height:'32px',
              background:`linear-gradient(135deg,${C.red},${C.violet})`,
              borderRadius:'8px',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:F.head,fontWeight:800,color:'#fff',fontSize:'15px',
              flexShrink:0,letterSpacing:'-0.5px',
              boxShadow:'0 2px 8px rgba(110,86,207,.3)',
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
                      background: (item as any).badgeRed ? C.redDim : item.badge === 'IA' ? C.gDim : C.layer,
                      color: (item as any).badgeRed ? C.red : item.badge === 'IA' ? C.green : C.t2,
                      border:`1px solid ${(item as any).badgeRed ? 'rgba(110,86,207,.25)' : item.badge === 'IA' ? 'rgba(22,163,74,.25)' : C.line}`,
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
                  {t('nav.admin')}
                </div>
              </>
            )}
          </nav>

          {/* Bottom: Credits + User */}
          <div style={{padding:'12px',borderTop:`1px solid ${C.line}`,display:'flex',flexDirection:'column',gap:'8px'}}>
            {/* Credits card */}
            <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'12px',boxShadow:shadow.card}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                <span style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('credits.label')}</span>
                <span style={{fontFamily:F.mono,fontSize:'11px',fontWeight:600,color:creditPct<25?C.red:creditPct<50?C.amber:C.green}}>
                  {maxCredits===99999 ? '∞' : `${Math.min(user.credits??0,maxCredits)}/${maxCredits}`}
                </span>
              </div>
              {maxCredits !== 99999 && (
                <>
                  <div style={{height:'3px',background:C.line,borderRadius:'2px',overflow:'hidden',marginBottom:'6px'}}>
                    <div style={{height:'100%',width:`${Math.min(100,creditPct)}%`,background:creditPct<25?C.red:creditPct<50?C.amber:C.green,borderRadius:'2px',transition:'width .5s'}}/>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>{t('credits.used', {used: usedCredits, max: maxCredits})}</div>
                  {creditPct < 30 && (
                    <div onClick={() => setView('billing')}
                      style={{marginTop:'8px',padding:'5px 8px',background:C.redDim,border:`1px solid rgba(110,86,207,.2)`,borderRadius:'6px',fontSize:'10px',color:C.red,cursor:'pointer',fontFamily:F.body,fontWeight:500,transition:'background .12s'}}
                      onMouseEnter={e => e.currentTarget.style.background=C.redGlow}
                      onMouseLeave={e => e.currentTarget.style.background=C.redDim}>
                      {t('credits.low')}
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
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN ─────────────────────────────────────────────── */}
        <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column'}}>

          {/* Top bar */}
          <div className="topbar-inner" style={{padding:'0 32px',height:'56px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.void,position:'sticky',top:0,zIndex:10,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              {isMobile && (
                <button onClick={() => setSidebarOpen(o => !o)}
                  style={{background:'none',border:`1px solid ${C.lineHi}`,color:C.t2,borderRadius:'8px',padding:'6px 10px',cursor:'pointer',fontSize:'16px',lineHeight:1,flexShrink:0}}>
                  ☰
                </button>
              )}
              <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1}}>
                {view==='generator'?t('topbar.generate'):view==='videos'?t('topbar.videos'):view==='rewards'?t('topbar.rewards'):view==='settings'?'Configurações':t('topbar.billing')}
              </div>
              {view === 'generator' && (
                <span style={{fontFamily:F.mono,fontSize:'9px',background:C.gDim,border:'1px solid rgba(22,163,74,.2)',color:C.green,padding:'3px 8px',borderRadius:'9px',fontWeight:500,letterSpacing:'0.04em'}}>GPT-4o · OpenAI TTS · Runway ML</span>
              )}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <LanguageSwitcher />
              <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,letterSpacing:'0.04em'}}>
                {user.name?.split(' ')[0]}
              </div>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:C.green,boxShadow:'0 0 6px rgba(22,163,74,.5)'}}/>
            </div>
          </div>

          {/* Content */}
          <div className="main-content" style={{padding:'28px 32px',flex:1}}>

            {/* ── ONBOARDING BANNER — free user, 0 videos generated ─── */}
            {user.plan === 'free' && (user.videoCount === 0 || videos.length === 0) && (user.credits ?? 0) >= 1 && view === 'generator' && (
              <div style={{background:`linear-gradient(135deg,${C.focus},rgba(110,86,207,.03))`,border:`1px solid rgba(110,86,207,.25)`,borderRadius:'14px',padding:'20px 24px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{fontSize:'26px',lineHeight:1}}>🎁</div>
                  <div>
                    <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,color:C.t1,marginBottom:'3px'}}>Você tem 1 crédito grátis!</div>
                    <div style={{fontFamily:F.body,fontSize:'12px',color:C.t2}}>Gere seu primeiro vídeo agora — sem precisar de cartão.</div>
                  </div>
                </div>
                <button onClick={() => { const el = document.getElementById('prompt-textarea'); el?.focus(); el?.scrollIntoView({behavior:'smooth'}) }}
                  className="btn-primary"
                  style={{background:C.red,border:'none',color:'#fff',padding:'10px 20px',borderRadius:'9px',fontFamily:F.head,fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,boxShadow:shadow.red,whiteSpace:'nowrap'}}>
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
                  style={{background:C.amber,border:'none',color:'#fff',padding:'10px 20px',borderRadius:'9px',fontFamily:F.head,fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(202,138,4,.3)'}}>
                  Ver planos →
                </button>
              </div>
            )}

            {/* ── GENERATOR ─────────────────────────────────────── */}
            {view === 'generator' && (
              <div style={{maxWidth:'960px'}}>

                {/* Stats row */}
                <div className="stat-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
                  {videosLoading ? [0,1,2].map(i => (
                    <div key={i} style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'12px',padding:'20px 22px',display:'flex',flexDirection:'column',gap:'10px'}}>
                      <div className="skeleton" style={{height:'10px',width:'60px'}}/>
                      <div className="skeleton" style={{height:'28px',width:'50px',borderRadius:'6px'}}/>
                      <div className="skeleton" style={{height:'9px',width:'90px'}}/>
                    </div>
                  )) : [
                    {label:t('stats.videos'), value:videos.length, sub:t('stats.videos_sub'), highlight:true},
                    {label:t('stats.credits'), value:maxCredits===99999?t('credits.unlimited'):Math.min(user.credits??0,maxCredits), sub:maxCredits===99999?t('stats.credits_unlimited'):t('stats.credits_sub',{max:maxCredits})},
                    {label:t('stats.plan'), value:planLabel, sub:t('stats.plan_sub'), color:planColor},
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
                      <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'4px'}}>{t('gen.title')}</div>
                      <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>{t('gen.subtitle')}</div>
                    </div>
                    <div style={{display:'flex',gap:'6px'}}>
                      {['GPT-4o','TTS','Runway ML'].map(badge => (
                        <span key={badge} style={{fontFamily:F.mono,fontSize:'8px',background:C.raised,border:`1px solid ${C.lineHi}`,color:C.t2,padding:'3px 8px',borderRadius:'6px',letterSpacing:'0.04em'}}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="sel-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.content_type')}</label>
                      <select value={contentType} onChange={e=>setContentType(e.target.value)} style={selStyle}>
                        <option value="faceless">{t('content_type.faceless')}</option>
                        <option value="educational">{t('content_type.educational')}</option>
                        <option value="inspirational">{t('content_type.inspirational')}</option>
                        <option value="religious">{t('content_type.religious')}</option>
                        <option value="news">{t('content_type.news')}</option>
                        <option value="mystery">{t('content_type.mystery')}</option>
                        <option value="truecrime">{t('content_type.truecrime')}</option>
                        <option value="finance">{t('content_type.finance')}</option>
                        <option value="nature">{t('content_type.nature')}</option>
                        <option value="sports">{t('content_type.sports')}</option>
                        <option value="food">{t('content_type.food')}</option>
                        <option value="horror">{t('content_type.horror')}</option>
                        <option value="asmr">{t('content_type.asmr')}</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.duration')}</label>
                      <select value={duration} onChange={e=>setDuration(e.target.value)} style={selStyle}>
                        <option value="short">{t('duration.short')}</option>
                        <option value="long">{t('duration.long')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Format + Language row */}
                  <div className="sel-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.format')}</label>
                      <select value={format} onChange={e=>setFormat(e.target.value)} style={selStyle}>
                        <option value="landscape">{t('format.landscape')}</option>
                        <option value="portrait">{t('format.portrait')}</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.language')}</label>
                      <select value={language} onChange={e=>setLanguage(e.target.value)} style={selStyle}>
                        <option value="pt">🇧🇷 Português (PT-BR)</option>
                        <option value="en">🇺🇸 English (US)</option>
                        <option value="es">🇪🇸 Español (Latinoamérica)</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick prompts */}
                  <div style={{marginBottom:'20px'}}>
                    <div style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>{t('gen.topics')}</div>
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
                    <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.prompt_label')}</label>
                    <textarea
                      id="prompt-textarea"
                      className="textarea-prompt"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder={t('gen.prompt_placeholder')}
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
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.voice')}</label>
                      <select value={voice} onChange={e=>setVoice(e.target.value)} style={selStyle}>
                        <option value="masculine">{t('voice.masculine')}</option>
                        <option value="feminine">{t('voice.feminine')}</option>
                        <option value="neutral">{t('voice.neutral')}</option>
                        <option value="asmr">{t('voice.asmr')}</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontFamily:F.mono,fontSize:'8px',color:C.t3,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t('gen.platforms')}</label>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap',paddingTop:'2px'}}>
                        {['youtube','tiktok','instagram','shorts'].map(p => {
                          const on = (platforms||[]).includes(p)
                          return (
                            <div key={p} onClick={() => togglePlat(p)}
                              className="chip"
                              style={{
                                padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:500,cursor:'pointer',
                                border:`1px solid ${on ? 'rgba(110,86,207,.45)' : C.line}`,
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
                        background: generating || !prompt.trim() ? C.layer : C.red,
                        color: generating || !prompt.trim() ? C.t3 : '#fff',
                        border:`1px solid ${generating || !prompt.trim() ? C.line : 'transparent'}`,
                        borderRadius:'10px',
                        fontSize:'13px',fontWeight:700,
                        cursor: generating || !prompt.trim() ? 'not-allowed' : 'pointer',
                        opacity: 1,
                        flexShrink:0,fontFamily:F.head,
                        letterSpacing:'-0.02em',
                      }}>
                      {generating ? t('gen.cta_generating') : scriptPreview ? t('gen.cta_with_script') : t('gen.cta')}
                    </button>
                    {!generating && (
                      <button onClick={handlePreviewScript} disabled={previewLoading || !prompt.trim()}
                        className="btn-ghost"
                        style={{padding:'11px 18px',background:'transparent',border:`1px solid ${C.lineHi}`,color:C.t2,borderRadius:'10px',fontSize:'12px',fontWeight:600,cursor: previewLoading || !prompt.trim() ? 'not-allowed' : 'pointer',opacity: previewLoading || !prompt.trim() ? 0.4 : 1,flexShrink:0,fontFamily:F.body}}>
                        {previewLoading ? t('gen.preview_loading') : t('gen.preview_script')}
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

                  {/* Generation pipeline */}
                  {generating && genStep >= 0 && (
                    <GenerationPipeline step={genStep} progress={progress} C={C} F={F}/>
                  )}

                  {/* Logs */}
                  {logs.length > 0 && !generating && (
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
                        <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,color:C.t1,letterSpacing:'-0.02em'}}>{t('gen.script_title')}</div>
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:C.violet,marginTop:'3px'}}>{t('gen.script_sub', {n: scriptPreview.scenes?.length || 0})}</div>
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

                {/* Inline preview of last generated video */}
                {lastGeneratedVideo && !generating && (
                  <div style={{background:C.card,border:`1px solid rgba(22,163,74,.3)`,borderRadius:'14px',overflow:'hidden',boxShadow:shadow.card,marginBottom:'16px',animation:'fadeUp .4s ease'}}>
                    <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:`linear-gradient(135deg,rgba(22,163,74,.06),transparent)`}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:C.green,boxShadow:`0 0 8px rgba(22,163,74,.5)`}}/>
                        <div style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,color:C.t1,letterSpacing:'-0.02em'}}>Vídeo gerado!</div>
                        <span style={{fontFamily:F.mono,fontSize:'9px',background:C.gDim,border:'1px solid rgba(22,163,74,.2)',color:C.green,padding:'2px 8px',borderRadius:'9px'}}>PRONTO</span>
                      </div>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={()=>setSelectedVideo(lastGeneratedVideo)}
                          style={{background:C.red,color:'#fff',border:'none',borderRadius:'8px',padding:'7px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F.head,boxShadow:shadow.red}}>
                          Assistir →
                        </button>
                        <button onClick={()=>setLastGeneratedVideo(null)}
                          style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t3,borderRadius:'8px',padding:'7px 10px',fontSize:'16px',cursor:'pointer',lineHeight:1}}>
                          ×
                        </button>
                      </div>
                    </div>
                    <div style={{padding:'16px 20px',display:'flex',gap:'16px',alignItems:'flex-start',flexWrap:'wrap'}}>
                      {/* Thumbnail */}
                      <div onClick={()=>setSelectedVideo(lastGeneratedVideo)} style={{width:'140px',height:'90px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:C.raised,cursor:'pointer',position:'relative',border:`1px solid ${C.line}`}}>
                        {lastGeneratedVideo.videoUrl
                          ? <video src={lastGeneratedVideo.videoUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} muted playsInline/>
                          : lastGeneratedVideo.images?.[0]
                          ? <img src={lastGeneratedVideo.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                          : <div style={{width:'100%',height:'100%',background:`linear-gradient(135deg,${C.focus},${C.raised})`}}/>
                        }
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(9,9,11,.25)'}}>
                          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'rgba(255,255,255,.9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:C.red}}>▶</div>
                        </div>
                      </div>
                      {/* Info */}
                      <div style={{flex:1,minWidth:'0'}}>
                        <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,color:C.t1,marginBottom:'6px',letterSpacing:'-0.02em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lastGeneratedVideo.title||'Sem título'}</div>
                        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
                          {lastGeneratedVideo.hasAudio&&<span style={{fontFamily:F.mono,fontSize:'9px',padding:'2px 8px',borderRadius:'5px',background:C.gDim,border:'1px solid rgba(22,163,74,.2)',color:C.green,fontWeight:600}}>VOZ IA</span>}
                          {lastGeneratedVideo.hasRunwayVideo&&<span style={{fontFamily:F.mono,fontSize:'9px',padding:'2px 8px',borderRadius:'5px',background:C.redDim,border:'1px solid rgba(197,24,58,.25)',color:C.red,fontWeight:600}}>RUNWAY MP4</span>}
                          {!lastGeneratedVideo.hasRunwayVideo&&lastGeneratedVideo.hasImages&&<span style={{fontFamily:F.mono,fontSize:'9px',padding:'2px 8px',borderRadius:'5px',background:C.vDim,border:`1px solid rgba(110,86,207,.15)`,color:C.violet,fontWeight:600}}>IMAGENS</span>}
                        </div>
                        <div style={{display:'flex',gap:'8px'}}>
                          <button onClick={()=>setSelectedVideo(lastGeneratedVideo)}
                            className="btn-primary"
                            style={{background:C.green,color:'#fff',border:'none',borderRadius:'8px',padding:'8px 18px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F.head}}>
                            Abrir player completo
                          </button>
                          <button onClick={()=>{setView('generator');setLastGeneratedVideo(null)}}
                            className="btn-ghost"
                            style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t2,borderRadius:'8px',padding:'8px 14px',fontSize:'12px',cursor:'pointer',fontFamily:F.body}}>
                            Gerar outro
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent videos */}
                {videos.length > 0 && (
                  <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',overflow:'hidden',boxShadow:shadow.card}}>
                    <div style={{padding:'16px 22px',borderBottom:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1}}>{t('gen.recent_title')}</div>
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'2px'}}>{videos.length !== 1 ? t('gen.recent_sub_other', {n: videos.length}) : t('gen.recent_sub_one', {n: videos.length})}</div>
                      </div>
                      <button onClick={() => setView('videos')}
                        className="btn-ghost"
                        style={{background:'transparent',border:`1px solid ${C.line}`,color:C.t3,borderRadius:'8px',padding:'6px 14px',fontSize:'11px',cursor:'pointer',fontFamily:F.body,fontWeight:500}}>
                        {t('gen.view_all')}
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
                    <h2 style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'4px'}}>{t('lib.title')}</h2>
                    <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3}}>{videos.length !== 1 ? t('lib.sub_other', {n: videos.length}) : t('lib.sub_one', {n: videos.length})}</div>
                  </div>
                  <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                    <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                      placeholder={t('lib.search')} style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'8px 12px',color:C.t1,fontSize:'12px',outline:'none',fontFamily:F.body,width:'200px'}}
                      onFocus={e=>e.target.style.borderColor=C.red} onBlur={e=>e.target.style.borderColor=C.line}/>
                    <button onClick={() => setView('generator')}
                      className="btn-primary"
                      style={{background:C.red,color:'#fff',border:'none',borderRadius:'10px',padding:'10px 20px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F.head,letterSpacing:'-0.02em',whiteSpace:'nowrap',boxShadow:shadow.red}}>
                      {t('lib.new_video')}
                    </button>
                  </div>
                </div>
                {videosLoading ? (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px'}}>
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'12px',padding:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
                        <div className="skeleton" style={{height:'140px',borderRadius:'8px'}}/>
                        <div className="skeleton" style={{height:'14px',width:'75%'}}/>
                        <div className="skeleton" style={{height:'12px',width:'45%'}}/>
                        <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
                          <div className="skeleton" style={{height:'30px',width:'70px',borderRadius:'8px'}}/>
                          <div className="skeleton" style={{height:'30px',width:'70px',borderRadius:'8px'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : videos.length === 0 ? (
                  <div style={{textAlign:'center',padding:'80px 20px',color:C.t3}}>
                    <div style={{fontSize:'40px',marginBottom:'16px',opacity:.25}}>🎬</div>
                    <div style={{fontFamily:F.head,fontSize:'16px',fontWeight:700,marginBottom:'8px',color:C.t2,letterSpacing:'-0.02em'}}>{t('lib.empty_title')}</div>
                    <div style={{fontSize:'13px',color:C.t3}}>{t('lib.empty_desc')}</div>
                  </div>
                ) : <VideoGrid videos={videos.filter(v => !searchQuery || v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.prompt?.toLowerCase().includes(searchQuery.toLowerCase()))} onSelect={setSelectedVideo}/>}
              </div>
            )}

            {/* ── REWARDS ─────────────────────────────────────────── */}
            {view === 'rewards' && (
              <div style={{maxWidth:'900px'}}>
                <div style={{background:C.redDim,border:`1px solid rgba(110,86,207,.2)`,borderRadius:'14px',padding:'20px 24px',marginBottom:'28px'}}>
                  <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'6px'}}>{t('rewards.title')}</div>
                  <div style={{fontSize:'13px',color:C.t2,lineHeight:1.7,fontWeight:400}}>{isEN ? <>Complete milestones by generating videos and accumulating views. Earn up to <strong style={{color:C.red,fontWeight:600}}>2 bonus credits per month</strong>.</> : <>Complete milestones gerando vídeos e acumulando views. Ganhe até <strong style={{color:C.red,fontWeight:600}}>2 créditos bônus por mês</strong>.</>}</div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px',marginBottom:'32px'}}>
                  {(rewards||[]).filter((r:any) => r && r.id).map((r:any) => (
                    <div key={r.id} className="card-hover" style={{background:C.card,border:`1px solid ${r.unlocked?'rgba(22,163,74,.3)':r.eligible?'rgba(110,86,207,.35)':C.line}`,borderRadius:'12px',padding:'20px',opacity:r.unlocked?.65:1,boxShadow:shadow.card}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
                        <div style={{fontSize:'28px',lineHeight:1}}>{r.badge}</div>
                        <div>
                          <div style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,letterSpacing:'-0.025em',color:r.unlocked?C.green:r.eligible?C.red:C.t1,marginBottom:'2px'}}>
                            {r.unlocked?'✓ ':''}{r.label}
                          </div>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3}}>
                            {r.type==='views'?t('rewards.milestone_views'):t('rewards.milestone_creation')}
                            {r.credits>0&&<span style={{color:C.red,marginLeft:'8px',fontWeight:600}}>+{r.credits} crédito</span>}
                          </div>
                        </div>
                      </div>
                      {!r.unlocked && (
                        <div style={{marginBottom:'14px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'6px'}}>
                            <span>{t('rewards.progress')}</span><span>{r.progress}/{r.target}</span>
                          </div>
                          <div style={{height:'3px',background:C.line,borderRadius:'2px',overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${Math.min(100,Math.round(r.progress/r.target*100))}%`,background:r.eligible?C.red:C.t3,borderRadius:'2px',transition:'width .6s'}}/>
                          </div>
                        </div>
                      )}
                      {r.eligible && !r.unlocked && (
                        <button onClick={() => handleClaimReward(r.id)} disabled={claimingId===r.id}
                          style={{width:'100%',background:C.red,color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontSize:'12px',fontWeight:700,cursor:'pointer',opacity:claimingId===r.id?.5:1,fontFamily:F.head,letterSpacing:'-0.01em',boxShadow:shadow.red}}>
                          {claimingId===r.id?t('rewards.claiming'):r.credits>0?t('rewards.claim_credit',{n:r.credits}):t('rewards.claim_badge')}
                        </button>
                      )}
                      {r.unlocked && <div style={{fontFamily:F.mono,fontSize:'10px',color:C.green,textAlign:'center',letterSpacing:'0.04em',fontWeight:500}}>{t('rewards.claimed')}</div>}
                    </div>
                  ))}
                </div>

                <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'24px',boxShadow:shadow.card}}>
                  <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'6px'}}>{t('rewards.report_title')}</div>
                  <div style={{fontSize:'13px',color:C.t2,marginBottom:'20px',lineHeight:1.7}}>{t('rewards.report_desc')}</div>
                  {videos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'24px',color:C.t3,fontSize:'13px'}}>{t('rewards.no_videos')}</div>
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
                                {t('rewards.save')}
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
                              {t('rewards.views_btn')}
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
                  <h2 style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'8px'}}>{t('billing.title')}</h2>
                  <div style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,background:C.card,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'10px 16px',display:'inline-block',boxShadow:shadow.card}}>
                    {t('billing.note')}
                  </div>
                </div>

                {/* Referral Program */}
                {referral && (
                  <div style={{background:`linear-gradient(135deg,rgba(110,86,207,.06),rgba(76,56,153,.03))`,border:`1px solid rgba(110,86,207,.2)`,borderRadius:'14px',padding:'22px 24px',marginBottom:'28px',boxShadow:shadow.card}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
                      <div>
                        <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'4px'}}>{t('billing.referral_title')}</div>
                        <div style={{fontSize:'13px',color:C.t2,lineHeight:1.6}}>{isEN ? <>Refer friends and earn <strong style={{color:C.violet}}>+5 credits</strong> for each sign-up.</> : <>Indique amigos e ganhe <strong style={{color:C.violet}}>+5 créditos</strong> para cada cadastro realizado.</>}</div>
                      </div>
                      <div style={{textAlign:'center',flexShrink:0}}>
                        <div style={{fontFamily:F.head,fontSize:'28px',fontWeight:800,color:C.violet,lineHeight:1}}>{referral.referredCount || 0}</div>
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'2px'}}>{t('billing.referral_count')}</div>
                      </div>
                    </div>
                    <div style={{marginTop:'16px',display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                      <div style={{flex:1,background:C.card,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'9px 12px',fontFamily:F.mono,fontSize:'11px',color:C.t2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:'0'}}>
                        {referral.referralLink || '...'}
                      </div>
                      <button onClick={()=>{navigator.clipboard.writeText(referral.referralLink||'');showToast('Link copiado!')}}
                        style={{background:`linear-gradient(135deg,${C.violet},#6D28D9)`,color:'#fff',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F.head,flexShrink:0,boxShadow:'0 4px 16px rgba(124,58,237,.3)'}}>
                        {t('billing.referral_copy')}
                      </button>
                    </div>
                    {referral.creditsEarned > 0 && (
                      <div style={{marginTop:'10px',fontFamily:F.mono,fontSize:'10px',color:C.green}}>✓ {referral.creditsEarned} créditos ganhos por indicações</div>
                    )}
                  </div>
                )}

                {/* Credit history */}
                {videos.length > 0 && (
                  <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'20px 22px',marginBottom:'28px',boxShadow:shadow.card}}>
                    <div style={{fontFamily:F.head,fontSize:'14px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'4px'}}>{t('billing.history_title')}</div>
                    <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'16px'}}>{videos.length !== 1 ? t('billing.history_sub_other', {n: videos.length}) : t('billing.history_sub_one', {n: videos.length})}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px',maxHeight:'220px',overflowY:'auto'}}>
                      {videos.slice(0,20).map((v:any,i:number) => (
                        <div key={v.id||i} onClick={()=>setSelectedVideo(v)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',background:C.raised,border:`1px solid ${C.line}`,borderRadius:'8px',cursor:'pointer',transition:'border-color .15s'}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=C.lineHi}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=C.line}>
                          <div style={{width:'32px',height:'32px',borderRadius:'6px',overflow:'hidden',flexShrink:0,background:C.line}}>
                            {v.images?.[0] && <img src={v.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.7)'}}/>}
                          </div>
                          <div style={{flex:1,overflow:'hidden'}}>
                            <div style={{fontSize:'12px',color:C.t1,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.title||'Sem título'}</div>
                            <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'2px'}}>{v.createdAt?new Date(v.createdAt).toLocaleDateString('pt-BR'):''}</div>
                          </div>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.red,fontWeight:600,flexShrink:0}}>−1 crédito</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px'}}>
                  {[
                    {n:'Starter',credits:20,url:PLAN_URLS.starter,color:C.green,
                      p: isEN ? '9' : '47',
                      features: isEN
                        ? ['20 videos/month','YouTube + TikTok','GPT-4o Script','AI Voice EN-US','7-day guarantee']
                        : ['20 vídeos/mês','YouTube + TikTok','Roteiro GPT-4o','Voz IA PT-BR','Garantia 7 dias']},
                    {n:'Pro',credits:100,url:PLAN_URLS.pro,color:C.red,hot:true,
                      p: isEN ? '19' : '97',
                      features: isEN
                        ? ['100 videos/month','All platforms','Advanced script','Custom voice','Priority support']
                        : ['100 vídeos/mês','Todas as plataformas','Roteiro avançado','Voz personalizada','Suporte prioritário']},
                    {n:'Enterprise',credits:999,url:PLAN_URLS.enterprise,color:C.violet,
                      p: isEN ? '59' : '297',
                      features: isEN
                        ? ['Unlimited credits','Multi-user','Full API','White-label','Dedicated manager']
                        : ['Créditos ilimitados','Multi-usuário','API completa','White-label','Gerente dedicado']},
                  ].map((pl,i) => {
                    const isCurrent = user.plan?.toLowerCase() === pl.n.toLowerCase()
                    return (
                      <div key={i} style={{
                        background:C.card,
                        border:`1px solid ${(pl as any).hot?'rgba(110,86,207,.4)':isCurrent?'rgba(22,163,74,.3)':C.line}`,
                        borderRadius:'16px',padding:'24px',position:'relative',display:'flex',flexDirection:'column',
                        boxShadow:(pl as any).hot?`${shadow.card},0 0 40px rgba(110,86,207,.1)`:shadow.card,
                      }}>
                        {(pl as any).hot && (
                          <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:C.red,color:'#fff',fontSize:'9px',fontWeight:700,padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap',letterSpacing:'0.08em',boxShadow:shadow.red}}>
                            {t('billing.most_popular')}
                          </div>
                        )}
                        <div style={{fontFamily:F.mono,fontSize:'9px',color:pl.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'12px',fontWeight:600}}>{pl.n}</div>
                        <div style={{fontFamily:F.head,fontSize:'34px',fontWeight:800,letterSpacing:'-0.05em',marginBottom:'14px',lineHeight:1,color:C.t1}}>
                          {t('billing.currency')}{pl.p}<span style={{fontSize:'12px',fontWeight:400,color:C.t3,letterSpacing:'0'}}>{t('billing.per_month')}</span>
                        </div>
                        <div style={{background:C.raised,border:`1px solid ${C.line}`,borderRadius:'10px',padding:'12px',textAlign:'center',marginBottom:'16px'}}>
                          <div style={{fontFamily:F.head,fontSize:'24px',fontWeight:800,color:pl.color,letterSpacing:'-0.04em'}}>{pl.credits===999?'∞':pl.credits}</div>
                          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginTop:'3px'}}>{t('billing.credits_month')}</div>
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
                            background:(pl as any).hot?C.red:'transparent',
                            border:(pl as any).hot?'none':`1px solid ${pl.color}`,
                            color:(pl as any).hot?'#fff':pl.color,
                            padding:'11px',borderRadius:'10px',fontWeight:700,fontSize:'13px',fontFamily:F.head,
                            letterSpacing:'-0.02em',
                            transition:'opacity .15s',
                          }}
                          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='.85'}
                          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
                          {isCurrent ? t('billing.current_plan') : t('billing.subscribe', {name: pl.n})}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── SETTINGS ─────────────────────────────────────────── */}
            {view === 'settings' && (
              <div style={{maxWidth:'640px',display:'flex',flexDirection:'column',gap:'20px'}}>

                {/* Profile info */}
                <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'24px',boxShadow:shadow.card}}>
                  <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'4px'}}>Perfil</div>
                  <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'20px'}}>Informações da sua conta</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                    {[
                      {label:'Nome',value:user.name},
                      {label:'Email',value:user.email},
                      {label:'Plano',value:planLabel},
                      {label:'Créditos',value:maxCredits===99999?'Ilimitados':`${Math.min(user.credits??0,maxCredits)} restantes`},
                      {label:'Membro desde',value:user.createdAt?new Date(user.createdAt).toLocaleDateString('pt-BR'):'—'},
                    ].map(row=>(
                      <div key={row.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${C.line}`}}>
                        <span style={{fontFamily:F.mono,fontSize:'10px',color:C.t3,textTransform:'uppercase',letterSpacing:'0.08em'}}>{row.label}</span>
                        <span style={{fontSize:'13px',fontWeight:500,color:C.t1}}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change password */}
                <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:'14px',padding:'24px',boxShadow:shadow.card}}>
                  <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:C.t1,marginBottom:'4px'}}>Alterar senha</div>
                  <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'20px'}}>Mínimo 6 caracteres</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                    {[
                      {label:'Senha atual',val:pwCurrent,set:setPwCurrent,id:'pw-current'},
                      {label:'Nova senha',val:pwNew,set:setPwNew,id:'pw-new'},
                    ].map(f=>(
                      <div key={f.id} style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                        <label style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,textTransform:'uppercase',letterSpacing:'0.08em'}}>{f.label}</label>
                        <input id={f.id} type="password" value={f.val} onChange={e=>f.set(e.target.value)}
                          style={{background:C.raised,border:`1px solid ${C.line}`,borderRadius:'8px',padding:'10px 14px',color:C.t1,fontSize:'14px',outline:'none',fontFamily:F.body,transition:'border-color .15s'}}
                          onFocus={e=>e.target.style.borderColor=C.red}
                          onBlur={e=>e.target.style.borderColor=C.line}
                          placeholder="••••••••"
                        />
                      </div>
                    ))}
                    {pwMsg && (
                      <div style={{padding:'10px 14px',borderRadius:'8px',fontSize:'13px',fontWeight:500,background:pwOk?C.gDim:'#FEE2E2',border:`1px solid ${pwOk?'rgba(22,163,74,.25)':'rgba(220,38,38,.25)'}`,color:pwOk?C.green:'#DC2626'}}>
                        {pwMsg}
                      </div>
                    )}
                    <button onClick={handleChangePassword} disabled={pwLoading||!pwCurrent||!pwNew}
                      className="btn-primary"
                      style={{background:pwLoading||!pwCurrent||!pwNew?C.layer:C.red,color:pwLoading||!pwCurrent||!pwNew?C.t3:'#fff',border:'none',borderRadius:'9px',padding:'11px',fontSize:'13px',fontWeight:700,cursor:pwLoading||!pwCurrent||!pwNew?'not-allowed':'pointer',fontFamily:F.head,boxShadow:pwLoading||!pwCurrent||!pwNew?'none':shadow.red,letterSpacing:'-0.02em'}}>
                      {pwLoading?'Salvando...':'Salvar nova senha'}
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div style={{background:C.card,border:'1px solid rgba(220,38,38,.2)',borderRadius:'14px',padding:'24px',boxShadow:shadow.card}}>
                  <div style={{fontFamily:F.head,fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:'#DC2626',marginBottom:'4px'}}>Zona de perigo</div>
                  <div style={{fontFamily:F.mono,fontSize:'9px',color:C.t3,marginBottom:'16px'}}>Ações irreversíveis</div>
                  <div style={{fontSize:'13px',color:C.t2,lineHeight:1.7,marginBottom:'16px'}}>
                    Para encerrar sua conta e excluir seus dados (LGPD Art. 18), envie um email para{' '}
                    <a href="mailto:suporte@nocturn-ai.vercel.app" style={{color:C.red,fontWeight:600}}>suporte@nocturn-ai.vercel.app</a>{' '}
                    com o assunto <strong style={{color:C.t1}}>"Excluir minha conta"</strong>.
                  </div>
                  <button onClick={logout}
                    style={{background:'transparent',border:'1px solid rgba(220,38,38,.3)',color:'#DC2626',borderRadius:'9px',padding:'9px 20px',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:F.body,transition:'background .15s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(220,38,38,.06)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                    Sair da conta
                  </button>
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

// ── POST-GENERATION UPSELL MODAL ─────────────────────────────────────────────
function PostGenUpsellModal({user, onClose, onUpgrade, C, F, shadow}: any) {
  const plan = user?.plan || 'starter'
  const nextPlan = plan === 'starter' ? 'Pro' : 'Enterprise'
  const nextCredits = plan === 'starter' ? 100 : '∞'
  const nextPrice = plan === 'starter' ? 'R$97/mês' : 'R$297/mês'
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(9,9,11,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'16px',backdropFilter:'blur(8px)',animation:'fadeIn .2s ease'}}>
      <div style={{background:C.void,border:`1px solid rgba(110,86,207,.3)`,borderRadius:'20px',width:'100%',maxWidth:'420px',padding:'32px',boxShadow:shadow.modal,animation:'scaleIn .25s ease'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontSize:'44px',marginBottom:'12px',lineHeight:1}}>🚀</div>
          <div style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'8px'}}>Seu vídeo está pronto!</div>
          <div style={{fontSize:'14px',color:C.t2,lineHeight:1.7,marginBottom:'16px'}}>
            Você gerou mais um vídeo incrível. Seus créditos estão acabando — faça upgrade para continuar sem interrupções.
          </div>
          <div style={{background:C.layer,border:`1px solid rgba(110,86,207,.25)`,borderRadius:'12px',padding:'16px 20px',marginBottom:'8px',textAlign:'left'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:F.mono,fontSize:'10px',color:C.red,fontWeight:700,letterSpacing:'0.06em',marginBottom:'4px'}}>{nextPlan.toUpperCase()}</div>
                <div style={{fontSize:'13px',color:C.t2,lineHeight:1.5}}>{nextCredits} vídeos/mês · Todos os formatos · Suporte prioritário</div>
              </div>
              <div style={{fontFamily:F.head,fontSize:'22px',fontWeight:800,color:C.t1,flexShrink:0,marginLeft:'16px'}}>{nextPrice}</div>
            </div>
          </div>
          <div style={{fontFamily:F.mono,fontSize:'9px',color:C.green,fontWeight:600,letterSpacing:'0.04em'}}>✓ GARANTIA DE 7 DIAS · SEM RISCO</div>
        </div>
        <button onClick={onUpgrade}
          style={{width:'100%',background:`linear-gradient(135deg,${C.red},${C.violet})`,color:'#fff',border:'none',borderRadius:'10px',padding:'13px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:F.head,letterSpacing:'-0.02em',boxShadow:shadow.red,marginBottom:'10px'}}>
          Fazer upgrade para {nextPlan} →
        </button>
        <button onClick={onClose}
          style={{width:'100%',background:'transparent',color:C.t3,border:'none',fontSize:'13px',cursor:'pointer',fontFamily:F.body,padding:'6px'}}>
          Continuar no plano atual
        </button>
      </div>
    </div>
  )
}

// ── VIDEO GRID ───────────────────────────────────────────────────────────────
const VC = {
  bg: '#FFFFFF', raised: '#F4F4F5', line: '#E4E4E7', lineHi: '#D4D4D8',
  red: '#6E56CF', t1: '#09090B', t2: '#52525B', t3: '#A1A1AA',
  green: '#16A34A', violet: '#4C3899',
}
function VideoGrid({videos, onSelect}: {videos:any[], onSelect:(v:any)=>void}) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'}}>
      {(videos||[]).filter(v=>v&&v.id).map(v=>(
        <div key={v.id} onClick={()=>onSelect(v)}
          className="card-hover"
          style={{background:VC.bg,border:`1px solid ${VC.line}`,borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'border-color .18s,box-shadow .18s,transform .18s',boxShadow:'0 1px 2px rgba(0,0,0,.05)'}}>

          {/* Thumbnail */}
          <div style={{height:'130px',background:`linear-gradient(135deg,${VC.raised},#EBEBEC)`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
            {v.images&&v.images[0]
              ?<img src={v.images[0]} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.85}}/>
              :<div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 50% 35%,rgba(110,86,207,.08),transparent 70%)`}}/>
            }
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(9,9,11,.25),transparent 55%)'}}/>
            <div style={{position:'relative',zIndex:1,width:'44px',height:'44px',background:VC.red,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'17px',boxShadow:'0 4px 16px rgba(110,86,207,.4)',backdropFilter:'blur(4px)'}}>▶</div>
            <div style={{position:'absolute',top:'8px',left:'8px',display:'flex',gap:'4px',zIndex:2}}>
              {(Array.isArray(v.platforms)?v.platforms:[]).slice(0,2).map((p:string)=>(
                <span key={p} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',fontWeight:600,padding:'2px 6px',borderRadius:'5px',background:'rgba(255,255,255,.88)',color:VC.t2,letterSpacing:'0.04em',border:`1px solid ${VC.line}`}}>
                  {p==='youtube'?'YT':p==='tiktok'?'TT':'IG'}
                </span>
              ))}
            </div>
            <div style={{position:'absolute',bottom:'8px',right:'8px',zIndex:2,display:'flex',gap:'4px'}}>
              {v.hasAudio&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',padding:'2px 7px',borderRadius:'5px',background:'rgba(22,163,74,.88)',color:'#fff',fontWeight:600}}>VOZ</span>}
              {v.hasRunwayVideo&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',padding:'2px 7px',borderRadius:'5px',background:'rgba(197,24,58,.88)',color:'#fff',fontWeight:600}}>RUNWAY</span>}
              {!v.hasRunwayVideo&&v.hasImages&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',padding:'2px 7px',borderRadius:'5px',background:'rgba(110,86,207,.88)',color:'#fff',fontWeight:600}}>IMG</span>}
            </div>
          </div>

          {/* Info */}
          <div style={{padding:'11px 14px 13px'}}>
            <div style={{fontSize:'12px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:VC.t1,marginBottom:'6px',fontFamily:"'Inter',sans-serif",letterSpacing:'-0.01em',lineHeight:1.3}}>{v.title||'Sem título'}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:VC.t3}}>
              <span>{v.duration==='short'?'até 1 min':v.duration==='long'?'1–3 min':'até 1 min'}</span>
              <span style={{color:VC.red,fontWeight:600,letterSpacing:'0.02em'}}>Assistir →</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ONBOARDING MODAL ─────────────────────────────────────────────────────────
function OnboardingModal({step, onNext, onClose, onGenerate, C, F, shadow}: any) {
  const steps = [
    { icon:'🎬', title:'Bem-vindo ao NOCTURN.AI!', body:'Você está a poucos minutos de gerar seu primeiro vídeo faceless com IA. Roteiro, voz e imagens — tudo automático.', cta:'Começar tour →' },
    { icon:'✦', title:'Como funciona', body:'1. Escolha um tema ou use os prompts rápidos\n2. Configure formato, duração e voz\n3. Clique em "Gerar Vídeo com IA" e aguarde ~3 min', cta:'Entendido →' },
    { icon:'🚀', title:'Pronto para gerar!', body:'Você tem 1 crédito grátis. Use agora para criar seu primeiro vídeo e ver como funciona — sem precisar de câmera.', cta:'Gerar meu primeiro vídeo →' },
  ]
  const s = steps[Math.min(step, steps.length - 1)]
  const isLast = step >= steps.length - 1
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(9,9,11,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'16px',backdropFilter:'blur(8px)',animation:'fadeIn .2s ease'}}>
      <div style={{background:C.void,border:`1px solid ${C.line}`,borderRadius:'20px',width:'100%',maxWidth:'420px',padding:'32px',boxShadow:shadow.modal,animation:'scaleIn .25s ease'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontSize:'44px',marginBottom:'16px',lineHeight:1}}>{s.icon}</div>
          <div style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'12px'}}>{s.title}</div>
          <div style={{fontSize:'14px',color:C.t2,lineHeight:1.75,whiteSpace:'pre-line'}}>{s.body}</div>
        </div>
        <div style={{display:'flex',gap:'4px',justifyContent:'center',marginBottom:'24px'}}>
          {steps.map((_,i) => (
            <div key={i} style={{width:'24px',height:'3px',borderRadius:'2px',background:i<=step?C.red:C.line,transition:'background .3s'}}/>
          ))}
        </div>
        <button onClick={isLast ? onGenerate : onNext}
          style={{width:'100%',background:C.red,color:'#fff',border:'none',borderRadius:'10px',padding:'13px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:F.head,letterSpacing:'-0.02em',boxShadow:shadow.red,marginBottom:'10px'}}>
          {s.cta}
        </button>
        <button onClick={onClose}
          style={{width:'100%',background:'transparent',color:C.t3,border:'none',fontSize:'13px',cursor:'pointer',fontFamily:F.body,padding:'6px'}}>
          Pular tutorial
        </button>
      </div>
    </div>
  )
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
function UpgradeModal({user, onClose, onUpgrade, C, F, shadow}: any) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(9,9,11,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'16px',backdropFilter:'blur(8px)',animation:'fadeIn .2s ease'}}>
      <div style={{background:C.void,border:`1px solid ${C.line}`,borderRadius:'20px',width:'100%',maxWidth:'440px',padding:'32px',boxShadow:shadow.modal,animation:'scaleIn .25s ease'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontSize:'44px',marginBottom:'12px',lineHeight:1}}>⚡</div>
          <div style={{fontFamily:F.head,fontSize:'20px',fontWeight:700,letterSpacing:'-0.03em',color:C.t1,marginBottom:'8px'}}>Créditos esgotados</div>
          <div style={{fontSize:'14px',color:C.t2,lineHeight:1.7}}>Você usou seu crédito grátis. Faça upgrade para continuar gerando vídeos todos os dias.</div>
        </div>
        <div style={{background:C.layer,border:`1px solid ${C.line}`,borderRadius:'12px',padding:'16px 20px',marginBottom:'20px'}}>
          {[
            {plan:'Starter', price:'R$47/mês', credits:'20 vídeos', color:C.green},
            {plan:'Pro', price:'R$97/mês', credits:'100 vídeos', color:C.red, hot:true},
            {plan:'Enterprise', price:'R$297/mês', credits:'Ilimitado', color:C.violet},
          ].map((pl) => (
            <div key={pl.plan} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.line}`}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontFamily:F.mono,fontSize:'10px',fontWeight:700,color:pl.color}}>{pl.plan}{(pl as any).hot?' ⚡':''}</span>
                <span style={{fontFamily:F.mono,fontSize:'10px',color:C.t3}}>{pl.credits}</span>
              </div>
              <span style={{fontFamily:F.head,fontSize:'13px',fontWeight:700,color:C.t1}}>{pl.price}</span>
            </div>
          ))}
        </div>
        <button onClick={onUpgrade}
          style={{width:'100%',background:C.red,color:'#fff',border:'none',borderRadius:'10px',padding:'13px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:F.head,letterSpacing:'-0.02em',boxShadow:shadow.red,marginBottom:'10px'}}>
          Ver planos e fazer upgrade →
        </button>
        <button onClick={onClose}
          style={{width:'100%',background:'transparent',color:C.t3,border:'none',fontSize:'13px',cursor:'pointer',fontFamily:F.body,padding:'6px'}}>
          Fechar
        </button>
      </div>
    </div>
  )
}

// ── CONFETTI EFFECT ───────────────────────────────────────────────────────────
function ConfettiEffect() {
  const pieces = React.useMemo(() => Array.from({length:30},(_,i)=>({
    id:i, x:Math.random()*100, delay:Math.random()*2, dur:2+Math.random()*2,
    color:['#6E56CF','#4C3899','#16A34A','#CA8A04','#E879F9','#60A5FA'][Math.floor(Math.random()*6)],
    size:6+Math.random()*8,
  })), [])
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9990,overflow:'hidden'}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute',top:'-20px',left:`${p.x}%`,
          width:`${p.size}px`,height:`${p.size}px`,
          background:p.color,borderRadius:'2px',
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in both`,
        }}/>
      ))}
    </div>
  )
}

// ── VIDEO PLAYER MODAL ───────────────────────────────────────────────────────
function VideoPlayerModal({video, onClose}: {video:any, onClose:()=>void}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const runwayVideoRef = React.useRef<HTMLVideoElement>(null)
  const subCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const animRef = React.useRef<number | null>(null)
  const sceneTimingRef = React.useRef<Array<{start:number, end:number}>>([])
  const isPlayingRef = React.useRef(false)
  const loadedImgsRef = React.useRef<(HTMLImageElement|null)[]>([])

  const isRunwayVideo = !!video.runwayVideoUrl

  const [tab, setTab] = React.useState("player")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentScene, setCurrentScene] = React.useState(0)
  const [downloading, setDownloading] = React.useState(false)
  const [dlPct, setDlPct] = React.useState(0)
  const [dlLabel, setDlLabel] = React.useState("")
  const [loadedImgs, setLoadedImgs] = React.useState<(HTMLImageElement|null)[]>([])
  const [imgsReady, setImgsReady] = React.useState(isRunwayVideo ? true : false)
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
  const secPerScene = video.duration === "long" ? 18 : 12

  // ── Load images (only for Pexels fallback — skip if runway video exists) ───
  React.useEffect(() => {
    if (isRunwayVideo) { setImgsReady(true); return }
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

  // ── Draw subtitles: chunk-based karaoke (6 words per block, no index bug) ──
  const drawSubtitles = (ctx: CanvasRenderingContext2D, currentWordIdx: number, W: number, H: number) => {
    if (allWords.length === 0) return
    ctx.save()

    const CHUNK = 6
    const chunkIdx = Math.floor(currentWordIdx / CHUNK)
    const chunkStart = chunkIdx * CHUNK
    const chunkEnd = Math.min(chunkStart + CHUNK, allWords.length)
    const chunkWords = allWords.slice(chunkStart, chunkEnd)
    const localIdx = currentWordIdx - chunkStart

    const fontSize = Math.max(20, Math.round(W / 38))
    ctx.font = `700 ${fontSize}px Arial, sans-serif`
    ctx.textBaseline = 'middle'

    // Word wrap into max 2 lines
    const maxLineW = W * 0.84
    type LineData = { words: string[]; startLocal: number }
    const lines: LineData[] = []
    let line: string[] = [], lineW = 0, lineStart = 0

    chunkWords.forEach((word: string, i: number) => {
      const ww = ctx.measureText(word + ' ').width
      if (lineW + ww > maxLineW && line.length > 0) {
        lines.push({ words: [...line], startLocal: lineStart })
        lineStart = i; line = [word]; lineW = ww
      } else {
        if (line.length === 0) lineStart = i
        line.push(word); lineW += ww
      }
    })
    if (line.length > 0) lines.push({ words: line, startLocal: lineStart })

    const lineH = fontSize * 1.75
    const totalH = lines.length * lineH + 20
    const bottomMargin = H * 0.075
    const bgY = H - bottomMargin - totalH
    const bgX = W * 0.04, bgW = W * 0.92, r = 12

    // Pill background
    ctx.fillStyle = 'rgba(0,0,0,0.72)'
    ctx.beginPath()
    ctx.moveTo(bgX + r, bgY - 6)
    ctx.lineTo(bgX + bgW - r, bgY - 6)
    ctx.arcTo(bgX + bgW, bgY - 6, bgX + bgW, bgY - 6 + r, r)
    ctx.lineTo(bgX + bgW, bgY + totalH - 6 - r)
    ctx.arcTo(bgX + bgW, bgY + totalH - 6, bgX + bgW - r, bgY + totalH - 6, r)
    ctx.lineTo(bgX + r, bgY + totalH - 6)
    ctx.arcTo(bgX, bgY + totalH - 6, bgX, bgY + totalH - 6 - r, r)
    ctx.lineTo(bgX, bgY - 6 + r)
    ctx.arcTo(bgX, bgY - 6, bgX + r, bgY - 6, r)
    ctx.closePath(); ctx.fill()

    // Draw words — use sequential index (wi) to avoid indexOf duplicate-word bug
    lines.forEach((ln, li) => {
      ctx.font = `700 ${fontSize}px Arial, sans-serif`
      const lineWidth = ln.words.reduce((acc: number, w: string) => acc + ctx.measureText(w + ' ').width, 0)
      const y = bgY + li * lineH + lineH * 0.5 + 2
      let x = (W - lineWidth) / 2

      for (let wi = 0; wi < ln.words.length; wi++) {
        const wordLocalIdx = ln.startLocal + wi
        const isCurrent = wordLocalIdx === localIdx
        const isSpoken = wordLocalIdx < localIdx
        const word = ln.words[wi]

        ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'

        if (isCurrent) {
          ctx.shadowColor = 'rgba(255,212,0,0.65)'; ctx.shadowBlur = 14
          ctx.fillStyle = '#FFD700'
          ctx.font = `900 ${Math.round(fontSize * 1.06)}px Arial, sans-serif`
        } else if (isSpoken) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `700 ${fontSize}px Arial, sans-serif`
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.32)'
          ctx.font = `500 ${fontSize}px Arial, sans-serif`
        }

        ctx.fillText(word, x, y)
        ctx.font = `700 ${fontSize}px Arial, sans-serif`
        x += ctx.measureText(word + ' ').width
      }
    })

    ctx.restore()
  }

  // ── Draw subtitles on an overlay canvas (used for Runway video) ────────────
  const drawSubtitleOverlay = React.useCallback((currentWordIdx: number) => {
    const canvas = subCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    drawSubtitles(ctx, currentWordIdx, W, H)
  }, [allWords])

  // ── Draw canvas frame ──────────────────────────────────────────────────────
  const isPortrait = video.format === 'portrait'
  const drawFrame = React.useCallback((ctx: CanvasRenderingContext2D, sceneIdx: number, pct: number, globalT?: number) => {
    const W = isPortrait ? 720 : 1280, H = isPortrait ? 1280 : 720
    ctx.clearRect(0, 0, W, H)
    const imgs = loadedImgsRef.current
    const img = imgs[sceneIdx] || imgs[0] || null

    if (img) {
      const scale = 1 + pct * 0.03
      ctx.save()
      ctx.filter = 'brightness(0.62) saturate(0.82) contrast(1.08)'
      ctx.drawImage(img, (W - W*scale)/2, (H - H*scale)/2, W*scale, H*scale)
      ctx.restore()
    } else {
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 640)
      g.addColorStop(0, '#0D0515'); g.addColorStop(1, '#020408')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    }

    // Vignette overlay — lighter at top, heavy at bottom for subtitle readability
    const ov = ctx.createLinearGradient(0, H*0.3, 0, H)
    ov.addColorStop(0, 'rgba(0,0,0,0)'); ov.addColorStop(0.55, 'rgba(0,0,0,0.45)'); ov.addColorStop(1, 'rgba(0,0,0,0.88)')
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
    if (!imgsReady) return
    const audio = audioRef.current
    const rwVideo = runwayVideoRef.current
    isPlayingRef.current = true
    setIsPlaying(true)

    if (audio && hasAudio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    // For runway video: play the video and run subtitle overlay RAF
    if (isRunwayVideo && rwVideo) {
      rwVideo.currentTime = 0
      rwVideo.play().catch(() => {})
      const loop = () => {
        if (!isPlayingRef.current) return
        const t = audio ? audio.currentTime : (rwVideo.currentTime)
        setAudioCurrentTime(t)
        // Subtitle overlay
        const totalDurSub = audioDuration > 0 ? audioDuration : rwVideo.duration || 60
        const wordIdx = allWords.length > 0 && totalDurSub > 0
          ? Math.min(Math.floor((t / totalDurSub) * allWords.length), allWords.length - 1)
          : 0
        const sub = subCanvasRef.current
        if (sub) {
          const ctx = sub.getContext('2d')
          if (ctx) { ctx.clearRect(0, 0, sub.width, sub.height); drawSubtitles(ctx, wordIdx, sub.width, sub.height) }
        }
        if (rwVideo.ended || (audio && (audio.ended || t >= (audioDuration || 9999)))) {
          isPlayingRef.current = false; setIsPlaying(false); setCurrentScene(0); setAudioCurrentTime(0)
          rwVideo.pause(); rwVideo.currentTime = 0
          if (audio) { audio.pause(); audio.currentTime = 0 }
          const sub = subCanvasRef.current
          if (sub) sub.getContext('2d')?.clearRect(0, 0, sub.width, sub.height)
          return
        }
        animRef.current = requestAnimationFrame(loop)
      }
      animRef.current = requestAnimationFrame(loop)
      return
    }

    // Canvas player (Pexels fallback)
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    let timerStart = performance.now()

    const loop = () => {
      if (!isPlayingRef.current) return
      let sceneIdx: number, pct: number, t = 0

      if (audio && hasAudio && sceneTimingRef.current.length > 0) {
        t = audio.currentTime
        setAudioCurrentTime(t)
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
  }, [imgsReady, hasAudio, isRunwayVideo, drawFrame, allWords, N, secPerScene, audioDuration, cancelLoop])

  const stopPlay = React.useCallback(() => {
    isPlayingRef.current = false; setIsPlaying(false); setCurrentScene(0); setAudioCurrentTime(0)
    cancelLoop()
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
    const rwVideo = runwayVideoRef.current
    if (rwVideo) { rwVideo.pause(); rwVideo.currentTime = 0 }
    const sub = subCanvasRef.current
    if (sub) sub.getContext('2d')?.clearRect(0, 0, sub.width, sub.height)
    if (!isRunwayVideo) {
      const canvas = canvasRef.current
      if (canvas && imgsReady) drawFrame(canvas.getContext('2d')!, 0, 0)
    }
  }, [imgsReady, isRunwayVideo, drawFrame, cancelLoop])

  const seekTo = React.useCallback((pct: number) => {
    const audio = audioRef.current
    const rwVideo = runwayVideoRef.current
    const dur = audioDuration || N * secPerScene
    if (audio && hasAudio) audio.currentTime = pct * dur
    if (isRunwayVideo && rwVideo) rwVideo.currentTime = pct * (rwVideo.duration || dur)
    if (!isPlayingRef.current && canvasRef.current && imgsReady && !isRunwayVideo) {
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
  }, [audioDuration, N, secPerScene, hasAudio, isRunwayVideo, imgsReady, drawFrame])

  React.useEffect(() => {
    if (imgsReady && canvasRef.current && !isRunwayVideo) drawFrame(canvasRef.current.getContext('2d')!, 0, 0)
  }, [imgsReady, drawFrame, isRunwayVideo])

  React.useEffect(() => () => { isPlayingRef.current = false; cancelLoop() }, [cancelLoop])

  const downloadVideo = async () => {
    if (images.length===0) { alert("Gere um novo vídeo para ter imagens."); return }
    setDownloading(true); setDlPct(0); setDlLabel("Preparando...")
    try {
      const off = document.createElement("canvas")
      off.width=isPortrait?720:1280; off.height=isPortrait?1280:720
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
            {/* Player area — Runway video OR canvas fallback */}
            <div style={{position:"relative",background:"#000",lineHeight:0}}>

              {/* ── Runway ML video player ── */}
              {isRunwayVideo && (
                <>
                  <video
                    ref={runwayVideoRef}
                    src={video.runwayVideoUrl}
                    playsInline
                    muted
                    style={{width:"100%",display:"block",aspectRatio:isPortrait?"9/16":"16/9",maxHeight:isPortrait?"600px":"420px",objectFit:"cover"}}
                    onEnded={()=>{isPlayingRef.current=false;setIsPlaying(false);setCurrentScene(0);setAudioCurrentTime(0);cancelLoop()}}
                  />
                  {/* Subtitle overlay canvas */}
                  <canvas
                    ref={subCanvasRef}
                    width={isPortrait?720:1280}
                    height={isPortrait?1280:720}
                    style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}
                  />
                  {/* Runway badge */}
                  <div style={{position:"absolute",top:"10px",left:"10px",background:"rgba(0,0,0,0.72)",border:"1px solid rgba(197,24,58,.4)",borderRadius:"6px",padding:"4px 10px",display:"flex",alignItems:"center",gap:"6px"}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",background:M.red,boxShadow:`0 0 6px ${M.red}`}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#fff",fontWeight:600,letterSpacing:"0.08em"}}>RUNWAY ML GEN4.5</span>
                  </div>
                </>
              )}

              {/* ── Pexels canvas player ── */}
              {!isRunwayVideo && (
                <canvas ref={canvasRef} width={isPortrait?720:1280} height={isPortrait?1280:720} style={{width:"100%",display:"block",aspectRatio:isPortrait?"9/16":"16/9",maxHeight:isPortrait?"600px":"420px"}}/>
              )}

              {/* Play button overlay */}
              {!isPlaying&&imgsReady&&audioReady&&(
                <div onClick={startPlay} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <div style={{width:"68px",height:"68px",background:"rgba(197,24,58,.92)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",color:"#fff",boxShadow:"0 8px 40px rgba(197,24,58,.5)",backdropFilter:"blur(4px)",transition:"transform .15s"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="scale(1.1)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="scale(1)"}>▶</div>
                </div>
              )}

              {/* Loading state */}
              {(!imgsReady||!audioReady)&&(
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.7)"}}>
                  <div style={{textAlign:"center",color:M.t3,fontSize:"12px",fontFamily:"'JetBrains Mono',monospace"}}>
                    <div style={{width:"20px",height:"20px",border:`2px solid ${M.lineHi}`,borderTopColor:M.red,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 10px"}}/>
                    {!imgsReady ? "Carregando..." : "Carregando áudio..."}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden audio with metadata handler */}
            {video.audioBase64&&(
              <audio ref={audioRef} src={video.audioBase64} style={{display:"none"}}
                onLoadedMetadata={onAudioLoaded}
                onEnded={()=>{if(!isRunwayVideo){isPlayingRef.current=false;setIsPlaying(false);setCurrentScene(0);setAudioCurrentTime(0);cancelLoop()}}}/>
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
                {/* Runway MP4 direct download */}
                {isRunwayVideo&&(
                  <a href={video.runwayVideoUrl} download target="_blank" rel="noopener noreferrer"
                    style={{background:"rgba(197,24,58,.12)",color:M.red,border:`1px solid rgba(197,24,58,.3)`,borderRadius:"9px",padding:"9px 20px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s",textDecoration:"none",display:"inline-block"}}>
                    ↓ Baixar MP4
                  </a>
                )}
                {/* Canvas webm download (Pexels fallback) */}
                {!isRunwayVideo&&images.length>0&&(
                  <button onClick={downloadVideo} disabled={downloading}
                    style={{background:downloading?"transparent":"rgba(124,58,237,.12)",color:downloading?M.t3:"#A78BFA",border:`1px solid ${downloading?M.line:"rgba(124,58,237,.3)"}`,borderRadius:"9px",padding:"9px 20px",fontSize:"13px",fontWeight:600,cursor:downloading?"not-allowed":"pointer",opacity:downloading?.6:1,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                    {downloading?"Gerando...":"↓ Baixar .webm"}
                  </button>
                )}
                {canvasRef.current&&imgsReady&&(
                  <button onClick={()=>{
                    const c=canvasRef.current!
                    const url=c.toDataURL("image/jpeg",0.92)
                    const a=document.createElement("a");a.href=url
                    a.download=(video.title||"thumbnail").replace(/[^a-zA-Z0-9]/g,"_").substring(0,40)+".jpg"
                    a.click()
                  }}
                    style={{background:"rgba(217,119,6,.1)",color:"#D97706",border:"1px solid rgba(217,119,6,.3)",borderRadius:"9px",padding:"9px 16px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(217,119,6,.18)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(217,119,6,.1)"}}>
                    ↓ Thumbnail .jpg
                  </button>
                )}
                <button onClick={()=>{
                  const url=`${window.location.origin}/v/${video.id}`
                  navigator.clipboard.writeText(url).then(()=>setCopied("share"))
                  setTimeout(()=>setCopied(""),3000)
                }}
                  style={{background:copied==="share"?"rgba(5,150,105,.1)":"transparent",color:copied==="share"?M.green:M.t3,border:`1px solid ${copied==="share"?"rgba(5,150,105,.3)":M.line}`,borderRadius:"9px",padding:"9px 14px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s",whiteSpace:"nowrap"}}>
                  {copied==="share"?"✓ Link copiado":"↗ Compartilhar"}
                </button>
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
                  <button onClick={()=>{
                    // Generate SRT from scenes
                    const sc = video.scenes||[]
                    const dur = sc.length > 0 ? (video.audioDuration || sc.length * 5) : 30
                    const secPerScene = dur / Math.max(sc.length,1)
                    const pad = (n:number,l=2) => String(Math.floor(n)).padStart(l,'0')
                    const toSrt = (s:number) => `${pad(s/3600)}:${pad((s%3600)/60)}:${pad(s%60)},000`
                    const srt = sc.map((s:any,i:number) => `${i+1}\n${toSrt(i*secPerScene)} --> ${toSrt((i+1)*secPerScene)}\n${s.text||""}`).join("\n\n")
                    const b=new Blob([srt],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(video.title||"legenda").replace(/[^a-zA-Z0-9]/g,"_").substring(0,40)+".srt";a.click();URL.revokeObjectURL(u)
                  }}
                    style={{background:"transparent",border:`1px solid ${M.line}`,color:M.t3,borderRadius:"6px",padding:"4px 10px",fontSize:"10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=M.lineHi;e.currentTarget.style.color=M.t2}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=M.line;e.currentTarget.style.color=M.t3}}>
                    ↓ .srt
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
