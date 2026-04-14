import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PLAN_URLS: Record<string,string> = {
  starter: 'https://pay.cakto.com.br/8euvzxd',
  pro: 'https://pay.cakto.com.br/37beu86',
  enterprise: 'https://pay.cakto.com.br/izhvx9t',
}

const QUICK_PROMPTS = [
  { icon:'👁️', label:'Illuminati', text:'Um documentário revelador sobre o Illuminati e como eles controlam o sistema financeiro mundial desde 1776' },
  { icon:'💀', label:'True Crime', text:'O caso real mais perturbador do true crime brasileiro que a mídia tentou esconder' },
  { icon:'👽', label:'Área 51', text:'Evidências reais de que a Área 51 esconde tecnologia extraterrestre — documentos desclassificados revelam tudo' },
  { icon:'💰', label:'Sistema Financeiro', text:'A verdade sombria sobre como os bancos centrais controlam cada governo do mundo sem que ninguém saiba' },
  { icon:'🌍', label:'Conspirações', text:'As 5 maiores conspirações que se tornaram realidade comprovada e que o mainstream ignorou por anos' },
  { icon:'🧠', label:'Controle Mental', text:'O projeto MKUltra e os experimentos secretos de controle mental da CIA que duram até hoje' },
  { icon:'🔴', label:'Sociedades Secretas', text:'As sociedades secretas mais poderosas do mundo e seus rituais que influenciam presidentes e reis' },
  { icon:'📡', label:'HAARP', text:'O projeto HAARP e a verdade sobre o controle do clima como arma geopolítica' },
]

const PLAN_CREDITS: Record<string,number> = { starter:20, pro:100, enterprise:99999 }

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
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    setUser(JSON.parse(u))
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
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const logSteps = [
    'INIT  Inicializando agente NOCTURN.AI...',
    'SCRIPT Gerando roteiro com GPT-4o...',
    'VOICE  Sintetizando narracao ElevenLabs...',
    'VISUAL Buscando b-roll dark no Pexels...',
    'EDIT   Aplicando efeitos cinematograficos...',
    'SUBS   Gerando legendas automaticas...',
    'ENCODE Codificando video H.264...',
    'THUMB  Gerando thumbnail otimizada...',
    'DONE   Video gerado com sucesso!',
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true); setProgress(0); setLogs([])
    const token = localStorage.getItem('token') || ''
    let step = 0
    const iv = setInterval(() => {
      if (step >= logSteps.length) { clearInterval(iv); return }
      setLogs(p => [...p, logSteps[step]])
      setProgress(Math.round((step + 1) / logSteps.length * 100))
      step++
    }, 900)
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ prompt, contentType, duration, voice, platforms })
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
        const rd = await rr.json()
        setRewards(rd.rewards || [])
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

  if (!user) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#080b10',color:'#8892a4',fontFamily:'sans-serif'}}>Carregando...</div>

  const maxCredits = PLAN_CREDITS[user.plan?.toLowerCase()] || 20
  const usedCredits = maxCredits === 99999 ? 0 : Math.max(0, maxCredits - (user.credits ?? maxCredits))
  const creditPct = maxCredits === 99999 ? 100 : Math.round(((user.credits ?? 0) / maxCredits) * 100)
  const eligibleRewards = rewards.filter(r => r.eligible)

  return (
    <>
      <Head><title>Dashboard — NOCTURN.AI</title></Head>
      {rewardToast && (
        <div style={{position:'fixed',top:'20px',right:'20px',zIndex:9999,background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',padding:'14px 20px',borderRadius:'12px',fontWeight:700,fontSize:'14px',boxShadow:'0 8px 32px rgba(255,60,92,.4)'}}>
          {rewardToast}
        </div>
      )}
      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#080b10',color:'#f0f2f8',fontFamily:"'Syne',sans-serif"}}>

        {/* SIDEBAR */}
        <div style={{width:'230px',background:'#0e1219',borderRight:'1px solid #1e2840',display:'flex',flexDirection:'column',flexShrink:0}}>
          <div style={{padding:'20px 16px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'13px',flexShrink:0}}>DC</div>
            <div>
              <div style={{fontSize:'15px',fontWeight:800}}>NOCTURN.AI</div>
              <div style={{fontSize:'9px',color:'#ff3c5c',letterSpacing:'2px',textTransform:'uppercase'}}>Video SaaS</div>
            </div>
          </div>
          <nav style={{padding:'12px 8px',flex:1,overflowY:'auto'}}>
            {[
              {id:'generator',icon:'▶',label:'Gerar Video',badge:'IA'},
              {id:'videos',icon:'■',label:'Meus Videos',badge:String(videos.length)},
              {id:'rewards',icon:'★',label:'Rewards',badge:eligibleRewards.length>0?String(eligibleRewards.length):undefined,badgeRed:true},
              {id:'billing',icon:'◆',label:'Assinatura'},
            ].map(item => (
              <div key={item.id} onClick={()=>setView(item.id)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',marginBottom:'2px',background:view===item.id?'rgba(255,60,92,.12)':'transparent',color:view===item.id?'#ff3c5c':'#8892a4',fontWeight:view===item.id?700:400}}>
                <span>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
                {item.badge && <span style={{fontSize:'9px',padding:'2px 7px',borderRadius:'10px',fontWeight:700,fontFamily:'monospace',background:(item as any).badgeRed?'rgba(255,60,92,.9)':item.badge==='IA'?'#00d084':'rgba(255,60,92,.3)',color:(item as any).badgeRed||item.badge==='IA'?'#fff':'#ff3c5c'}}>{item.badge}</span>}
              </div>
            ))}
            {user.role==='admin'&&<><div style={{fontSize:'9px',color:'#4a5568',letterSpacing:'2px',padding:'10px 10px 4px',textTransform:'uppercase',fontFamily:'monospace'}}>Admin</div><div onClick={()=>router.push('/admin')} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',color:'#8892a4'}}><span>◑</span><span>Dashboard Admin</span></div></>}
          </nav>
          <div style={{padding:'14px',borderTop:'1px solid #1e2840'}}>
            <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'10px',padding:'12px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                <div style={{fontSize:'9px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Creditos</div>
                <div style={{fontSize:'11px',fontWeight:700,color:creditPct<25?'#ff3c5c':creditPct<50?'#ffb020':'#00d084'}}>{maxCredits===99999?'Ilimitado':`${user.credits??0}/${maxCredits}`}</div>
              </div>
              {maxCredits!==99999&&<>
                <div style={{height:'5px',background:'#1e2840',borderRadius:'3px',overflow:'hidden',marginBottom:'5px'}}>
                  <div style={{height:'100%',width:`${creditPct}%`,background:creditPct<25?'#ff3c5c':creditPct<50?'#ffb020':'#00d084',borderRadius:'3px',transition:'width .5s'}}/>
                </div>
                <div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace'}}>{usedCredits}/{maxCredits} videos usados</div>
                {creditPct<30&&<div onClick={()=>setView('billing')} style={{marginTop:'8px',padding:'6px 8px',background:'rgba(255,60,92,.08)',border:'1px solid rgba(255,60,92,.2)',borderRadius:'6px',fontSize:'10px',color:'#ff3c5c',cursor:'pointer'}}>Creditos baixos — upgrade</div>}
              </>}
            </div>
            <button onClick={logout} style={{width:'100%',background:'transparent',border:'1px solid #1e2840',color:'#4a5568',borderRadius:'7px',padding:'8px',fontSize:'12px',cursor:'pointer'}}>Sair</button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'16px 28px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,11,16,.95)',position:'sticky',top:0,zIndex:10}}>
            <div>
              <div style={{fontSize:'18px',fontWeight:800}}>{view==='generator'?'Gerar Video':view==='videos'?'Meus Videos':view==='rewards'?'Rewards':'Assinatura'}</div>
              <div style={{fontSize:'11px',color:'#4a5568',marginTop:'2px',fontFamily:'monospace'}}>Ola, {user.name}</div>
            </div>
            <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ff3c5c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff'}}>{user.name?.[0]?.toUpperCase()}</div>
          </div>

          <div style={{padding:'24px 28px'}}>

            {view==='generator'&&<div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
                {[{label:'Videos Gerados',value:videos.length,accent:true},{label:'Creditos Restantes',value:maxCredits===99999?'Ilimitado':(user.credits??0),accent:false},{label:'Plano Atual',value:user.plan||'Starter',accent:false}].map((stat,i)=>(
                  <div key={i} style={{background:stat.accent?'rgba(255,60,92,.04)':'#0e1219',border:`1px solid ${stat.accent?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'12px',padding:'18px'}}>
                    <div style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>{stat.label}</div>
                    <div style={{fontSize:'26px',fontWeight:800,marginTop:'6px',color:stat.accent?'#ff3c5c':'#f0f2f8'}}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',padding:'24px',marginBottom:'16px'}}>
                <div style={{fontSize:'14px',fontWeight:700,marginBottom:'16px',color:'#f0f2f8'}}>Agente Gerador de Video Dark Channel</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Tipo de Conteudo</label>
                    <select value={contentType} onChange={e=>setContentType(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                      <option value="faceless">Faceless / Dark Channel</option>
                      <option value="mystery">Misterio e Conspiracoes</option>
                      <option value="horror">Terror e Creepypasta</option>
                      <option value="crypto">Crypto e Financas</option>
                      <option value="asmr">ASMR Dark</option>
                      <option value="truecrime">True Crime</option>
                    </select>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Duracao</label>
                    <select value={duration} onChange={e=>setDuration(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                      <option value="short">Short / Reel (30-60s)</option>
                      <option value="medium">Medio (5-10 min)</option>
                      <option value="long">Longo (15-30 min)</option>
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:'14px'}}>
                  <div style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace',marginBottom:'8px'}}>Prompts Prontos — clique para usar</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px'}}>
                    {QUICK_PROMPTS.map((qp,i)=>(
                      <div key={i} onClick={()=>setPrompt(qp.text)} style={{background:prompt===qp.text?'rgba(255,60,92,.15)':'#141920',border:`1px solid ${prompt===qp.text?'rgba(255,60,92,.5)':'#1e2840'}`,borderRadius:'8px',padding:'8px 10px',cursor:'pointer'}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,60,92,.4)'}}
                        onMouseLeave={e=>{if(prompt!==qp.text)(e.currentTarget as HTMLElement).style.borderColor='#1e2840'}}>
                        <div style={{fontSize:'16px',marginBottom:'3px'}}>{qp.icon}</div>
                        <div style={{fontSize:'11px',fontWeight:700,color:'#f0f2f8'}}>{qp.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'14px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Prompt / Tema do Video</label>
                  <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ex: Um documentario sobre sociedades secretas..." style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none',resize:'vertical',minHeight:'70px'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'18px'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Voz IA</label>
                    <select value={voice} onChange={e=>setVoice(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                      <option value="masculine">Grave Masculina (PT-BR)</option>
                      <option value="feminine">Misteriosa Feminina (PT-BR)</option>
                      <option value="neutral">Neutro (PT-BR)</option>
                      <option value="asmr">Sussurrada (ASMR)</option>
                    </select>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Plataformas</label>
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'4px'}}>
                      {['youtube','tiktok','instagram','shorts'].map(p=>(
                        <div key={p} onClick={()=>togglePlat(p)} style={{padding:'6px 10px',borderRadius:'16px',fontSize:'11px',fontWeight:600,cursor:'pointer',border:`1px solid ${platforms.includes(p)?'#ff3c5c':'#1e2840'}`,color:platforms.includes(p)?'#ff3c5c':'#8892a4',background:platforms.includes(p)?'rgba(255,60,92,.08)':'transparent'}}>
                          {p==='youtube'?'YouTube':p==='tiktok'?'TikTok':p==='instagram'?'Instagram':'Shorts'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                  <button onClick={handleGenerate} disabled={generating||!prompt.trim()} style={{padding:'11px 26px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:700,cursor:generating||!prompt.trim()?'not-allowed':'pointer',opacity:generating||!prompt.trim()?0.5:1,flexShrink:0}}>
                    {generating?'Gerando...':'Gerar com IA'}
                  </button>
                  {generating&&<><div style={{flex:1,height:'4px',background:'#1e2840',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',background:'linear-gradient(90deg,#ff3c5c,#ff6b35)',borderRadius:'2px',transition:'width .5s',width:progress+'%'}}/></div><span style={{fontSize:'11px',color:'#8892a4',fontFamily:'monospace',minWidth:'34px'}}>{progress}%</span></>}
                </div>
                {logs.length>0&&<div ref={logRef} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'12px',fontFamily:'monospace',fontSize:'11px',color:'#f0f2f8',maxHeight:'120px',overflowY:'auto',marginTop:'14px',lineHeight:1.7}}>
                  {logs.map((l,i)=><div key={i}><span style={{color:'#4a5568',marginRight:'8px'}}>[{String(i*3).padStart(2,'0')}s]</span><span style={{color:l.includes('DONE')?'#00d084':'#ff6b35',marginRight:'6px'}}>{l.split(' ')[0]}</span><span>{l.split(' ').slice(1).join(' ')}</span></div>)}
                </div>}
              </div>
              {videos.length>0&&<div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',overflow:'hidden'}}>
                <div style={{padding:'14px 20px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontSize:'13px',fontWeight:700}}>Videos Recentes</div>
                  <button onClick={()=>setView('videos')} style={{background:'transparent',border:'1px solid #1e2840',color:'#8892a4',borderRadius:'6px',padding:'5px 12px',fontSize:'11px',cursor:'pointer'}}>Ver todos</button>
                </div>
                <div style={{padding:'16px'}}><VideoGrid videos={videos.slice(0,3)} onSelect={setSelectedVideo}/></div>
              </div>}
            </div>}

            {view==='videos'&&<div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700}}>Biblioteca ({videos.length})</h2>
                <button onClick={()=>setView('generator')} style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>+ Gerar Novo</button>
              </div>
              {videos.length===0?<div style={{textAlign:'center',padding:'60px',color:'#4a5568'}}><div style={{fontSize:'40px',marginBottom:'16px'}}>🎬</div><div style={{fontSize:'15px',fontWeight:600,marginBottom:'8px'}}>Nenhum video ainda</div><div style={{fontSize:'13px'}}>Gere seu primeiro dark channel!</div></div>:<VideoGrid videos={videos} onSelect={setSelectedVideo}/>}
            </div>}

            {view==='rewards'&&<div>
              <div style={{background:'rgba(255,60,92,.04)',border:'1px solid rgba(255,60,92,.1)',borderRadius:'12px',padding:'16px',marginBottom:'24px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#f0f2f8',marginBottom:'4px'}}>Sistema de Rewards NOCTURN.AI</div>
                <div style={{fontSize:'12px',color:'#8892a4',lineHeight:1.7}}>Complete milestones gerando videos e acumulando views. Ganhe ate <strong style={{color:'#ff3c5c'}}>2 creditos bonus por mes</strong>.</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px',marginBottom:'32px'}}>
                {rewards.map((r:any)=>(
                  <div key={r.id} style={{background:r.unlocked?'rgba(0,208,132,.03)':'#0e1219',border:`1px solid ${r.unlocked?'rgba(0,208,132,.2)':r.eligible?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'12px',padding:'18px',opacity:r.unlocked?0.7:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                      <div style={{fontSize:'28px'}}>{r.badge}</div>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:700,color:r.unlocked?'#00d084':r.eligible?'#ff3c5c':'#f0f2f8'}}>{r.unlocked?'✓ ':''}{r.label}</div>
                        <div style={{fontSize:'11px',color:'#4a5568',marginTop:'2px'}}>{r.type==='views'?'Milestone de views':'Milestone de criacao'}{r.credits>0&&<span style={{color:'#ff3c5c',marginLeft:'8px',fontWeight:700}}>+{r.credits} credito bonus</span>}</div>
                      </div>
                    </div>
                    {!r.unlocked&&<div style={{marginBottom:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#4a5568',marginBottom:'4px',fontFamily:'monospace'}}><span>Progresso</span><span>{r.progress}/{r.target}</span></div>
                      <div style={{height:'4px',background:'#1e2840',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,Math.round(r.progress/r.target*100))}%`,background:r.eligible?'linear-gradient(90deg,#ff3c5c,#ff6b35)':'#4a5568',borderRadius:'2px'}}/></div>
                    </div>}
                    {r.eligible&&!r.unlocked&&<button onClick={()=>handleClaimReward(r.id)} disabled={claimingId===r.id} style={{width:'100%',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',padding:'9px',fontSize:'12px',fontWeight:700,cursor:'pointer',opacity:claimingId===r.id?0.5:1}}>{claimingId===r.id?'Resgatando...':r.credits>0?`Resgatar +${r.credits} credito`:'Resgatar Badge'}</button>}
                    {r.unlocked&&<div style={{fontSize:'11px',color:'#00d084',textAlign:'center',fontFamily:'monospace'}}>Resgatado</div>}
                  </div>
                ))}
              </div>
              <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',padding:'24px'}}>
                <div style={{fontSize:'14px',fontWeight:700,marginBottom:'4px'}}>Reportar Views</div>
                <div style={{fontSize:'12px',color:'#8892a4',marginBottom:'16px',lineHeight:1.6}}>Publique seus videos no YouTube/TikTok e reporte as views para desbloquear milestones.</div>
                {videos.length===0?<div style={{textAlign:'center',padding:'20px',color:'#4a5568',fontSize:'13px'}}>Gere videos primeiro.</div>:
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {videos.slice(0,5).map((v:any)=>(
                      <div key={v.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 14px',background:'#141920',border:'1px solid #1e2840',borderRadius:'8px'}}>
                        <div style={{flex:1,fontSize:'12px',color:'#f0f2f8',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.title}</div>
                        {reportingVideoId===v.id?<div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                          <input type="number" value={viewsInput} onChange={e=>setViewsInput(e.target.value)} placeholder="Ex: 1500" style={{background:'#0e1219',border:'1px solid rgba(255,60,92,.3)',borderRadius:'6px',padding:'6px 10px',color:'#f0f2f8',fontSize:'12px',outline:'none',width:'100px'}}/>
                          <button onClick={()=>handleReportViews(v.id)} style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'6px',padding:'6px 12px',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>Salvar</button>
                          <button onClick={()=>setReportingVideoId('')} style={{background:'transparent',border:'1px solid #1e2840',color:'#8892a4',borderRadius:'6px',padding:'6px 10px',fontSize:'11px',cursor:'pointer'}}>X</button>
                        </div>:<button onClick={()=>setReportingVideoId(v.id)} style={{background:'transparent',border:'1px solid #1e2840',color:'#8892a4',borderRadius:'6px',padding:'5px 12px',fontSize:'11px',cursor:'pointer',whiteSpace:'nowrap'}}>+ Views</button>}
                      </div>
                    ))}
                  </div>}
              </div>
            </div>}

            {view==='billing'&&<div>
              <h2 style={{fontSize:'16px',fontWeight:700,marginBottom:'8px'}}>Assinatura</h2>
              <div style={{fontSize:'13px',color:'#8892a4',marginBottom:'24px',background:'rgba(255,60,92,.04)',border:'1px solid rgba(255,60,92,.1)',borderRadius:'8px',padding:'12px'}}>
                1 credito = 1 video completo (roteiro + voz IA + edicao). Creditos renovam todo mes.
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}}>
                {[
                  {n:'Starter',p:47,credits:20,url:PLAN_URLS.starter,color:'#00d084',features:['20 creditos/mes','= 20 videos completos','YouTube + TikTok','Roteiro GPT-4o','Voz IA PT-BR']},
                  {n:'Pro',p:97,credits:100,url:PLAN_URLS.pro,color:'#ff3c5c',hot:true,features:['100 creditos/mes','= 100 videos completos','Todas plataformas','Roteiro avancado','Voz personalizada']},
                  {n:'Enterprise',p:297,credits:999,url:PLAN_URLS.enterprise,color:'#7c3aed',features:['Creditos ilimitados','Videos ilimitados','Multi-usuario','API completa','White-label']},
                ].map((pl,i)=>(
                  <div key={i} style={{background:'#0e1219',border:`1px solid ${(pl as any).hot?'rgba(255,60,92,.4)':user.plan?.toLowerCase()===pl.n.toLowerCase()?'rgba(0,208,132,.4)':'#1e2840'}`,borderRadius:'14px',padding:'22px',position:'relative',display:'flex',flexDirection:'column'}}>
                    {(pl as any).hot&&<div style={{position:'absolute',top:'-11px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 12px',borderRadius:'10px',whiteSpace:'nowrap'}}>Mais Popular</div>}
                    <div style={{fontSize:'10px',color:pl.color,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px',fontFamily:'monospace'}}>{pl.n}</div>
                    <div style={{fontSize:'30px',fontWeight:800,marginBottom:'10px'}}>R${pl.p}<span style={{fontSize:'12px',fontWeight:400,color:'#8892a4'}}>/mes</span></div>
                    <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px',textAlign:'center',marginBottom:'14px'}}>
                      <div style={{fontSize:'24px',fontWeight:800,color:pl.color}}>{pl.credits===999?'∞':pl.credits}</div>
                      <div style={{fontSize:'11px',color:'#8892a4'}}>creditos/mes</div>
                      <div style={{fontSize:'10px',color:'#4a5568',marginTop:'3px',fontFamily:'monospace'}}>{pl.credits===999?'ilimitados':`= ${pl.credits} videos/mes`}</div>
                    </div>
                    <ul style={{listStyle:'none',marginBottom:'16px',flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                      {pl.features.map((f,j)=><li key={j} style={{fontSize:'12px',color:'#8892a4',display:'flex',alignItems:'center',gap:'6px'}}><span style={{color:pl.color}}>✓</span>{f}</li>)}
                    </ul>
                    <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',background:(pl as any).hot?'linear-gradient(135deg,#ff3c5c,#ff6b35)':'transparent',border:(pl as any).hot?'none':`1px solid ${pl.color}`,color:(pl as any).hot?'#fff':pl.color,padding:'10px',borderRadius:'8px',fontWeight:700,fontSize:'13px'}}>
                      {user.plan?.toLowerCase()===pl.n.toLowerCase()?'Plano Atual':`Assinar ${pl.n}`}
                    </a>
                  </div>
                ))}
              </div>
            </div>}

          </div>
        </div>
      </div>

      {selectedVideo&&<div onClick={()=>setSelectedVideo(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'16px',width:'100%',maxWidth:'640px',maxHeight:'80vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{fontWeight:700,fontSize:'15px'}}>{selectedVideo.title}</div>
            <button onClick={()=>setSelectedVideo(null)} style={{background:'transparent',border:'none',color:'#8892a4',fontSize:'18px',cursor:'pointer',padding:'4px 8px'}}>X</button>
          </div>
          <div style={{padding:'20px',overflowY:'auto',flex:1}}>
            <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'10px',padding:'16px',maxHeight:'250px',overflowY:'auto',marginBottom:'14px'}}>
              <div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace',letterSpacing:'1px',marginBottom:'10px',textTransform:'uppercase'}}>Roteiro Gerado</div>
              <p style={{fontSize:'13px',color:'#f0f2f8',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{selectedVideo.script}</p>
            </div>
            {selectedVideo.tags?.length>0&&<div>
              <div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace',letterSpacing:'1px',marginBottom:'8px',textTransform:'uppercase'}}>Tags SEO</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {selectedVideo.tags.map((tag:string,i:number)=><span key={i} style={{background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.2)',color:'#ff3c5c',padding:'3px 10px',borderRadius:'12px',fontSize:'11px'}}>#{tag}</span>)}
              </div>
            </div>}
          </div>
        </div>
      </div>}
    </>
  )
}

function VideoGrid({videos,onSelect}:{videos:any[],onSelect:(v:any)=>void}) {
  return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
    {videos.map((v:any)=>(
      <div key={v.id} onClick={()=>onSelect(v)} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'10px',overflow:'hidden',cursor:'pointer'}}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#ff3c5c'}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#1e2840'}}>
        <div style={{height:'90px',background:'linear-gradient(135deg,#08080f,#150820)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
          <div style={{width:'34px',height:'34px',background:'rgba(255,60,92,.85)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'13px'}}>▶</div>
          <div style={{position:'absolute',top:'6px',left:'6px',display:'flex',gap:'3px'}}>
            {(v.platforms||[]).slice(0,2).map((p:string)=><span key={p} style={{fontSize:'8px',padding:'2px 5px',borderRadius:'3px',background:p==='youtube'?'#ff0000':p==='tiktok'?'#111':'#bc1888',color:'#fff',fontWeight:700}}>{p==='youtube'?'YT':p==='tiktok'?'TT':'IG'}</span>)}
          </div>
        </div>
        <div style={{padding:'10px 12px'}}>
          <div style={{fontSize:'12px',fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:'4px',color:'#f0f2f8'}}>{v.title}</div>
          <div style={{fontSize:'10px',color:'#00d084',fontFamily:'monospace'}}>Pronto — clique para ver roteiro</div>
        </div>
      </div>
    ))}
  </div>
}