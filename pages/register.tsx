import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

declare global { interface Window { fbq: any; ttq: any } }

export default function Register() {
  const router = useRouter()
  const { plan, ref } = router.query
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const planNames: Record<string,string> = {
    starter: 'Starter — R$47/mês',
    pro: 'Pro — R$97/mês',
    enterprise: 'Enterprise — R$297/mês'
  }
  const planValues: Record<string,number> = { starter:47, pro:97, enterprise:297 }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: plan || 'starter', ref: ref || undefined })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar conta')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'NOCTURN.AI', currency: 'BRL',
          value: planValues[plan as string || 'starter'] || 47, status: true,
        })
      }
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.identify({ email })
        window.ttq.track('CompleteRegistration', {
          content_name: 'NOCTURN.AI Registration', currency: 'BRL',
          value: planValues[plan as string || 'starter'] || 47,
        })
      }
      await fetch('/api/tiktok/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'CompleteRegistration', email, value: planValues[plan as string || 'starter'] || 47 })
      }).catch(() => {})

      router.push('/dashboard?onboarding=1')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#09090B',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter',system-ui,sans-serif",
    transition: 'border-color .15s, box-shadow .15s',
    fontWeight: 400,
  }

  return (
    <>
      <Head><title>Criar Conta — NOCTURN.AI</title></Head>

      <div style={{
        minHeight: '100vh',
        background: '#FAFAFA',
        display: 'flex',
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>
        {/* Left — form */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          maxWidth: '520px',
          margin: '0 auto',
        }}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'36px',alignSelf:'flex-start'}}>
            <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#6E56CF,#4C3899)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'14px',boxShadow:'0 2px 8px rgba(110,86,207,.3)'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'17px',fontWeight:700,color:'#09090B',letterSpacing:'-0.03em'}}>NOCTURN.AI</span>
          </div>

          {/* Stepper */}
          <div style={{display:'flex',alignItems:'center',width:'100%',marginBottom:'28px'}}>
            {['Criar conta','Dashboard','Gerar vídeo'].map((step,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',flex:i<2?1:'auto'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',minWidth:'80px'}}>
                  <div style={{
                    width:'26px',height:'26px',borderRadius:'50%',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'11px',fontWeight:600,flexShrink:0,
                    background: i===0 ? '#6E56CF' : '#F4F4F5',
                    border: i===0 ? 'none' : '1px solid #E4E4E7',
                    color: i===0 ? '#fff' : '#A1A1AA',
                  }}>{i+1}</div>
                  <span style={{fontSize:'10px',color:i===0?'#6E56CF':'#A1A1AA',whiteSpace:'nowrap',fontWeight:i===0?500:400}}>{step}</span>
                </div>
                {i<2 && <div style={{flex:1,height:'1px',background:'#E4E4E7',margin:'0 8px',marginBottom:'16px'}}/>}
              </div>
            ))}
          </div>

          {/* Heading */}
          <div style={{alignSelf:'flex-start',marginBottom:'28px'}}>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'26px',fontWeight:600,letterSpacing:'-0.03em',color:'#09090B',marginBottom:'8px',lineHeight:1.2}}>
              Crie sua conta grátis
            </h1>
            <p style={{fontSize:'14px',color:'#52525B',lineHeight:1.6,fontWeight:400}}>
              Em 2 minutos você gera seu primeiro vídeo faceless.{' '}
              <span style={{color:'#09090B',fontWeight:500}}>Sem câmera. Sem aparecer.</span>
            </p>
          </div>

          {plan && planNames[plan as string] && (
            <div style={{width:'100%',background:'#DCFCE7',border:'1px solid rgba(22,163,74,.25)',color:'#16A34A',padding:'10px 16px',borderRadius:'8px',fontSize:'13px',marginBottom:'20px',fontWeight:500,fontFamily:"'JetBrains Mono',monospace"}}>
              ✓ Plano selecionado: {planNames[plan as string]}
            </div>
          )}

          {error && (
            <div style={{width:'100%',background:'#FEE2E2',border:'1px solid rgba(220,38,38,.25)',color:'#DC2626',padding:'12px 16px',borderRadius:'8px',fontSize:'14px',marginBottom:'20px',fontWeight:500}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px',width:'100%'}}>
            {[
              {label:'Nome completo',type:'text',value:name,set:setName,placeholder:'Seu nome'},
              {label:'Email',type:'email',value:email,set:setEmail,placeholder:'seu@email.com'},
              {label:'Senha',type:'password',value:password,set:setPassword,placeholder:'Mínimo 6 caracteres'},
            ].map(f=>(
              <div key={f.label} style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <label style={{fontSize:'13px',fontWeight:500,color:'#09090B'}}>{f.label}</label>
                <input
                  style={inputStyle}
                  type={f.type}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  required
                  placeholder={f.placeholder}
                  minLength={f.type==='password' ? 6 : undefined}
                  onFocus={e => { e.target.style.borderColor='#6E56CF'; e.target.style.boxShadow='0 0 0 3px rgba(110,86,207,.12)' }}
                  onBlur={e => { e.target.style.borderColor='#E4E4E7'; e.target.style.boxShadow='none' }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#EBEBEC' : '#6E56CF',
                color: loading ? '#A1A1AA' : '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                letterSpacing: '-0.01em',
                transition: 'background .15s, box-shadow .15s, transform .15s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(110,86,207,.3)',
              }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background='#5746AF'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background='#6E56CF'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' } }}
            >
              {loading ? 'Criando conta...' : 'Criar conta e começar →'}
            </button>
          </form>

          {/* Trust badges */}
          <div style={{width:'100%',background:'#F4F4F5',border:'1px solid #E4E4E7',borderRadius:'8px',padding:'10px 16px',marginTop:'16px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#52525B',letterSpacing:'0.03em'}}>
            ✓ Sem cartão &nbsp;·&nbsp; ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Garantia 7 dias
          </div>

          {/* Divider */}
          <div style={{display:'flex',alignItems:'center',gap:'12px',width:'100%',marginTop:'4px'}}>
            <div style={{flex:1,height:'1px',background:'#E4E4E7'}}/>
            <span style={{fontSize:'12px',color:'#A1A1AA',fontWeight:500}}>ou continue com</span>
            <div style={{flex:1,height:'1px',background:'#E4E4E7'}}/>
          </div>

          {/* Google OAuth */}
          <a
            href="/api/auth/google"
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
              width:'100%', padding:'11px', borderRadius:'8px', marginTop:'12px',
              background:'#FFFFFF', border:'1px solid #E4E4E7', cursor:'pointer',
              fontSize:'14px', fontWeight:500, color:'#09090B', textDecoration:'none',
              transition:'border-color .15s, box-shadow .15s',
              boxShadow:'0 1px 2px rgba(0,0,0,.05)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#6E56CF'; (e.currentTarget as HTMLElement).style.boxShadow='0 0 0 3px rgba(110,86,207,.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#E4E4E7'; (e.currentTarget as HTMLElement).style.boxShadow='0 1px 2px rgba(0,0,0,.05)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Cadastrar com Google
          </a>

          <p style={{textAlign:'center',fontSize:'14px',color:'#52525B',marginTop:'16px',fontWeight:400}}>
            Já tem conta?{' '}
            <Link href="/login" style={{color:'#6E56CF',fontWeight:600}}>Entrar</Link>
          </p>
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg,#6E56CF 0%,#4C3899 60%,#3730A3 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 48px',
          position: 'relative',
          overflow: 'hidden',
        }} className="hide-sm">
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'400px',height:'400px',borderRadius:'50%',background:'rgba(255,255,255,.06)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'300px',height:'300px',borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:'360px'}}>
            <div style={{fontSize:'52px',marginBottom:'24px',lineHeight:1}}>🚀</div>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'26px',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.03em',marginBottom:'16px',lineHeight:1.2}}>
              Você está a 3 minutos do seu primeiro vídeo viral
            </h2>
            <p style={{fontSize:'14px',color:'rgba(255,255,255,.75)',lineHeight:1.7,marginBottom:'32px'}}>
              Nossa IA escreve o roteiro, narra com voz realista e monta o vídeo completo. Só você precisa escolher o tema.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                { n:'1', t:'Escolha um tema', s:'True crime, mistério, finanças ou religioso' },
                { n:'2', t:'A IA gera tudo', s:'Roteiro GPT-4o + Voz IA + Vídeo Runway' },
                { n:'3', t:'Publique e monetize', s:'YouTube, TikTok, Instagram e Shorts' },
              ].map(s=>(
                <div key={s.n} style={{display:'flex',alignItems:'flex-start',gap:'14px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'10px',padding:'14px 16px',textAlign:'left'}}>
                  <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#fff',flexShrink:0,fontFamily:"'Space Grotesk',sans-serif"}}>{s.n}</div>
                  <div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'13px',fontWeight:600,color:'#fff',marginBottom:'2px'}}>{s.t}</div>
                    <div style={{fontSize:'12px',color:'rgba(255,255,255,.65)',lineHeight:1.5}}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:767px) { .hide-sm { display:none !important; } }
      `}</style>
    </>
  )
}
