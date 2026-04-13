import Head from 'next/head'; import Link from 'next/link'
export default function Home() {
  return (<><Head><title>NOCTURN.AI</title><meta name="description" content="Seu agente de IA para dark channels. Cria, narra e edita videos para YouTube e TikTok no automatico."/></Head>
  <main style={{minHeight:'100vh',background:'#080b10',color:'#f0f2f8',fontFamily:'sans-serif'}}>
    <nav style={{padding:'16px 40px',borderBottom:'1px solid #1e2840',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontSize:'18px',fontWeight:800}}>NOCTURN.AI</div>
      <div style={{display:'flex',gap:'12px'}}><Link href="/login" style={{color:'#8892a4',padding:'8px 16px',border:'1px solid #1e2840',borderRadius:'8px'}}>Entrar</Link><Link href="/register" style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',padding:'8px 16px',borderRadius:'8px',fontWeight:700}}>Comecar</Link></div>
    </nav>
    <section style={{textAlign:'center',padding:'100px 20px'}}>
      <div style={{display:'inline-block',background:'rgba(124,58,237,.15)',border:'1px solid rgba(124,58,237,.3)',color:'#a78bfa',padding:'6px 16px',borderRadius:'20px',fontSize:'12px',marginBottom:'24px'}}>Powered by GPT-4o + ElevenLabs</div>
      <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:800,marginBottom:'20px'}}>Seu agente de IA<br/>para <span style={{color:'#ff3c5c'}}>dark channels</span></h1>
      <p style={{fontSize:'18px',color:'#8892a4',marginBottom:'36px'}}>Cria, narra e edita videos para YouTube e TikTok no automatico.<br/>Sem camera. Sem rosto. Sem esforco.</p>
      <Link href="/register" style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',padding:'14px 32px',borderRadius:'8px',fontWeight:700,fontSize:'15px',display:'inline-block'}}>Comecar Agora — 7 dias gratis</Link>
    </section>
    <section style={{padding:'60px 40px',maxWidth:'1000px',margin:'0 auto'}}>
      <h2 style={{textAlign:'center',fontSize:'28px',fontWeight:800,marginBottom:'40px'}}>Planos</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px'}}>
        {[{n:'Starter',p:47,f:['20 videos/mes','YouTube+TikTok','Suporte email']},{n:'Pro',p:97,hot:true,f:['100 videos/mes','Todas plataformas','Voz personalizada','Suporte prioritario']},{n:'Enterprise',p:297,f:['Ilimitado','Multi-usuario','API completa']}].map((plan,i)=>(
          <div key={i} style={{background:'#0e1219',border:`1px solid ${plan.hot?'rgba(255,60,92,.4)':'#1e2840'}`,borderRadius:'14px',padding:'24px'}}>
            <div style={{fontSize:'11px',color:'#4a5568',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>{plan.n}</div>
            <div style={{fontSize:'32px',fontWeight:800,marginBottom:'16px'}}>R${plan.p}<span style={{fontSize:'13px',fontWeight:400,color:'#8892a4'}}>/mes</span></div>
            <ul style={{listStyle:'none',marginBottom:'20px'}}>{plan.f.map((f,j)=><li key={j} style={{fontSize:'13px',color:'#8892a4',marginBottom:'6px'}}>✓ {f}</li>)}</ul>
            <Link href={`/register?plan=${plan.n.toLowerCase()}`} style={{display:'block',textAlign:'center',background:plan.hot?'linear-gradient(135deg,#ff3c5c,#ff6b35)':'transparent',border:plan.hot?'none':'1px solid #1e2840',color:plan.hot?'#fff':'#8892a4',padding:'10px',borderRadius:'8px',fontWeight:700}}>Assinar {plan.n}</Link>
          </div>))}
      </div>
    </section>
  </main></>)
}