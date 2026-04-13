import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ mrr:0, totalUsers:0, videosToday:0, churn:2.1 })
  const [view, setView] = useState('dashboard')
  useEffect(() => {
    const token = localStorage.getItem('token'); const u = JSON.parse(localStorage.getItem('user')||'{}')
    if (!token || u.role!=='admin') { router.push('/login'); return }
    fetch('/api/admin/stats', { headers:{ Authorization:'Bearer '+token } }).then(r=>r.json()).then(d=>{ if(d.stats){setStats(d.stats);setUsers(d.users||[])} })
  }, [])
  const logout = () => { localStorage.clear(); router.push('/') }
  const rev: Record<string,number> = { starter:47, pro:97, enterprise:297 }
  return (<><Head><title>Admin — NOCTURN.AI</title></Head>
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#080b10',color:'#f0f2f8',fontFamily:'sans-serif'}}>
      <div style={{width:'210px',background:'#0e1219',borderRight:'1px solid #1e2840',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'18px 16px',borderBottom:'1px solid #1e2840',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'11px'}}>DC</div>
          <div style={{fontSize:'13px',fontWeight:800}}>NOCTURN.AI</div>
        </div>
        <nav style={{padding:'10px 8px',flex:1}}>
          <div style={{fontSize:'9px',color:'#4a5568',letterSpacing:'2px',padding:'6px 8px',textTransform:'uppercase'}}>Admin</div>
          {[{id:'dashboard',icon:'◑',label:'Dashboard'},{id:'users',icon:'◎',label:'Usuários'},{id:'revenue',icon:'◆',label:'Receita'}].map(item=>(
            <div key={item.id} onClick={()=>setView(item.id)} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'13px',marginBottom:'2px',background:view===item.id?'rgba(255,60,92,.12)':'transparent',color:view===item.id?'#ff3c5c':'#8892a4'}}>
              {item.icon} {item.label}
            </div>))}
          <div onClick={()=>router.push('/dashboard')} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'13px',color:'#4a5568',marginTop:'12px'}}>← App</div>
        </nav>
        <div style={{padding:'12px'}}><button onClick={logout} style={{width:'100%',background:'transparent',border:'1px solid #1e2840',color:'#4a5568',borderRadius:'6px',padding:'7px',fontSize:'12px',cursor:'pointer'}}>Sair</button></div>
      </div>
      <div style={{flex:1,overflow:'auto'}}>
        <div style={{padding:'14px 24px',borderBottom:'1px solid #1e2840',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(8,11,16,.95)',position:'sticky',top:0}}>
          <div style={{fontSize:'16px',fontWeight:800}}>{view==='dashboard'?'Dashboard Admin':view==='users'?'Usuários':'Receita'}</div>
          <div style={{background:'rgba(255,60,92,.15)',border:'1px solid rgba(255,60,92,.3)',color:'#ff3c5c',fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'5px'}}>ADMIN</div>
        </div>
        <div style={{padding:'20px 24px'}}>
          {view==='dashboard' && (<div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
              {[{l:'MRR',v:'R$'+stats.mrr.toLocaleString('pt-BR'),a:true},{l:'Usuários',v:stats.totalUsers},{l:'Vídeos Hoje',v:stats.videosToday},{l:'Churn',v:stats.churn+'%'}].map((s,i)=>(
                <div key={i} style={{background:s.a?'rgba(255,60,92,.05)':'#0e1219',border:`1px solid ${s.a?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'10px',padding:'14px'}}>
                  <div style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>{s.l}</div>
                  <div style={{fontSize:'22px',fontWeight:800,marginTop:'4px',color:s.a?'#ff3c5c':'#f0f2f8'}}>{s.v}</div>
                </div>))}
            </div>
            <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #1e2840',fontSize:'13px',fontWeight:700}}>◑ Usuários por Plano</div>
              <div style={{padding:'16px'}}>
                {[{plan:'Starter',color:'#00d084',pct:'33%'},{plan:'Pro',color:'#ff3c5c',pct:'56%'},{plan:'Enterprise',color:'#7c3aed',pct:'11%'}].map((p,i)=>(
                  <div key={i} style={{marginBottom:'12px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'4px'}}><span>{p.plan}</span><span style={{color:p.color,fontFamily:'monospace'}}>{Math.round(stats.totalUsers*(i===0?.33:i===1?.56:.11))} users</span></div>
                    <div style={{height:'4px',background:'#141920',borderRadius:'2px'}}><div style={{height:'100%',width:p.pct,background:p.color,borderRadius:'2px'}}/></div>
                  </div>))}
              </div>
            </div>
          </div>)}
          {view==='users' && (<div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',overflow:'hidden'}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #1e2840',fontSize:'13px',fontWeight:700}}>◎ Usuários ({users.length})</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead><tr>{['Nome','Email','Plano','Status','Desde'].map(h=><th key={h} style={{padding:'9px 14px',textAlign:'left',fontSize:'10px',color:'#4a5568',letterSpacing:'1px',textTransform:'uppercase',borderBottom:'1px solid #1e2840'}}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.length===0 ? <tr><td colSpan={5} style={{padding:'20px',textAlign:'center',color:'#4a5568'}}>Sem usuários ainda.</td></tr> :
                  users.map((u,i)=>(
                    <tr key={i}>
                      <td style={{padding:'10px 14px',color:'#f0f2f8',fontWeight:600}}>{u.name}</td>
                      <td style={{padding:'10px 14px',color:'#4a5568',fontFamily:'monospace',fontSize:'11px'}}>{u.email}</td>
                      <td style={{padding:'10px 14px'}}><span style={{padding:'2px 7px',borderRadius:'4px',fontSize:'10px',fontWeight:700,background:u.plan==='pro'?'rgba(124,58,237,.18)':u.plan==='enterprise'?'rgba(255,60,92,.1)':'rgba(0,208,132,.1)',color:u.plan==='pro'?'#a78bfa':u.plan==='enterprise'?'#ff3c5c':'#00d084'}}>{u.plan||'starter'}</span></td>
                      <td style={{padding:'10px 14px',fontSize:'11px',color:u.active?'#00d084':'#ff3c5c'}}>{u.active?'Ativo':'Inativo'}</td>
                      <td style={{padding:'10px 14px',color:'#4a5568',fontSize:'11px',fontFamily:'monospace'}}>{u.createdAt?new Date(u.createdAt).toLocaleDateString('pt-BR'):'—'}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}
          {view==='revenue' && (<div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'16px'}}>
              {[{l:'MRR Total',v:'R$'+stats.mrr.toLocaleString('pt-BR'),a:true},{l:'ARR Projetado',v:'R$'+(stats.mrr*12).toLocaleString('pt-BR')},{l:'LTV Médio',v:'R$892'}].map((s,i)=>(
                <div key={i} style={{background:s.a?'rgba(255,60,92,.05)':'#0e1219',border:`1px solid ${s.a?'rgba(255,60,92,.3)':'#1e2840'}`,borderRadius:'10px',padding:'14px'}}>
                  <div style={{fontSize:'10px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>{s.l}</div>
                  <div style={{fontSize:'22px',fontWeight:800,marginTop:'4px',color:s.a?'#ff3c5c':'#f0f2f8'}}>{s.v}</div>
                </div>))}
            </div>
            <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',padding:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:700,marginBottom:'12px'}}>◈ Gateway — Cakto</div>
              <div style={{display:'flex',gap:'8px'}}>
                {[{n:'Cakto',on:true},{n:'Hotmart',on:true},{n:'Kiwify',on:false}].map((g,i)=>(
                  <div key={i} style={{background:'#141920',border:`1px solid ${g.on?'rgba(0,208,132,.3)':'#1e2840'}`,borderRadius:'8px',padding:'8px 14px',fontSize:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{width:'6px',height:'6px',borderRadius:'50%',background:g.on?'#00d084':'#4a5568'}}/>
                    {g.n} — {g.on?'Ativo':'Inativo'}
                  </div>))}
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div></>)
}