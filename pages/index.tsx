import Head from 'next/head'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Starter', price: 47, credits: 20,
    url: 'https://pay.cakto.com.br/8euvzxd',
    color: '#059669', popular: false,
    perVideo: '2,35',
    features: ['20 vídeos / mês', 'YouTube + TikTok + Shorts', 'Roteiro GPT-4o', 'Voz IA PT-BR', 'Garantia 7 dias'],
  },
  {
    name: 'Pro', price: 97, credits: 100,
    url: 'https://pay.cakto.com.br/37beu86',
    color: '#C5183A', popular: true,
    perVideo: '0,97',
    features: ['100 vídeos / mês', 'Todas as plataformas', 'Roteiro avançado', 'Voz personalizada', 'Suporte prioritário'],
  },
  {
    name: 'Enterprise', price: 297, credits: 99999,
    url: 'https://pay.cakto.com.br/izhvx9t',
    color: '#7C3AED', popular: false,
    perVideo: '—',
    features: ['Vídeos ilimitados', 'Multi-usuário', 'API + webhooks', 'White-label', 'Gerente dedicado'],
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>NOCTURN.AI — Dark Channels com IA em 3 Minutos</title>
        <meta name="description" content="Você digita o tema. A IA faz o resto: roteiro, voz e vídeo pronto para publicar. Sem câmera. Sem aparecer."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        .cta-main { transition: box-shadow .18s, transform .18s !important; }
        .cta-main:hover { box-shadow: 0 8px 40px rgba(197,24,58,.45) !important; transform: translateY(-1px) !important; }
        .cta-ghost:hover { border-color: #364A62 !important; color: #ECF2FA !important; }
        .plan-card { transition: border-color .18s, transform .18s !important; }
        .plan-card:hover { transform: translateY(-3px) !important; }
        .step-num { font-feature-settings: 'tnum'; }
      `}</style>

      <div style={{background:'#02040A',color:'#ECF2FA',fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',overflowX:'hidden'}}>

        {/* ── GLOW AMBIENTAL ── */}
        <div aria-hidden style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-20%',left:'-5%',width:'800px',height:'800px',background:'radial-gradient(circle,rgba(197,24,58,.06) 0%,transparent 60%)'}}/>
          <div style={{position:'absolute',bottom:'-15%',right:'-5%',width:'700px',height:'700px',background:'radial-gradient(circle,rgba(124,58,237,.05) 0%,transparent 60%)'}}/>
        </div>

        {/* ── NAV ── */}
        <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(2,4,10,.9)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'1px solid #192436'}}>
          <div style={{maxWidth:'1080px',margin:'0 auto',padding:'0 24px',height:'58px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',background:'linear-gradient(135deg,#C5183A,#8B0A22)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'13px',boxShadow:'0 2px 10px rgba(197,24,58,.35)'}}>N</div>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'15px',fontWeight:700,letterSpacing:'-0.03em',color:'#ECF2FA'}}>NOCTURN.AI</span>
            </div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <Link href="/login" className="cta-ghost" style={{color:'#6E8099',fontSize:'13px',fontWeight:500,padding:'6px 14px',borderRadius:'8px',border:'1px solid #192436',transition:'all .15s'}}>
                Entrar
              </Link>
              <Link href="/register" className="cta-main" style={{background:'linear-gradient(135deg,#C5183A,#8B0A22)',color:'#fff',fontSize:'13px',fontWeight:700,padding:'7px 18px',borderRadius:'8px',letterSpacing:'-0.01em',fontFamily:"'Space Grotesk',sans-serif",boxShadow:'0 4px 18px rgba(197,24,58,.3)'}}>
                Começar agora
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{position:'relative',zIndex:1,textAlign:'center',padding:'100px 24px 80px',maxWidth:'780px',margin:'0 auto'}}>

          {/* Social proof pill */}
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.18)',color:'#059669',padding:'5px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:500,marginBottom:'32px',letterSpacing:'0.03em',fontFamily:"'JetBrains Mono',monospace"}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#059669',flexShrink:0,boxShadow:'0 0 8px rgba(5,150,105,.7)',animation:'pulse 2s infinite'}}/>
            +847 criadores ativos · 2.4M views geradas
          </div>

          {/* Headline — máximo impacto, mínimo texto */}
          <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(40px,7vw,80px)',fontWeight:800,lineHeight:1.02,letterSpacing:'-0.045em',marginBottom:'20px',color:'#ECF2FA'}}>
            Você digita.<br/>
            <span style={{color:'#C5183A'}}>A IA publica.</span>
          </h1>

          <p style={{fontSize:'clamp(15px,2vw,19px)',color:'#6E8099',lineHeight:1.6,marginBottom:'40px',maxWidth:'520px',margin:'0 auto 40px'}}>
            Roteiro, voz e vídeo pronto em <strong style={{color:'#ECF2FA',fontWeight:600}}>menos de 3 minutos</strong>.<br/>Sem câmera. Sem aparecer. Dark channel no automático.
          </p>

          {/* CTA único e forte */}
          <Link href="/register" className="cta-main" style={{
            display:'inline-block',
            background:'linear-gradient(135deg,#C5183A,#8B0A22)',
            color:'#fff',
            padding:'16px 40px',
            borderRadius:'12px',
            fontWeight:700,
            fontSize:'16px',
            letterSpacing:'-0.02em',
            fontFamily:"'Space Grotesk',sans-serif",
            boxShadow:'0 6px 32px rgba(197,24,58,.35)',
            marginBottom:'16px',
          }}>
            Gerar meu primeiro vídeo →
          </Link>

          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#364A62',marginTop:'12px',letterSpacing:'0.02em'}}>
            Sem cartão de crédito · Cancele quando quiser
          </div>
        </section>

        {/* ── MOCKUP DO APP ── */}
        <section style={{position:'relative',zIndex:1,padding:'0 24px 96px',maxWidth:'860px',margin:'0 auto'}}>
          <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'18px',overflow:'hidden',boxShadow:'0 40px 100px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.03)'}}>

            {/* Barra do app */}
            <div style={{background:'#05080F',borderBottom:'1px solid #192436',padding:'12px 18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',gap:'6px'}}>
                {['#2A1A1A','#2A2518','#152018'].map((c,i)=><div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background:c}}/>)}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'20px',height:'20px',background:'linear-gradient(135deg,#C5183A,#8B0A22)',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'9px'}}>N</div>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'12px',fontWeight:600,color:'#ECF2FA',letterSpacing:'-0.02em'}}>NOCTURN.AI</span>
              </div>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.04em'}}>dashboard</span>
            </div>

            <div style={{display:'flex',minHeight:'260px'}}>
              {/* Sidebar */}
              <div style={{width:'150px',borderRight:'1px solid #192436',padding:'12px 10px',flexShrink:0,display:'flex',flexDirection:'column',gap:'2px',background:'rgba(8,13,26,.5)'}}>
                {[
                  {label:'Gerar Vídeo', active:true},
                  {label:'Biblioteca', active:false},
                  {label:'Rewards', active:false},
                  {label:'Assinatura', active:false},
                ].map((item,i)=>(
                  <div key={i} style={{padding:'7px 10px',borderRadius:'7px',fontSize:'10px',fontWeight:item.active?600:400,color:item.active?'#ECF2FA':'#364A62',background:item.active?'rgba(197,24,58,.09)':'transparent',borderLeft:`2px solid ${item.active?'#C5183A':'transparent'}`}}>
                    {item.label}
                  </div>
                ))}
                <div style={{marginTop:'auto',padding:'10px 8px',borderTop:'1px solid #192436'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'linear-gradient(135deg,#7C3AED,#C5183A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',fontWeight:700,color:'#fff',flexShrink:0}}>J</div>
                    <div>
                      <div style={{fontSize:'9px',color:'#ECF2FA',fontWeight:600,lineHeight:1.2}}>João Silva</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'7px',color:'#C5183A',letterSpacing:'0.06em'}}>PRO</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div style={{flex:1,padding:'16px',display:'flex',flexDirection:'column',gap:'10px',overflow:'hidden'}}>
                {/* Stats */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
                  {[
                    {label:'Vídeos', value:'247', color:'#C5183A'},
                    {label:'Créditos', value:'73', color:'#ECF2FA'},
                    {label:'Views', value:'2.4M', color:'#059669'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:'#0C1222',border:'1px solid #192436',borderRadius:'8px',padding:'9px 10px'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'7px',color:'#364A62',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'4px'}}>{s.label}</div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'20px',fontWeight:800,color:s.color,letterSpacing:'-0.03em',lineHeight:1}}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Generator card */}
                <div style={{background:'#0C1222',border:'1px solid #192436',borderRadius:'10px',padding:'12px',flex:1,display:'flex',flexDirection:'column',gap:'8px'}}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'#ECF2FA',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-0.01em'}}>Agente de Vídeo</div>

                  <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'7px',padding:'8px 10px',fontSize:'9px',color:'#6E8099',fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5}}>
                    "Documentário sobre as sociedades secretas que controlam..."
                  </div>

                  <div style={{display:'flex',gap:'4px'}}>
                    {['YouTube','TikTok','Reels'].map(p=>(
                      <span key={p} style={{background:'rgba(197,24,58,.1)',color:'#C5183A',fontSize:'8px',fontWeight:600,padding:'2px 8px',borderRadius:'9px',fontFamily:"'JetBrains Mono',monospace",border:'1px solid rgba(197,24,58,.2)'}}>{p}</span>
                    ))}
                  </div>

                  <div style={{marginTop:'auto'}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'#364A62',marginBottom:'4px'}}>
                      <span>VOICE  Sintetizando narração...</span>
                      <span style={{color:'#D97706'}}>67%</span>
                    </div>
                    <div style={{height:'3px',background:'#192436',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:'67%',background:'linear-gradient(90deg,#C5183A,#E05070)',borderRadius:'2px'}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NÚMEROS QUE CONVENCEM ── */}
        <section style={{position:'relative',zIndex:1,padding:'0 24px 96px'}}>
          <div style={{maxWidth:'900px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'2px',borderRadius:'16px',overflow:'hidden',border:'1px solid #192436'}}>
            {[
              {value:'< 3 min', label:'do prompt ao vídeo', sub:'roteiro + voz + edição'},
              {value:'2.4M+', label:'views geradas', sub:'pelos nossos criadores'},
              {value:'R$ 0,97', label:'por vídeo no plano Pro', sub:'o mais barato do mercado'},
            ].map((s,i)=>(
              <div key={i} style={{background:'#080D1A',padding:'32px 24px',textAlign:'center',borderRight:i<2?'1px solid #192436':'none'}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(26px,3.5vw,40px)',fontWeight:800,color:'#ECF2FA',letterSpacing:'-0.04em',lineHeight:1,marginBottom:'8px'}}>{s.value}</div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#C5183A',marginBottom:'4px'}}>{s.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'#364A62',letterSpacing:'0.04em'}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA — 3 PASSOS ── */}
        <section style={{position:'relative',zIndex:1,padding:'0 24px 96px'}}>
          <div style={{maxWidth:'960px',margin:'0 auto'}}>

            <div style={{textAlign:'center',marginBottom:'56px'}}>
              <div style={{display:'inline-block',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#C5183A',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'14px',fontWeight:500}}>Como funciona</div>
              <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(28px,4vw,46px)',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.1,color:'#ECF2FA'}}>
                Três passos.<br/>Um vídeo publicado.
              </h2>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:'0',alignItems:'start'}}>
              {[
                {n:'01', icon:'✍️', title:'Você digita o tema', desc:'Conspiração, true crime, mistério, crypto — qualquer nicho dark.'},
                {n:'02', icon:'⚡', title:'IA trabalha por você', desc:'GPT-4o escreve o roteiro. OpenAI TTS gera a voz. Pexels busca as imagens.'},
                {n:'03', icon:'🎬', title:'Vídeo pronto pra publicar', desc:'Player com legenda, áudio e download em WebM. Pronto.'},
              ].map((step, i) => (
                <>
                  <div key={step.n} style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'16px',padding:'28px 24px',position:'relative',overflow:'hidden'}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'56px',fontWeight:800,color:'rgba(197,24,58,.06)',position:'absolute',bottom:'-8px',right:'12px',lineHeight:1,letterSpacing:'-0.04em',pointerEvents:'none'}}>{step.n}</div>
                    <div style={{fontSize:'28px',marginBottom:'14px',lineHeight:1}}>{step.icon}</div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'15px',fontWeight:700,letterSpacing:'-0.025em',color:'#ECF2FA',marginBottom:'8px'}}>{step.title}</div>
                    <div style={{fontSize:'12px',color:'#6E8099',lineHeight:1.65}}>{step.desc}</div>
                  </div>
                  {i < 2 && (
                    <div key={`arrow-${i}`} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'0 8px',paddingTop:'28px'}}>
                      <div style={{color:'#364A62',fontSize:'18px',fontWeight:300}}>→</div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="planos" style={{position:'relative',zIndex:1,padding:'0 24px 96px'}}>
          <div style={{maxWidth:'960px',margin:'0 auto'}}>

            <div style={{textAlign:'center',marginBottom:'48px'}}>
              <div style={{display:'inline-block',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#C5183A',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'14px',fontWeight:500}}>Planos</div>
              <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(28px,4vw,46px)',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.1,color:'#ECF2FA',marginBottom:'12px'}}>
                1 crédito = 1 vídeo completo
              </h2>
              <p style={{fontSize:'14px',color:'#6E8099',fontWeight:400}}>Roteiro + voz + edição. Renova todo mês. Sem fidelidade.</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'16px'}}>
              {PLANS.map((plan, i) => (
                <div key={i} className="plan-card" style={{
                  background:'#080D1A',
                  border:`1px solid ${plan.popular ? 'rgba(197,24,58,.4)' : '#192436'}`,
                  borderRadius:'18px',
                  padding:'28px',
                  position:'relative',
                  display:'flex',
                  flexDirection:'column',
                  boxShadow: plan.popular ? '0 0 60px rgba(197,24,58,.08),0 0 0 1px rgba(197,24,58,.1)' : 'none',
                }}>
                  {plan.popular && (
                    <div style={{position:'absolute',top:'-13px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#C5183A,#8B0A22)',color:'#fff',fontSize:'9px',fontWeight:700,padding:'4px 16px',borderRadius:'20px',whiteSpace:'nowrap',letterSpacing:'0.08em',boxShadow:'0 4px 14px rgba(197,24,58,.4)'}}>
                      MAIS POPULAR
                    </div>
                  )}

                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:plan.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'14px',fontWeight:600}}>{plan.name}</div>

                  <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'6px'}}>
                    <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'42px',fontWeight:800,letterSpacing:'-0.05em',lineHeight:1,color:'#ECF2FA'}}>R${plan.price}</span>
                    <span style={{fontSize:'13px',color:'#364A62',fontWeight:400}}>/mês</span>
                  </div>

                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#6E8099',marginBottom:'20px'}}>
                    {plan.credits === 99999 ? 'vídeos ilimitados' : `R$${plan.perVideo} por vídeo`}
                  </div>

                  <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px',flex:1}}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{fontSize:'13px',color:'#6E8099',display:'flex',alignItems:'center',gap:'10px'}}>
                        <span style={{color:plan.color,fontSize:'10px',fontWeight:700,flexShrink:0}}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.url} style={{
                    display:'block',textAlign:'center',
                    padding:'12px',borderRadius:'10px',
                    fontWeight:700,fontSize:'14px',
                    fontFamily:"'Space Grotesk',sans-serif",
                    letterSpacing:'-0.02em',
                    background: plan.popular ? 'linear-gradient(135deg,#C5183A,#8B0A22)' : 'transparent',
                    border: plan.popular ? 'none' : `1px solid ${plan.color}`,
                    color: plan.popular ? '#fff' : plan.color,
                    boxShadow: plan.popular ? '0 4px 20px rgba(197,24,58,.3)' : 'none',
                    marginBottom:'10px',
                    transition:'opacity .15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >
                    {plan.popular ? 'Assinar Pro →' : `Assinar ${plan.name} →`}
                  </Link>

                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'#364A62',textAlign:'center',letterSpacing:'0.03em'}}>
                    7 dias garantia · cancele quando quiser
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{position:'relative',zIndex:1,padding:'0 24px 112px',textAlign:'center'}}>
          <div style={{maxWidth:'620px',margin:'0 auto'}}>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(30px,5vw,52px)',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.08,marginBottom:'24px',color:'#ECF2FA'}}>
              Seu canal começa<br/><span style={{color:'#C5183A'}}>agora.</span>
            </h2>
            <Link href="/register" className="cta-main" style={{
              display:'inline-block',
              background:'linear-gradient(135deg,#C5183A,#8B0A22)',
              color:'#fff',
              padding:'16px 48px',
              borderRadius:'12px',
              fontWeight:700,
              fontSize:'16px',
              letterSpacing:'-0.02em',
              fontFamily:"'Space Grotesk',sans-serif",
              boxShadow:'0 6px 40px rgba(197,24,58,.35)',
              marginBottom:'16px',
            }}>
              Criar conta grátis →
            </Link>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#364A62',marginTop:'12px',letterSpacing:'0.02em'}}>
              Sem cartão · Sem câmera · Sem aparecer
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:'1px solid #192436',padding:'32px 24px',position:'relative',zIndex:1}}>
          <div style={{maxWidth:'960px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'24px',height:'24px',background:'linear-gradient(135deg,#C5183A,#8B0A22)',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'11px'}}>N</div>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'13px',fontWeight:700,letterSpacing:'-0.025em',color:'#ECF2FA'}}>NOCTURN.AI</span>
            </div>
            <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
              <Link href="/login" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.04em',transition:'color .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#6E8099'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='#364A62'}>
                Entrar
              </Link>
              <Link href="/register" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.04em',transition:'color .15s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#6E8099'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='#364A62'}>
                Criar conta
              </Link>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.02em'}}>© 2025 NOCTURN.AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
