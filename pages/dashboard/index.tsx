import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PLAN_URLS: Record<string,string> = {
  starter: 'https://pay.cakto.com.br/8euvzxd',
  pro: 'https://pay.cakto.com.br/37beu86',
  enterprise: 'https://pay.cakto.com.br/izhvx9t',
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
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('user'); const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    setUser(JSON.parse(u))
    fetch('/api/videos', { headers: { Authorization: 'Bearer ' + t } }).then(r=>r.json()).then(d=>setVideos(d.videos||[]))
  }, [])

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [logs])

  const togglePlat = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p])

  const logSteps = ['INIT  Inicializando agente NOCTURN.AI...','SCRIPT Gerando roteiro com GPT-4o...','VOICE  Sintetizando narração ElevenLabs...','VISUAL Buscando b-roll dark no Pexels...','EDIT   Aplicando efeitos cinematográficos...','SUBS   Gerando legendas automáticas...','ENCODE Codificando vídeo H.264...','THUMB  Gerando thumbnail otimizada...','DONE   ✓ Vídeo gerado com sucesso!']

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true); setProgress(0); setLogs([])
    const token = localStorage.getItem('token') || ''
    let step = 0
    const iv = setInterval(() => {
      if (step >= logSteps.length) { clearInterval(iv); return }
      setLogs(p => [...p, logSteps[step]]); setProgress(Math.round((step+1)/logSteps.length*100)); step++
    }, 900)
    try {
      const res = await fetch('/api/generate/video', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body: JSON.stringify({prompt,contentType,duration,voice,platforms}) })
      const data = await res.json()
      setTimeout(() => {
        clearInterval(iv); setGenerating(false); setProgress(100)
        if (res.ok && data.video) {
          setVideos(v => [data.video,...v])
          const u = JSON.parse(localStorage.getItem('user')||'{}'); u.credits = data.creditsRemaining; localStorage.setItem('user',JSON.stringify(u)); setUser((prev:any) => ({...prev,credits:data.creditsRemaining}))
        } else { alert(data.error||'Erro ao gerar vídeo') }
      }, logSteps.length*900+600)
    } catch { clearInterval(iv); setGenerating(false); alert('Erro de conexão. Tente novamente.') }
  }

  const logout = () => { localStorage.clear(); router.push('/') }
  if (!user) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#8892a4',background:'#080b10',fontFamily:'sans-serif'}}>Carregando...</div>

  return (<>
    <Head><title>Dashboard — NOCTURN.AI</title></Head>
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#080b10',color:'#f0f2f8',fontFamily:"'Syne',sans-serif"}}>
      <div style={{width:'230px',background:'#0e1219',borderRight:'1px solid #1e2840',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'13px',flexShrink:0}}>DC</div>
          <div><div style={{fontSize:'15px',fontWeight:800}}>NOCTURN.AI</div><div style={{fontSize:'9px',color:'#ff3c5c',letterSpacing:'2px',textTransform:'uppercase'}}>Video SaaS</div></div>
        </div>
        <nav style={{padding:'12px 8px',flex:1,overflowY:'auto'}}>
          {[{id:'generator',icon:'▶',label:'Gerar Vídeo',badge:'IA'},{id:'videos',icon:'◼',label:'Meus Vídeos',badge:String(videos.length)},{id:'billing',icon:'◈',label:'Assinatura'}].map(item=>(
            <div key={item.id} onClick={()=>setView(item.id)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',marginBottom:'2px',background:view===item.id?'rgba(255,60,92,.12)':'transparent',color:view===item.id?'#ff3c5c':'#8892a4',fontWeight:view===item.id?700:400}}>
              <span style={{fontSize:'13px'}}>{item.icon}</span><span style={{flex:1}}>{item.label}</span>
              {item.badge && <span style={{fontSize:'9px',padding:'2px 7px',borderRadius:'10px',fontWeight:700,fontFamily:'monospace',background:item.badge==='IA'?'#00d084':'rgba(255,60,92,.3)',color:item.badge==='IA'?'#000':'#ff3c5c'}}>{item.badge}</span>}
            </div>
          ))}
          {user.role==='admin' && <><div style={{fontSize:'9px',color:'#4a5568',letterSpacing:'2px',padding:'10px 10px 4px',textTransform:'uppercase',fontFamily:'monospace'}}>Admin</div><div onClick={()=>router.push('/admin')} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',color:'#8892a4'}}>◑ Dashboard Admin</div></>}
        </nav>
        <div style={{padding:'14px',borderTop:'1px solid #1e2840'}}>
          <div style={{background:'linear-gradient(135deg,rgba(124,58,237,.3),rgba(255,60,92,.2))',borderRadius:'10px',padding:'12px',marginBottom:'10px',border:'1px solid rgba(255,60,92,.15)'}}>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,.5)',letterSpacing:'2px',textTransform:'uppercase',fontFamily:'monospace'}}>Plano atual</div>
            <div style={{fontSize:'14px',fontWeight:700,color:'#fff',marginTop:'2px'}}>{user.plan||'Starter'}</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.5)',marginTop:'3px'}}>{user.credits??20} créditos restantes</div>
          </div>
          <button onClick={logout} style={{width:'100%',background:'transparent',border:'1px solid #1e2840',color:'#4a5568',borderRadius:'7px',padding:'8px',fontSize:'12px',cursor:'pointer'}}>Sair</button>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'16px 28px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,11,16,.95)',position:'sticky',top:0,zIndex:10}}>
          <div><div style={{fontSize:'18px',fontWeight:800}}>{view==='generator'?'Gerar Vídeo':view==='videos'?'Meus Vídeos':'Assinatura'}</div><div style={{fontSize:'11px',color:'#4a5568',marginTop:'2px',fontFamily:'monospace'}}>Olá, {user.name}</div></div>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ff3c5c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff'}}>{user.name?.[0]?.toUpperCase()}</div>
        </div>
        <div style={{padding:'24px 28px'}}>
          {view==='generator' && (<div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
              {[{label:'Vídeos Gerados',value:videos.length,accent:true},{label:'Créditos Restantes',value:user.credits??20,accent:false},{label:'Plano Atual',value:user.plan||'Starter',accent:false}].map((stat,i)=>(<div key={i} style={{background:stat.accent?'rgba(255,60,92,.04)':'#0e1219',border:`1px solid ${stat.accent?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'12px',padding:'18px'}}><div style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>{stat.label}</div><div style={{fontSize:'26px',fontWeight:800,marginTop:'6px',color:stat.accent?'#ff3c5c':'#f0f2f8'}}>{stat.value}</div></div>))}
            </div>
            <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',padding:'24px',marginBottom:'20px'}}>
              <div style={{fontSize:'14px',fontWeight:700,marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}><span style={{color:'#ff3c5c'}}>▶</span> Agente Gerador de Vídeo Dark Channel</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Tipo de Conteúdo</label>
                  <select value={contentType} onChange={e=>setContentType(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="faceless">Faceless / Dark Channel</option><option value="mystery">Mistério & Conspirações</option><option value="horror">Terror & Creepypasta</option><option value="crypto">Crypto & Finanças Ocultas</option><option value="asmr">ASMR Dark</option><option value="truecrime">True Crime</option>
                  </select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Duração</label>
                  <select value={duration} onChange={e=>setDuration(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="short">Short / Reel (30–60s)</option><option value="medium">Médio (5–10 min)</option><option value="long">Longo (15–30 min)</option>
                  </select>
                </div>
                <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Prompt / Tema do Vídeo</label>
                  <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ex: Um documentário sobre sociedades secretas que controlam o mundo moderno..." style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none',resize:'vertical',minHeight:'80px'}}/>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Voz IA</label>
                  <select value={voice} onChange={e=>setVoice(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px 12px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="masculine">Grave Masculina (PT-BR)</option><option value="feminine">Misteriosa Feminina (PT-BR)</option><option value="neutral">Neutro (PT-BR)</option><option value="asmr">Sussurrada (ASMR)</option>
                  </select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'monospace'}}>Plataformas</label>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'4px'}}>
                    {['youtube','tiktok','instagram','shorts'].map(p=>(<div key={p} onClick={()=>togglePlat(p)} style={{padding:'6px 13px',borderRadius:'20px',fontSize:'12px',fontWeight:600,cursor:'pointer',userSelect:'none' as any,border:`1px solid ${platforms.includes(p)?'#ff3c5c':'#1e2840'}`,color:platforms.includes(p)?'#ff3c5c':'#8892a4',background:platforms.includes(p)?'rgba(255,60,92,.08)':'transparent'}}>{p==='youtube'?'YouTube':p==='tiktok'?'TikTok':p==='instagram'?'Instagram':'YT Shorts'}</div>))}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:'12px',marginTop:'18px',alignItems:'center'}}>
                <button onClick={handleGenerate} disabled={generating||!prompt.trim()} style={{padding:'11px 26px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:700,cursor:generating||!prompt.trim()?'not-allowed':'pointer',opacity:generating||!prompt.trim()?.5:1,flexShrink:0}}>{generating?'⏳ Gerando...':'▶ Gerar com IA'}</button>
                {generating && <><div style={{flex:1,height:'4px',background:'#1e2840',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',background:'linear-gradient(90deg,#ff3c5c,#ff6b35)',borderRadius:'2px',transition:'width .5s',width:progress+'%'}}/></div><span style={{fontSize:'11px',color:'#8892a4',fontFamily:'monospace',minWidth:'34px'}}>{progress}%</span></>}
              </div>
              {logs.length>0 && <div ref={logRef} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'12px',fontFamily:'monospace',fontSize:'11px',color:'#f0f2f8',maxHeight:'130px',overflowY:'auto',marginTop:'14px',lineHeight:1.7}}>
                {logs.map((l,i)=>(<div key={i} style={{marginBottom:'2px'}}><span style={{color:'#4a5568',marginRight:'8px'}}>[{String(i*3).padStart(2,'0')}:{String(Math.floor(Math.random()*60)).padStart(2,'0')}]</span><span style={{color:l.includes('DONE')?'#00d084':'#ff6b35',marginRight:'6px'}}>{l.split(' ')[0]}</span><span>{l.split(' ').slice(1).join(' ')}</span></div>))}
              </div>}
            </div>
            {videos.length>0 && <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',overflow:'hidden'}}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{fontSize:'13px',fontWeight:700}}>● Vídeos Recentes</div>
                <button onClick={()=>setView('videos')} style={{background:'transparent',border:'1px solid #1e2840',color:'#8892a4',borderRadius:'6px',padding:'5px 12px',fontSize:'11px',cursor:'pointer'}}>Ver todos →</button>
              </div>
              <div style={{padding:'16px'}}><VideoGrid videos={videos.slice(0,3)} onSelect={setSelectedVideo}/></div>
            </div>}
          </div>)}
          {view==='videos' && (<div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{fontSize:'16px',fontWeight:700}}>◼ Biblioteca ({videos.length})</h2>
              <button onClick={()=>setView('generator')} style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>+ Gerar Novo</button>
            </div>
            {videos.length===0 ? <div style={{textAlign:'center',padding:'60px',color:'#4a5568'}}><div style={{fontSize:'40px',marginBottom:'16px'}}>🎬</div><div style={{fontSize:'15px',fontWeight:600,marginBottom:'8px'}}>Nenhum vídeo ainda</div><div style={{fontSize:'13px'}}>Gere seu primeiro dark channel!</div></div> : <VideoGrid videos={videos} onSelect={setSelectedVideo}/>}
          </div>)}
          {view==='billing' && (<div>
            <h2 style={{fontSize:'16px',fontWeight:700,marginBottom:'8px'}}>◈ Assinatura</h2>
            <div style={{fontSize:'13px',color:'#8892a4',marginBottom:'24px',background:'rgba(255,60,92,.04)',border:'1px solid rgba(255,60,92,.1)',borderRadius:'8px',padding:'12px'}}>💡 <strong>1 crédito = 1 vídeo completo</strong> com roteiro GPT-4o, voz IA e edição. Créditos renovam todo mês automaticamente.</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}}>
              {[{n:'Starter',p:47,credits:20,url:PLAN_URLS.starter,color:'#00d084',features:['20 créditos/mês','= 20 vídeos completos','YouTube + TikTok','Roteiro GPT-4o','Voz IA PT-BR','Suporte email']},{n:'Pro',p:97,credits:100,url:PLAN_URLS.pro,color:'#ff3c5c',hot:true,features:['100 créditos/mês','= 100 vídeos completos','Todas plataformas','Roteiro avançado','Voz personalizada','Suporte prioritário']},{n:'Enterprise',p:297,credits:999,url:PLAN_URLS.enterprise,color:'#7c3aed',features:['Créditos ilimitados','Vídeos ilimitados','Multi-usuário','API completa','White-label','Gerente dedicado']}].map((pl,i)=>(<div key={i} style={{background:'#0e1219',border:`1px solid ${pl.hot?'rgba(255,60,92,.4)':user.plan?.toLowerCase()===pl.n.toLowerCase()?'rgba(0,208,132,.4)':'#1e2840'}`,borderRadius:'14px',padding:'22px',position:'relative',display:'flex',flexDirection:'column'}}>
                {pl.hot && <div style={{position:'absolute',top:'-11px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 12px',borderRadius:'10px',whiteSpace:'nowrap'}}>★ Mais Popular</div>}
                <div style={{fontSize:'10px',color:pl.color,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px',fontFamily:'monospace'}}>{pl.n}</div>
                <div style={{fontSize:'30px',fontWeight:800,marginBottom:'10px'}}>R${pl.p}<span style={{fontSize:'12px',fontWeight:400,color:'#8892a4'}}>/mês</span></div>
                <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'10px',textAlign:'center',marginBottom:'14px'}}>
                  <div style={{fontSize:'24px',fontWeight:800,color:pl.color}}>{pl.credits===999?'∞':pl.credits}</div>
                  <div style={{fontSize:'11px',color:'#8892a4'}}>créditos/mês</div>
                  <div style={{fontSize:'10px',color:'#4a5568',marginTop:'3px',fontFamily:'monospace'}}>{pl.credits===999?'ilimitados':`= ${pl.credits} vídeos/mês`}</div>
                </div>
                <ul style={{listStyle:'none',marginBottom:'16px',flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                  {pl.features.map((f,j)=>(<li key={j} style={{fontSize:'12px',color:'#8892a4',display:'flex',alignItems:'center',gap:'6px'}}><span style={{color:pl.color}}>✓</span>{f}</li>))}
                </ul>
                <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',background:pl.hot?'linear-gradient(135deg,#ff3c5c,#ff6b35)':'transparent',border:pl.hot?'none':`1px solid ${pl.color}`,color:pl.hot?'#fff':pl.color,padding:'10px',borderRadius:'8px',fontWeight:700,fontSize:'13px'}}>{user.plan?.toLowerCase()===pl.n.toLowerCase()?'✓ Plano Atual':`Assinar ${pl.n}`}</a>
              </div>))}
            </div>
          </div>)}
        </div>
      </div>
    </div>
    {selectedVideo && (<div onClick={()=>setSelectedVideo(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'16px',width:'100%',maxWidth:'640px',maxHeight:'80vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:'15px',color:'#f0f2f8'}}>{selectedVideo.title}</div>
          <button onClick={()=>setSelectedVideo(null)} style={{background:'transparent',border:'none',color:'#8892a4',fontSize:'18px',cursor:'pointer',padding:'4px 8px'}}>✕</button>
        </div>
        <div style={{padding:'20px',overflowY:'auto',flex:1}}>
          <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'10px',padding:'16px',maxHeight:'280px',overflowY:'auto',marginBottom:'14px'}}>
            <div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace',letterSpacing:'1px',marginBottom:'10px',textTransform:'uppercase'}}>Roteiro Gerado pelo GPT-4o</div>
            <p style={{fontSize:'13px',color:'#f0f2f8',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{selectedVideo.script||'Roteiro não disponível.'}</p>
          </div>
          {selectedVideo.description && <div style={{marginBottom:'14px'}}><div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace',letterSpacing:'1px',marginBottom:'8px',textTransform:'uppercase'}}>Descrição YouTube</div><p style={{fontSize:'12px',color:'#8892a4',lineHeight:1.6,background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'12px'}}>{selectedVideo.description}</p></div>}
          {selectedVideo.tags?.length>0 && <div style={{marginBottom:'14px'}}><div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace',letterSpacing:'1px',marginBottom:'8px',textTransform:'uppercase'}}>Tags SEO</div><div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{selectedVideo.tags.map((tag:string,i:number)=>(<span key={i} style={{background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.2)',color:'#ff3c5c',padding:'3px 10px',borderRadius:'12px',fontSize:'11px'}}>#{tag}</span>))}</div></div>}
          <div style={{padding:'12px',background:'rgba(0,208,132,.05)',border:'1px solid rgba(0,208,132,.15)',borderRadius:'8px',fontSize:'12px',color:'#00d084'}}>✓ Gerado em {selectedVideo.createdAt?new Date(selectedVideo.createdAt).toLocaleString('pt-BR'):'—'} · Plataformas: {selectedVideo.platforms?.join(', ')}</div>
        </div>
      </div>
    </div>)}
  </>)
}

function VideoGrid({ videos, onSelect }: { videos: any[], onSelect: (v: any) => void }) {
  return (<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
    {videos.map((v:any)=>(<div key={v.id} onClick={()=>onSelect(v)} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'10px',overflow:'hidden',cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#ff3c5c';(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#1e2840';(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
      <div style={{height:'100px',background:'linear-gradient(135deg,#08080f,#150820)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
        <div style={{width:'36px',height:'36px',background:'rgba(255,60,92,.85)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'14px'}}>▶</div>
        <div style={{position:'absolute',bottom:'6px',right:'8px',fontSize:'9px',background:'rgba(0,0,0,.8)',padding:'2px 6px',borderRadius:'4px',color:'#fff',fontFamily:'monospace'}}>{v.duration==='short'?'~45s':v.duration==='medium'?'~8min':'~20min'}</div>
        <div style={{position:'absolute',top:'6px',left:'6px',display:'flex',gap:'3px'}}>{(v.platforms||[]).slice(0,2).map((p:string)=>(<span key={p} style={{fontSize:'8px',padding:'2px 5px',borderRadius:'3px',background:p==='youtube'?'#ff0000':p==='tiktok'?'#111':'#bc1888',color:'#fff',fontWeight:700}}>{p==='youtube'?'YT':p==='tiktok'?'TT':'IG'}</span>))}</div>
      </div>
      <div style={{padding:'10px 12px'}}>
        <div style={{fontSize:'12px',fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:'4px',color:'#f0f2f8'}}>{v.title}</div>
        <div style={{fontSize:'10px',color:'#4a5568',display:'flex',justifyContent:'space-between',fontFamily:'monospace'}}><span style={{color:'#00d084'}}>● Pronto</span><span>{v.createdAt?new Date(v.createdAt).toLocaleDateString('pt-BR'):''}</span></div>
        <div style={{fontSize:'10px',color:'#ff3c5c',marginTop:'4px',fontFamily:'monospace'}}>clique para ver roteiro →</div>
      </div>
    </div>))}
  </div>)
}