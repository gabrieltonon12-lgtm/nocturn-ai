import Head from 'next/head'
import Link from 'next/link'

const PLANS = [
  { name:'Starter', price:47, url:'https://pay.cakto.com.br/8euvzxd', credits:20, color:'#00d084', popular:false,
    features:['20 créditos/mês','YouTube + TikTok','Roteiro GPT-4o','Voz IA PT-BR','B-roll dark','Garantia 7 dias'] },
  { name:'Pro', price:97, url:'https://pay.cakto.com.br/37beu86', credits:100, color:'#ff3c5c', popular:true,
    features:['100 créditos/mês','Todas as plataformas','Roteiro avançado','Voz personalizada','B-roll premium','Suporte prioritário','Garantia 7 dias'] },
  { name:'Enterprise', price:297, url:'https://pay.cakto.com.br/izhvx9t', credits:999, color:'#7c3aed', popular:false,
    features:['Créditos ilimitados','Multi-usuário (5 seats)','API completa','White-label','Webhooks','Gerente dedicado'] },
]

export default function Home() {
  return (<>
    <Head>
      <title>NOCTURN.AI — Gere Dark Channels com IA no Automático</title>
      <meta name="description" content="Seu agente de IA para dark channels. Cria, narra e edita vídeos para YouTube e TikTok no automático."/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    </Head>
    <div style={{background:'#080b10',color:'#f0f2f8',fontFamily:"'Syne',sans-serif",minHeight:'100vh',position:'relative',overflowX:'hidden'}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(255,60,92,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,60,92,.025) 1px,transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',top:'-200px',left:'-200px',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(255,60,92,.08) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',bottom:'-200px',right:'-200px',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(124,58,237,.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(8,11,16,.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(255,60,92,.1)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'13px'}}>DC</div>
            <span style={{fontSize:'16px',fontWeight:800}}>NOCTURN.AI</span>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/login" style={{color:'#8892a4',fontSize:'13px',fontWeight:600,padding:'8px 16px',borderRadius:'7px',border:'1px solid #1e2840',display:'inline-block'}}>Entrar</Link>
            <Link href="https://pay.cakto.com.br/37beu86" style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',fontSize:'13px',fontWeight:700,padding:'9px 20px',borderRadius:'8px',display:'inline-block'}}>Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <section style={{position:'relative',zIndex:1,textAlign:'center',padding:'80px 20px 0'}}>
        <div style={{display:'inline-block',background:'rgba(124,58,237,.15)',border:'1px solid rgba(124,58,237,.3)',color:'#a78bfa',padding:'6px 18px',borderRadius:'20px',fontSize:'12px',fontWeight:600,marginBottom:'24px',letterSpacing:'1px'}}>🤖 GPT-4o + ElevenLabs + Pexels</div>
        <h1 style={{fontSize:'clamp(36px,6vw,76px)',fontWeight:800,lineHeight:1.05,marginBottom:'22px'}}>Gere <span style={{color:'#ff3c5c'}}>dark channels</span><br/>que faturam no automático</h1>
        <p style={{fontSize:'18px',color:'#8892a4',marginBottom:'36px',lineHeight:1.7}}>Seu agente de IA cria roteiro, voz e edição completa.<br/><strong style={{color:'#f0f2f8'}}>Sem câmera. Sem rosto. Sem esforço.</strong> Em 3 minutos.</p>
        <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap',marginBottom:'60px'}}>
          <Link href="https://pay.cakto.com.br/37beu86" style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',padding:'16px 36px',borderRadius:'10px',fontWeight:700,fontSize:'16px',display:'inline-block',boxShadow:'0 8px 32px rgba(255,60,92,.3)'}}>Testar 7 dias grátis →</Link>
          <Link href="#planos" style={{background:'transparent',color:'#8892a4',padding:'16px 32px',borderRadius:'10px',fontWeight:600,fontSize:'15px',display:'inline-block',border:'1px solid #1e2840'}}>Ver planos</Link>
        </div>
        <div style={{maxWidth:'820px',margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'inline-block',background:'rgba(0,208,132,.1)',border:'1px solid rgba(0,208,132,.2)',color:'#00d084',fontSize:'11px',fontWeight:600,padding:'5px 14px',borderRadius:'12px',marginBottom:'12px',fontFamily:'monospace'}}>● Ao vivo — gerando agora</div>
          <div style={{background:'#0e1219',border:'1px solid rgba(255,60,92,.2)',borderRadius:'14px',overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,.6)'}}>
            <div style={{background:'#080b10',borderBottom:'1px solid #1e2840',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'24px',height:'24px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'10px'}}>DC</div><span style={{fontSize:'13px',fontWeight:700}}>NOCTURN.AI</span></div>
              <span style={{fontSize:'11px',color:'#8892a4',fontFamily:'monospace'}}>247 vídeos gerados hoje</span>
              <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ff3c5c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#fff'}}>G</div>
            </div>
            <div style={{display:'flex',height:'260px'}}>
              <div style={{width:'130px',background:'#080b10',borderRight:'1px solid #1e2840',padding:'8px',flexShrink:0}}>
                {['▶ Gerar Vídeo','◼ Biblioteca','◈ Assinatura'].map((item,i)=>(<div key={i} style={{padding:'7px 8px',borderRadius:'6px',fontSize:'10px',marginBottom:'2px',background:i===0?'rgba(255,60,92,.12)':'transparent',color:i===0?'#ff3c5c':'#8892a4',fontWeight:i===0?700:400}}>{item}</div>))}
              </div>
              <div style={{flex:1,padding:'12px',overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'10px'}}>
                  {[{l:'Vídeos',v:'247',c:'#ff3c5c'},{l:'Créditos',v:'73',c:'#f0f2f8'},{l:'Views',v:'2.4M',c:'#00d084'}].map((st,i)=>(<div key={i} style={{background:'rgba(255,60,92,.05)',border:'1px solid rgba(255,60,92,.1)',borderRadius:'7px',padding:'7px',textAlign:'center'}}><div style={{fontSize:'8px',color:'#4a5568',textTransform:'uppercase',letterSpacing:'1px'}}>{st.l}</div><div style={{fontSize:'16px',fontWeight:800,color:st.c}}>{st.v}</div></div>))}
                </div>
                <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'9px',marginBottom:'8px'}}>
                  <div style={{fontSize:'10px',fontWeight:700,marginBottom:'6px'}}><span style={{color:'#ff3c5c'}}>▶</span> Agente Gerador</div>
                  <div style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'4px',padding:'5px 7px',fontSize:'9px',color:'#8892a4',marginBottom:'5px'}}>Documentário sobre sociedades secretas...</div>
                  <div style={{display:'flex',gap:'4px',marginBottom:'6px'}}>{['YouTube','TikTok','Reels'].map(p=><span key={p} style={{background:'rgba(255,60,92,.1)',color:'#ff3c5c',fontSize:'8px',padding:'2px 6px',borderRadius:'8px',fontWeight:600}}>{p}</span>)}</div>
                  <div style={{height:'3px',background:'#1e2840',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:'67%',background:'linear-gradient(90deg,#ff3c5c,#ff6b35)',borderRadius:'2px'}}/></div>
                  <div style={{fontSize:'8px',color:'#00d084',fontFamily:'monospace',marginTop:'3px'}}>SCRIPT Gerando roteiro... 67%</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'}}>
                  {['Illuminati Revelado','Área 51 — Doc'].map((title,i)=>(<div key={i} style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'6px',overflow:'hidden'}}><div style={{height:'40px',background:'linear-gradient(135deg,#08080f,#150820)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,60,92,.8)',fontSize:'12px'}}>▶</div><div style={{padding:'4px 6px'}}><div style={{fontSize:'8px',fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div><div style={{fontSize:'7px',color:'#00d084',fontFamily:'monospace'}}>● Pronto</div></div></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{position:'relative',zIndex:1,padding:'80px 20px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.2)',color:'#ff3c5c',padding:'5px 14px',borderRadius:'14px',fontSize:'11px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'16px',fontFamily:'monospace'}}>Como funciona</div>
          <h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:800,marginBottom:'48px',lineHeight:1.2}}>De prompt a vídeo publicado<br/>em menos de 3 minutos</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'20px'}}>
            {[{n:'01',icon:'📝',title:'Você digita o tema',desc:'Qualquer tema sombrio: conspiração, mistério, true crime, terror, crypto...'},{n:'02',icon:'🤖',title:'IA gera o roteiro',desc:'GPT-4o cria roteiro completo otimizado para engajamento em dark channels.'},{n:'03',icon:'🎙️',title:'Narração automática',desc:'ElevenLabs sintetiza voz grave e misteriosa em PT-BR automaticamente.'},{n:'04',icon:'🎬',title:'Vídeo pronto',desc:'B-roll dark, legendas e efeitos. Pronto para publicar em segundos.'}].map((step,i)=>(<div key={i} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'14px',padding:'24px',position:'relative'}}><div style={{position:'absolute',top:'16px',right:'16px',fontSize:'32px',fontWeight:800,color:'rgba(255,60,92,.08)',fontFamily:'monospace'}}>{step.n}</div><div style={{fontSize:'32px',marginBottom:'12px'}}>{step.icon}</div><h3 style={{fontSize:'16px',fontWeight:700,marginBottom:'8px'}}>{step.title}</h3><p style={{fontSize:'13px',color:'#8892a4',lineHeight:1.6}}>{step.desc}</p></div>))}
          </div>
        </div>
      </section>

      <section id="planos" style={{position:'relative',zIndex:1,padding:'80px 20px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.2)',color:'#ff3c5c',padding:'5px 14px',borderRadius:'14px',fontSize:'11px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'16px',fontFamily:'monospace'}}>Planos & Preços</div>
          <h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:800,marginBottom:'12px',lineHeight:1.2}}>1 crédito = 1 vídeo completo<br/>(roteiro + voz + edição)</h2>
          <p style={{color:'#8892a4',fontSize:'15px',marginBottom:'48px'}}>Créditos renovam automaticamente todo mês. Sem adesão. Cancele quando quiser.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px'}}>
            {PLANS.map((plan,i)=>(<div key={i} style={{background:'#0e1219',border:`1px solid ${plan.popular?'rgba(255,60,92,.4)':'#1e2840'}`,borderRadius:'16px',padding:'28px',position:'relative',display:'flex',flexDirection:'column'}}>
              {plan.popular && <div style={{position:'absolute',top:'-13px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',fontSize:'10px',fontWeight:700,padding:'4px 14px',borderRadius:'10px',whiteSpace:'nowrap'}}>★ Mais Popular</div>}
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',fontFamily:'monospace',marginBottom:'8px',color:plan.color}}>{plan.name}</div>
              <div style={{fontSize:'38px',fontWeight:800,marginBottom:'14px',lineHeight:1}}>R${plan.price}<span style={{fontSize:'15px',fontWeight:400,color:'#8892a4'}}>/mês</span></div>
              <div style={{background:'#141920',border:'1px solid #1e2840',borderRadius:'10px',padding:'14px',textAlign:'center',marginBottom:'18px'}}>
                <div style={{fontSize:'28px',fontWeight:800,color:plan.color}}>{plan.credits===999?'∞':plan.credits}</div>
                <div style={{fontSize:'12px',color:'#8892a4',marginTop:'2px'}}>créditos por mês</div>
                <div style={{fontSize:'11px',color:'#4a5568',marginTop:'4px',fontFamily:'monospace'}}>{plan.credits===999?'vídeos ilimitados':`= ${plan.credits} vídeos/mês`}</div>
              </div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'8px',marginBottom:'22px',flex:1}}>
                {plan.features.map((f,j)=>(<li key={j} style={{fontSize:'13px',color:'#8892a4',display:'flex',alignItems:'flex-start',gap:'8px'}}><span style={{color:plan.color,flexShrink:0}}>✓</span>{f}</li>))}
              </ul>
              <Link href={plan.url} style={{display:'block',textAlign:'center',padding:'13px',borderRadius:'9px',fontWeight:700,fontSize:'14px',background:plan.popular?'linear-gradient(135deg,#ff3c5c,#ff6b35)':'transparent',border:plan.popular?'none':`1px solid ${plan.color}`,color:plan.popular?'#fff':plan.color,marginBottom:'10px'}}>Assinar {plan.name} →</Link>
              <div style={{fontSize:'11px',color:'#4a5568',textAlign:'center',fontFamily:'monospace'}}>✓ 7 dias grátis · Cancele quando quiser</div>
            </div>))}
          </div>
        </div>
      </section>

      <section style={{position:'relative',zIndex:1,padding:'60px 20px'}}><div style={{maxWidth:'1100px',margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>{[{stat:'2.4M+',label:'Views geradas'},{stat:'247',label:'Vídeos hoje'},{stat:'< 3min',label:'Por vídeo'},{stat:'7 dias',label:'Teste grátis'}].map((p,i)=>(<div key={i} style={{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'12px',padding:'24px',textAlign:'center'}}><div style={{fontSize:'36px',fontWeight:800,color:'#ff3c5c',marginBottom:'6px'}}>{p.stat}</div><div style={{fontSize:'13px',color:'#8892a4'}}>{p.label}</div></div>))}</div></div></section>

      <section style={{position:'relative',zIndex:1,padding:'80px 20px',textAlign:'center'}}><div style={{maxWidth:'800px',margin:'0 auto',background:'linear-gradient(135deg,rgba(255,60,92,.08),rgba(124,58,237,.06))',border:'1px solid rgba(255,60,92,.2)',borderRadius:'20px',padding:'60px 40px'}}><h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:800,marginBottom:'16px'}}>Comece a gerar dark channels<br/><span style={{color:'#ff3c5c'}}>que faturam hoje</span></h2><p style={{color:'#8892a4',marginBottom:'28px',fontSize:'16px'}}>7 dias grátis. Sem cartão. Cancele quando quiser.</p><Link href="https://pay.cakto.com.br/37beu86" style={{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',padding:'16px 36px',borderRadius:'10px',fontWeight:700,fontSize:'16px',display:'inline-block',boxShadow:'0 8px 32px rgba(255,60,92,.3)'}}>Começar agora — 7 dias grátis →</Link></div></section>
      <footer style={{textAlign:'center',padding:'40px',borderTop:'1px solid #1e2840',position:'relative',zIndex:1}}><div style={{fontSize:'16px',fontWeight:800,marginBottom:'8px'}}>NOCTURN.AI</div><p style={{color:'#4a5568',fontSize:'12px'}}>© 2025 NOCTURN.AI · Todos os direitos reservados</p></footer>
    </div>
  </>)
}