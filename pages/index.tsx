import Head from 'next/head'
import Link from 'next/link'

const PLANS = [
  { name:'Starter', price:47, url:'https://pay.cakto.com.br/8euvzxd', credits:20, color:'#059669', popular:false,
    features:['20 vídeos/mês (1 crédito = 1 vídeo)','YouTube + TikTok','Roteiro com GPT-4o','Voz IA PT-BR','B-roll dark Pexels','Garantia 7 dias'] },
  { name:'Pro', price:97, url:'https://pay.cakto.com.br/37beu86', credits:100, color:'#C5183A', popular:true,
    features:['100 vídeos/mês (1 crédito = 1 vídeo)','Todas as plataformas','Roteiro avançado GPT-4o','Voz personalizada PT-BR','B-roll premium Pexels','Suporte prioritário'] },
  { name:'Enterprise', price:297, url:'https://pay.cakto.com.br/izhvx9t', credits:999, color:'#7C3AED', popular:false,
    features:['Créditos ilimitados','Multi-usuário (5 seats)','API completa + webhooks','White-label','Gerente dedicado'] },
]

const NAV: React.CSSProperties = {
  position:'sticky', top:0, zIndex:100,
  background:'rgba(5,8,15,.85)',
  backdropFilter:'blur(16px)',
  WebkitBackdropFilter:'blur(16px)',
  borderBottom:'1px solid #192436',
}

export default function Home() {
  return (<>
    <Head>
      <title>NOCTURN.AI — Gere Dark Channels com IA no Automático</title>
      <meta name="description" content="Agente de IA para dark channels. Roteiro, voz e edição completa — sem câmera, sem rosto."/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>

    <div style={{background:'#05080F',color:'#EDF1F8',fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',overflowX:'hidden',position:'relative'}}>

      {/* Ambient lights */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',left:'-10%',width:'700px',height:'700px',background:'radial-gradient(circle,rgba(197,24,58,.055) 0%,transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-10%',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(124,58,237,.045) 0%,transparent 65%)'}}/>
      </div>

      {/* NAV */}
      <nav style={NAV}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 24px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'30px',height:'30px',background:'#C5183A',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'14px',letterSpacing:'-0.5px'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'16px',fontWeight:700,letterSpacing:'-0.02em'}}>NOCTURN.AI</span>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <Link href="/login" style={{color:'#6E8099',fontSize:'13px',fontWeight:500,padding:'7px 16px',borderRadius:'8px',border:'1px solid #192436',transition:'border-color .15s'}}>
              Entrar
            </Link>
            <Link href="/register" style={{background:'#C5183A',color:'#fff',fontSize:'13px',fontWeight:600,padding:'8px 20px',borderRadius:'8px',letterSpacing:'-0.01em'}}>
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',zIndex:1,textAlign:'center',padding:'88px 24px 0',maxWidth:'900px',margin:'0 auto'}}>

        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.2)',color:'#A78BFA',padding:'5px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:500,marginBottom:'28px',letterSpacing:'0.04em'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#7C3AED',flexShrink:0,boxShadow:'0 0 6px rgba(124,58,237,.8)'}}/>
          GPT-4o · OpenAI TTS · Pexels
        </div>

        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(38px,6.5vw,78px)',fontWeight:800,lineHeight:1.04,letterSpacing:'-0.04em',marginBottom:'22px',color:'#EDF1F8'}}>
          Gere dark channels<br/>
          <span style={{color:'#C5183A'}}>que faturam</span> no automático
        </h1>

        <p style={{fontSize:'clamp(15px,2vw,18px)',color:'#6E8099',marginBottom:'36px',lineHeight:1.65,maxWidth:'580px',margin:'0 auto 36px'}}>
          Seu agente de IA cria roteiro, sintetiza voz e monta o vídeo completo.<br/>
          <span style={{color:'#EDF1F8',fontWeight:500}}>Sem câmera. Sem rosto. Em menos de 3 minutos.</span>
        </p>

        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginBottom:'72px'}}>
          <Link href="/register" style={{background:'#C5183A',color:'#fff',padding:'14px 32px',borderRadius:'9px',fontWeight:600,fontSize:'15px',letterSpacing:'-0.01em',boxShadow:'0 4px 28px rgba(197,24,58,.3)'}}>
            Criar conta e gerar grátis →
          </Link>
          <Link href="#planos" style={{background:'transparent',color:'#6E8099',padding:'14px 28px',borderRadius:'9px',fontWeight:500,fontSize:'14px',border:'1px solid #192436'}}>
            Ver planos
          </Link>
        </div>

        {/* APP MOCKUP */}
        <div style={{maxWidth:'800px',margin:'0 auto',position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'7px',background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.18)',color:'#059669',fontSize:'11px',fontWeight:500,padding:'4px 12px',borderRadius:'20px',marginBottom:'14px',letterSpacing:'0.02em'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#059669',animation:'pulse 2s infinite'}}/>
            247 vídeos gerados hoje
          </div>

          <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'16px',overflow:'hidden',boxShadow:'0 32px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.03)'}}>
            {/* Window bar */}
            <div style={{background:'#05080F',borderBottom:'1px solid #192436',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#1F2F4A'}}/>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#1F2F4A'}}/>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#1F2F4A'}}/>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'24px',height:'24px',background:'#C5183A',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'10px'}}>N</div>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'12px',fontWeight:600,color:'#EDF1F8'}}>NOCTURN.AI</span>
              </div>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62'}}>dashboard</span>
            </div>

            <div style={{display:'flex',height:'240px'}}>
              {/* Sidebar */}
              <div style={{width:'140px',background:'#07091400',borderRight:'1px solid #192436',padding:'10px 8px',flexShrink:0,display:'flex',flexDirection:'column',gap:'2px'}}>
                {[
                  {label:'Gerar Vídeo',active:true},
                  {label:'Biblioteca',active:false},
                  {label:'Rewards',active:false},
                  {label:'Assinatura',active:false},
                ].map((item,i)=>(
                  <div key={i} style={{padding:'7px 10px',borderRadius:'7px',fontSize:'10px',fontWeight:item.active?600:400,color:item.active?'#EDF1F8':'#364A62',background:item.active?'rgba(197,24,58,.08)':'transparent',borderLeft:item.active?'2px solid #C5183A':'2px solid transparent'}}>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div style={{flex:1,padding:'14px',overflow:'hidden',display:'flex',flexDirection:'column',gap:'10px'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
                  {[{l:'Vídeos',v:'247',c:'#C5183A'},{l:'Créditos',v:'73',c:'#EDF1F8'},{l:'Views',v:'2.4M',c:'#059669'}].map((st,i)=>(
                    <div key={i} style={{background:'#0C1222',border:'1px solid #192436',borderRadius:'8px',padding:'8px 10px'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'#364A62',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'3px'}}>{st.l}</div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'18px',fontWeight:700,color:st.c,letterSpacing:'-0.02em'}}>{st.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{background:'#0C1222',border:'1px solid #192436',borderRadius:'10px',padding:'10px',flex:1}}>
                  <div style={{fontSize:'10px',fontWeight:600,color:'#EDF1F8',marginBottom:'7px',fontFamily:"'Space Grotesk',sans-serif"}}>Agente Gerador de Vídeo</div>
                  <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'6px',padding:'6px 8px',fontSize:'9px',color:'#364A62',marginBottom:'7px',fontFamily:"'JetBrains Mono',monospace"}}>Documentário sobre sociedades secretas...</div>
                  <div style={{display:'flex',gap:'4px',marginBottom:'8px'}}>
                    {['YouTube','TikTok','Reels'].map(p=>(
                      <span key={p} style={{background:'rgba(197,24,58,.1)',color:'#C5183A',fontSize:'8px',fontWeight:600,padding:'2px 7px',borderRadius:'10px',fontFamily:"'JetBrains Mono',monospace"}}>{p}</span>
                    ))}
                  </div>
                  <div style={{height:'3px',background:'#192436',borderRadius:'2px',overflow:'hidden',marginBottom:'4px'}}>
                    <div style={{height:'100%',width:'67%',background:'#C5183A',borderRadius:'2px'}}/>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'#059669',letterSpacing:'0.02em'}}>Gerando roteiro... 67%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{position:'relative',zIndex:1,padding:'72px 24px 0'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {[
            {stat:'2.4M+', label:'Views geradas'},
            {stat:'247', label:'Vídeos hoje'},
            {stat:'< 3min', label:'Por vídeo'},
            {stat:'7 dias', label:'Garantia'},
          ].map((p,i)=>(
            <div key={i} style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'12px',padding:'24px',textAlign:'center'}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'30px',fontWeight:800,color:'#C5183A',letterSpacing:'-0.04em',marginBottom:'5px'}}>{p.stat}</div>
              <div style={{fontSize:'12px',color:'#6E8099',fontWeight:500}}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{position:'relative',zIndex:1,padding:'96px 24px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{marginBottom:'52px'}}>
            <div style={{display:'inline-block',background:'rgba(197,24,58,.08)',border:'1px solid rgba(197,24,58,.18)',color:'#C5183A',padding:'4px 12px',borderRadius:'20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Como funciona</div>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(26px,4vw,44px)',fontWeight:800,letterSpacing:'-0.035em',lineHeight:1.15}}>
              De prompt a vídeo publicado<br/>em menos de 3 minutos
            </h2>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:'16px'}}>
            {[
              {n:'01',title:'Você digita o tema',desc:'Qualquer tema sombrio: conspiração, mistério, true crime, terror, crypto...'},
              {n:'02',title:'IA gera o roteiro',desc:'GPT-4o cria roteiro completo otimizado para engajamento em dark channels.'},
              {n:'03',title:'Narração automática',desc:'OpenAI TTS sintetiza voz grave e misteriosa em PT-BR automaticamente.'},
              {n:'04',title:'Vídeo pronto',desc:'B-roll dark, legendas e efeitos. Pronto para publicar em segundos.'},
            ].map((step,i)=>(
              <div key={i} style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'14px',padding:'26px',position:'relative',overflow:'hidden'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'48px',fontWeight:800,color:'rgba(197,24,58,.07)',position:'absolute',top:'12px',right:'16px',lineHeight:1,letterSpacing:'-0.04em'}}>{step.n}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#C5183A',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'12px'}}>Passo {step.n}</div>
                <h3 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'16px',fontWeight:700,marginBottom:'8px',letterSpacing:'-0.02em'}}>{step.title}</h3>
                <p style={{fontSize:'13px',color:'#6E8099',lineHeight:1.65,fontWeight:400}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" style={{position:'relative',zIndex:1,padding:'0 24px 96px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{marginBottom:'52px'}}>
            <div style={{display:'inline-block',background:'rgba(197,24,58,.08)',border:'1px solid rgba(197,24,58,.18)',color:'#C5183A',padding:'4px 12px',borderRadius:'20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Planos</div>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(26px,4vw,44px)',fontWeight:800,letterSpacing:'-0.035em',lineHeight:1.15,marginBottom:'10px'}}>
              1 crédito = 1 vídeo completo
            </h2>
            <p style={{color:'#6E8099',fontSize:'15px',fontWeight:400}}>Roteiro + voz + edição. Créditos renovam mensalmente. Sem fidelidade.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:'16px'}}>
            {PLANS.map((plan,i)=>(
              <div key={i} style={{
                background:'#080D1A',
                border:`1px solid ${plan.popular?'rgba(197,24,58,.35)':'#192436'}`,
                borderRadius:'16px',
                padding:'28px',
                position:'relative',
                display:'flex',
                flexDirection:'column',
                boxShadow: plan.popular?'0 0 0 1px rgba(197,24,58,.1),0 24px 48px rgba(0,0,0,.3)':'none',
              }}>
                {plan.popular && (
                  <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#C5183A',color:'#fff',fontSize:'10px',fontWeight:600,padding:'3px 14px',borderRadius:'20px',whiteSpace:'nowrap',letterSpacing:'0.04em'}}>
                    Mais popular
                  </div>
                )}

                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px',color:plan.color}}>{plan.name}</div>

                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'38px',fontWeight:800,letterSpacing:'-0.04em',marginBottom:'4px',lineHeight:1}}>
                  R${plan.price}
                  <span style={{fontSize:'14px',fontWeight:500,color:'#6E8099',letterSpacing:'0'}}>/mês</span>
                </div>

                <div style={{background:'#0C1222',border:'1px solid #192436',borderRadius:'9px',padding:'12px 14px',textAlign:'center',margin:'18px 0'}}>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'26px',fontWeight:800,color:plan.color,letterSpacing:'-0.03em'}}>{plan.credits===999?'∞':plan.credits}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#6E8099',marginTop:'2px'}}>créditos / mês</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',marginTop:'3px'}}>{plan.credits===999?'ilimitados':`= ${plan.credits} vídeos`}</div>
                </div>

                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'9px',marginBottom:'22px',flex:1}}>
                  {plan.features.map((f,j)=>(
                    <li key={j} style={{fontSize:'13px',color:'#6E8099',display:'flex',alignItems:'flex-start',gap:'8px',fontWeight:400}}>
                      <span style={{color:plan.color,flexShrink:0,marginTop:'1px',fontSize:'11px'}}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.url} style={{
                  display:'block',textAlign:'center',padding:'12px',borderRadius:'9px',fontWeight:600,fontSize:'14px',letterSpacing:'-0.01em',
                  background:plan.popular?'#C5183A':'transparent',
                  border:plan.popular?'none':`1px solid ${plan.color}`,
                  color:plan.popular?'#fff':plan.color,
                  marginBottom:'10px',
                }}>
                  Assinar {plan.name} →
                </Link>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',textAlign:'center'}}>7 dias grátis · Cancele quando quiser</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{position:'relative',zIndex:1,padding:'0 24px 96px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto',background:'linear-gradient(160deg,rgba(197,24,58,.06),rgba(124,58,237,.04))',border:'1px solid rgba(197,24,58,.18)',borderRadius:'20px',padding:'64px 40px'}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(26px,4vw,42px)',fontWeight:800,letterSpacing:'-0.035em',marginBottom:'14px',lineHeight:1.12}}>
            Comece a gerar dark channels<br/>
            <span style={{color:'#C5183A'}}>que faturam hoje</span>
          </h2>
          <p style={{color:'#6E8099',marginBottom:'30px',fontSize:'15px',fontWeight:400}}>Crie sua conta grátis. Sem cartão. Cancele quando quiser.</p>
          <Link href="/register" style={{background:'#C5183A',color:'#fff',padding:'14px 36px',borderRadius:'9px',fontWeight:600,fontSize:'15px',letterSpacing:'-0.01em',display:'inline-block',boxShadow:'0 4px 28px rgba(197,24,58,.3)'}}>
            Criar conta e começar agora →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #192436',padding:'40px 24px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'26px',height:'26px',background:'#C5183A',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'12px'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'-0.02em'}}>NOCTURN.AI</span>
          </div>
          <p style={{color:'#364A62',fontSize:'12px',fontFamily:"'JetBrains Mono',monospace"}}>© 2025 NOCTURN.AI · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  </>)
}
