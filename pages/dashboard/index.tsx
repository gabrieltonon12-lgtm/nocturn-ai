import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  useEffect(() => {
    const u = localStorage.getItem('user'); const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    setUser(JSON.parse(u))
    fetch('/api/videos', { headers:{ Authorization:'Bearer '+t } }).then(r=>r.json()).then(d=>setVideos(d.videos||[]))
  }, [])
  const togglePlat = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p])
  const logSteps = ['INIT Inicializando agente...','SCRIPT Gerando roteiro com GPT-4o...','VOICE Sintetizando narração...','VISUAL Buscando b-roll dark...','EDIT Aplicando efeitos...','ENCODE Codificando vídeo...','DONE ✓ Vídeo gerado!']
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true); setProgress(0); setLogs([])
    const token = localStorage.getItem('token')||''
    let step = 0
    const iv = setInterval(() => { if (step>=logSteps.length) { clearInterval(iv); return } setLogs(p=>[...p,logSteps[step]]); setProgress(Math.round((step+1)/logSteps.length*100)); step++ }, 900)
    try {
      const res = await fetch('/api/generate/video', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body: JSON.stringify({prompt,contentType,duration,voice,platforms}) })
      const data = await res.json()
      setTimeout(() => { clearInterval(iv); setGenerating(false); setProgress(100); if (res.ok) { setVideos(v=>[data.video,...v]); const u=JSON.parse(localStorage.getItem('user')||'{}'); u.credits=data.creditsRemaining; localStorage.setItem('user',JSON.stringify(u)); setUser((prev:any)=>({...prev,credits:data.creditsRemaining})) } else alert(data.error) }, logSteps.length*900+500)
    } catch { clearInterval(iv); setGenerating(false) }
  }
  const logout = () => { localStorage.clear(); router.push('/') }
  if (!user) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#8892a4',background:'#080b10'}}>Carregando...</div>
  const c = (x: React.CSSProperties) => x
  return (<><Head><title>Dashboard — NOCTURN.AI</title></Head>
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#080b10',color:'#f0f2f8',fontFamily:'sans-serif'}}>
      <div style={{width:'220px',background:'#0e1219',borderRight:'1px solid #1e2840',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'12px'}}>DC</div>
          <div style={{fontSize:'14px',fontWeight:800}}>NOCTURN.AI</div>
        </div>
        <nav style={{padding:'12px 8px',flex:1}}>
          {[{id:'generator',icon:'▶',label:'Gerar Vídeo'},{id:'videos',icon:'◼',label:'Meus Vídeos'},{id:'billing',icon:'◈',label:'Assinatura'}].map(item=>(
            <div key={item.id} onClick={()=>setView(item.id)} style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',marginBottom:'2px',background:view===item.id?'rgba(255,60,92,.12)':'transparent',color:view===item.id?'#ff3c5c':'#8892a4',fontWeight:view===item.id?700:400}}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
          {user.role==='admin' && <div onClick={()=>router.push('/admin')} style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 10px',borderRadius:'7px',cursor:'pointer',fontSize:'13px',color:'#8892a4',marginTop:'16px'}}>◑ Admin</div>}
        </nav>
        <div style={{padding:'12px',borderTop:'1px solid #1e2840'}}>
          <div style={{background:'linear-gradient(135deg,#7c3aed,#ff3c5c)',borderRadius:'8px',padding:'10px',marginBottom:'8px'}}>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,.6)',letterSpacing:'2px',textTransform:'uppercase'}}>Plano</div>
            <div style={{fontSize:'13px',fontWeight:700,color:'#fff'}}>{user.plan||'Starter'}</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.5)'}}>{user.credits??20} créditos</div>
          </div>
          <button onClick={logout} style={{width:'100%',background:'transparent',border:'1px solid #1e2840',color:'#4a5568',borderRadius:'7px',padding:'7px',fontSize:'12px',cursor:'pointer'}}>Sair</button>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto'}}>
        <div style={{padding:'14px 24px',borderBottom:'1px solid #1e2840',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(8,11,16,.95)',position:'sticky',top:0}}>
          <div><div style={{fontSize:'16px',fontWeight:800}}>{view==='generator'?'Gerar Vídeo':view==='videos'?'Meus Vídeos':'Assinatura'}</div><div style={{fontSize:'11px',color:'#4a5568'}}>Olá, {user.name}</div></div>
          <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ff3c5c)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'12px'}}>{user.name?.[0]?.toUpperCase()}</div>
        </div>
        <div style={{padding:'20px 24px'}}>
          {view==='generator' && (<div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'16px'}}>
              {[{l:'Vídeos Gerados',v:videos.length,a:true},{l:'Créditos',v:user.credits??20,a:false},{l:'Plano',v:user.plan||'Starter',a:false}].map((s,i)=>(
                <div key={i} style={{background:s.a?'rgba(255,60,92,.05)':'#0e1219',border:`1px solid ${s.a?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'10px',padding:'14px'}}>
                  <div style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>{s.l}</div>
                  <div style={{fontSize:'22px',fontWeight:800,marginTop:'4px',color:s.a?'#ff3c5c':'#f0f2f8'}}>{s.v}</div>
                </div>))}
            </div>
            <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:700,marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}><span style={{color:'#ff3c5c'}}>▶</span> Agente Gerador de Vídeo</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>Tipo</label>
                  <select value={contentType} onChange={e=>setContentType(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',padding:'9px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="faceless">Faceless / Dark</option><option value="mystery">Mistério</option><option value="horror">Terror</option><option value="crypto">Crypto</option><option value="truecrime">True Crime</option>
                  </select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>Duração</label>
                  <select value={duration} onChange={e=>setDuration(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',padding:'9px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="short">Short (30-60s)</option><option value="medium">Médio (5-10min)</option><option value="long">Longo (15-30min)</option>
                  </select>
                </div>
                <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:'5px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>Prompt do Vídeo</label>
                  <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ex: Documentário sobre sociedades secretas, tom sombrio e misterioso..." style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',padding:'9px',color:'#f0f2f8',fontSize:'13px',outline:'none',resize:'vertical',minHeight:'70px'}}/>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>Voz IA</label>
                  <select value={voice} onChange={e=>setVoice(e.target.value)} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',padding:'9px',color:'#f0f2f8',fontSize:'13px',outline:'none'}}>
                    <option value="masculine">Grave Masculina</option><option value="feminine">Misteriosa Feminina</option><option value="neutral">Neutro</option><option value="asmr">ASMR</option>
                  </select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                  <label style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>Plataformas</label>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {['youtube','tiktok','instagram','shorts'].map(p=>(
                      <div key={p} onClick={()=>togglePlat(p)} style={{padding:'5px 10px',borderRadius:'14px',fontSize:'11px',fontWeight:600,cursor:'pointer',border:`1px solid ${platforms.includes(p)?'#ff3c5c':'#1e2840'}`,color:platforms.includes(p)?'#ff3c5c':'#8892a4',background:platforms.includes(p)?'rgba(255,60,92,.08)':'transparent'}}>
                        {p==='youtube'?'YouTube':p==='tiktok'?'TikTok':p==='instagram'?'Instagram':'YT Shorts'}
                      </div>))}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:'10px',marginTop:'14px',alignItems:'center'}}>
                <button onClick={handleGenerate} disabled={generating} style={{padding:'10px 22px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'7px',fontSize:'13px',fontWeight:700,cursor:generating?'not-allowed':'pointer',opacity:generating?.6:1}}>
                  {generating?'⏳ Gerando...':'▶ Gerar com IA'}
                </button>
                {generating && <div style={{flex:1,height:'4px',background:'#141920',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:progress+'%',background:'linear-gradient(90deg,#ff3c5c,#ff6b35)',transition:'width .4s'}}/></div>}
                {generating && <span style={{fontSize:'11px',color:'#8892a4',fontFamily:'monospace'}}>{progress}%</span>}
              </div>
              {logs.length>0 && <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',padding:'10px',fontFamily:'monospace',fontSize:'11px',color:'#00d084',maxHeight:'100px',overflowY:'auto',marginTop:'12px'}}>{logs.map((l,i)=><div key={i}>[{String(i*3).padStart(2,'0')}:00] {l}</div>)}</div>}
            </div>
            {videos.length>0 && <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #1e2840',fontSize:'13px',fontWeight:700}}>Vídeos Recentes</div>
              <div style={{padding:'14px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'10px'}}>
                {videos.slice(0,3).map((v:any)=>(
                  <div key={v.id} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',overflow:'hidden'}}>
                    <div style={{height:'80px',background:'linear-gradient(135deg,#08080f,#150820)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <div style={{width:'28px',height:'28px',background:'rgba(255,60,92,.9)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'11px'}}>▶</div>
                    </div>
                    <div style={{padding:'8px 10px'}}>
                      <div style={{fontSize:'11px',fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.title}</div>
                      <div style={{fontSize:'10px',color:'#00d084',marginTop:'3px',fontFamily:'monospace'}}>● Pronto</div>
                    </div>
                  </div>))}
              </div>
            </div>}
          </div>)}
          {view==='videos' && (<div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <div style={{fontSize:'15px',fontWeight:700}}>◼ Biblioteca de Vídeos ({videos.length})</div>
              <button onClick={()=>setView('generator')} style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>+ Gerar Novo</button>
            </div>
            {videos.length===0 ? <p style={{color:'#4a5568',textAlign:'center',padding:'40px'}}>Nenhum vídeo ainda. Gere o primeiro!</p> :
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
              {videos.map((v:any)=>(
                <div key={v.id} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'10px',overflow:'hidden'}}>
                  <div style={{height:'90px',background:'linear-gradient(135deg,#08080f,#150820)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{width:'30px',height:'30px',background:'rgba(255,60,92,.9)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px'}}>▶</div>
                  </div>
                  <div style={{padding:'10px 12px'}}>
                    <div style={{fontSize:'12px',fontWeight:700,marginBottom:'4px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.title}</div>
                    <div style={{fontSize:'10px',color:'#4a5568',fontFamily:'monospace'}}>{new Date(v.createdAt).toLocaleDateString('pt-BR')}</div>
                    {v.tags?.length>0 && <div style={{fontSize:'10px',color:'#8892a4',marginTop:'4px'}}>{v.tags.slice(0,2).join(', ')}</div>}
                  </div>
                </div>))}
            </div>}
          </div>)}
          {view==='billing' && (<div>
            <div style={{fontSize:'15px',fontWeight:700,marginBottom:'20px'}}>◈ Assinatura</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px'}}>
              {[{n:'Starter',p:47,f:['20 vídeos/mês','YouTube+TikTok','Suporte email']},{n:'Pro',p:97,hot:true,f:['100 vídeos/mês','Todas plataformas','Voz personalizada','Suporte prioritário']},{n:'Enterprise',p:297,f:['Ilimitados','Multi-usuário','API completa']}].map((pl,i)=>(
                <div key={i} style={{background:'#0e1219',border:`1px solid ${pl.hot?'rgba(255,60,92,.4)':user.plan===pl.n?'rgba(0,208,132,.4)':'#1e2840'}`,borderRadius:'12px',padding:'20px',position:'relative'}}>
                  {pl.hot && <div style={{position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 10px',borderRadius:'8px',whiteSpace:'nowrap'}}>★ Mais Popular</div>}
                  <div style={{fontSize:'10px',color:'#4a5568',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>{pl.n}</div>
                  <div style={{fontSize:'28px',fontWeight:800,marginBottom:'12px'}}>R${pl.p}<span style={{fontSize:'12px',fontWeight:400,color:'#8892a4'}}>/mês</span></div>
                  <ul style={{listStyle:'none',marginBottom:'16px'}}>{pl.f.map((f,j)=><li key={j} style={{fontSize:'12px',color:'#8892a4',marginBottom:'5px'}}>✓ {f}</li>)}</ul>
                  <a href={`https://pay.cakto.com.br/${pl.n.toLowerCase()}-nocturnai`} style={{display:'block',textAlign:'center',background:pl.hot?'linear-gradient(135deg,#ff3c5c,#ff6b35)':'transparent',border:pl.hot?'none':'1px solid #1e2840',color:pl.hot?'#fff':'#8892a4',padding:'9px',borderRadius:'7px',fontWeight:700,fontSize:'12px'}}>
                    {user.plan===pl.n?'✓ Plano Atual':`Assinar ${pl.n}`}
                  </a>
                </div>))}
            </div>
          </div>)}
        </div>
      </div>
    </div></>)
}