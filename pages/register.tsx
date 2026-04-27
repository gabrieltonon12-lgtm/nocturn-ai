import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

declare global { interface Window { fbq: any; ttq: any } }

const D = {
  bg:      '#090C14',
  card:    '#141828',
  raised:  '#1B2035',
  line:    'rgba(255,255,255,.07)',
  lineHi:  'rgba(255,255,255,.13)',
  acc:     '#7A5CFC',
  accHov:  '#6748EE',
  accDim:  'rgba(122,92,252,.12)',
  accGlow: 'rgba(122,92,252,.30)',
  green:   '#34D399',
  gDim:    'rgba(52,211,153,.10)',
  amber:   '#FBBF24',
  t1:      '#ECEEF8',
  t2:      '#7A8099',
  t3:      '#363D55',
}

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

  const steps = ['Criar conta', 'Dashboard', 'Gerar vídeo']

  return (
    <>
      <Head><title>Criar Conta — NOCTURN.AI</title></Head>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        .inp {
          background:${D.raised};border:1px solid ${D.line};border-radius:10px;
          padding:12px 16px;color:${D.t1};font-size:15px;outline:none;
          width:100%;box-sizing:border-box;transition:border-color .18s,box-shadow .18s;
          font-family:'Figtree',system-ui,sans-serif;
        }
        .inp::placeholder{color:${D.t3};}
        .inp:focus{border-color:${D.acc}!important;box-shadow:0 0 0 3px rgba(122,92,252,.18)!important;}
        .btn-acc{
          background:${D.acc};color:#fff;border:none;border-radius:10px;
          padding:14px;font-size:15px;font-weight:700;cursor:pointer;width:100%;
          font-family:'Syne',system-ui,sans-serif;letter-spacing:-.02em;
          transition:background .15s,box-shadow .15s,transform .15s;
          box-shadow:0 4px 20px rgba(122,92,252,.35);
        }
        .btn-acc:hover:not(:disabled){background:${D.accHov};box-shadow:0 6px 28px rgba(122,92,252,.50);transform:translateY(-1px);}
        .btn-acc:active:not(:disabled){transform:scale(.98);}
        .btn-acc:disabled{opacity:.55;cursor:not-allowed;}
        .link-acc{color:${D.acc};font-weight:600;transition:color .15s;}
        .link-acc:hover{color:#A78BFA;}
        @media(max-width:767px){.right-col{display:none!important}}
      `}</style>

      <div style={{
        minHeight:'100vh',display:'flex',background:D.bg,
        fontFamily:"'Figtree',system-ui,sans-serif",
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',
          justifyContent:'center',padding:'48px 32px',
          maxWidth:'520px',margin:'0 auto',
          animation:'fadeUp .4s ease both',
        }}>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'40px',alignSelf:'flex-start'}}>
            <div style={{
              width:'38px',height:'38px',
              background:'linear-gradient(135deg,#7A5CFC,#5B21B6)',
              borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:"'Syne',sans-serif",fontWeight:800,color:'#fff',fontSize:'17px',
              boxShadow:'0 4px 18px rgba(122,92,252,.45)',letterSpacing:'-0.5px',flexShrink:0,
            }}>N</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:700,color:D.t1,letterSpacing:'-0.04em'}}>NOCTURN.AI</span>
          </div>

          {/* Progress stepper */}
          <div style={{display:'flex',alignItems:'center',width:'100%',marginBottom:'32px'}}>
            {steps.map((step,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',flex:i<steps.length-1?1:'auto'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px',minWidth:'80px'}}>
                  <div style={{
                    width:'28px',height:'28px',borderRadius:'50%',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'11px',fontWeight:700,flexShrink:0,
                    background: i===0 ? D.acc : D.raised,
                    border: i===0 ? 'none' : `1px solid ${D.line}`,
                    color: i===0 ? '#fff' : D.t3,
                    boxShadow: i===0 ? '0 0 12px rgba(122,92,252,.4)' : 'none',
                  }}>{i+1}</div>
                  <span style={{fontSize:'10px',color:i===0?D.acc:D.t3,whiteSpace:'nowrap',fontWeight:i===0?600:400,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.03em'}}>{step}</span>
                </div>
                {i<steps.length-1 && <div style={{flex:1,height:'1px',background:D.line,margin:'0 8px',marginBottom:'16px'}}/>}
              </div>
            ))}
          </div>

          {/* Heading */}
          <div style={{alignSelf:'flex-start',marginBottom:'28px'}}>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'28px',fontWeight:800,letterSpacing:'-0.045em',color:D.t1,marginBottom:'10px',lineHeight:1.1}}>
              Crie sua conta grátis
            </h1>
            <p style={{fontSize:'14px',color:D.t2,lineHeight:1.65,fontWeight:400}}>
              Em 2 minutos você gera seu primeiro vídeo faceless.{' '}
              <span style={{color:D.t1,fontWeight:600}}>Sem câmera. Sem aparecer.</span>
            </p>
          </div>

          {/* Plan badge */}
          {plan && planNames[plan as string] && (
            <div style={{
              width:'100%',background:D.gDim,border:'1px solid rgba(52,211,153,.25)',
              color:D.green,padding:'10px 16px',borderRadius:'10px',fontSize:'13px',
              marginBottom:'20px',fontWeight:600,fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:'0.03em',
            }}>
              ✓ Plano selecionado: {planNames[plan as string]}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{width:'100%',background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.3)',color:'#F87171',padding:'12px 16px',borderRadius:'10px',fontSize:'14px',marginBottom:'20px',fontWeight:500}}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px',width:'100%'}}>
            {[
              {label:'Nome completo', type:'text',     value:name,     set:setName,     placeholder:'Seu nome'},
              {label:'Email',         type:'email',    value:email,    set:setEmail,    placeholder:'seu@email.com'},
              {label:'Senha',         type:'password', value:password, set:setPassword, placeholder:'Mínimo 6 caracteres'},
            ].map(f => (
              <div key={f.label} style={{display:'flex',flexDirection:'column',gap:'7px'}}>
                <label style={{fontSize:'11px',fontWeight:600,color:D.t3,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>{f.label}</label>
                <input
                  className="inp"
                  type={f.type}
                  value={f.value}
                  onChange={e=>f.set(e.target.value)}
                  required
                  placeholder={f.placeholder}
                  minLength={f.type==='password' ? 6 : undefined}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-acc" style={{marginTop:'6px'}}>
              {loading ? 'Criando conta...' : 'Criar conta e começar →'}
            </button>
          </form>

          {/* Trust badges */}
          <div style={{
            width:'100%',background:D.raised,border:`1px solid ${D.line}`,
            borderRadius:'10px',padding:'11px 16px',marginTop:'16px',
            textAlign:'center',fontFamily:"'JetBrains Mono',monospace",
            fontSize:'10px',color:D.t3,letterSpacing:'0.04em',
          }}>
            ✓ Sem cartão &nbsp;·&nbsp; ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Garantia 7 dias
          </div>

          <p style={{textAlign:'center',fontSize:'14px',color:D.t2,marginTop:'20px'}}>
            Já tem conta?{' '}
            <Link href="/login" className="link-acc">Entrar</Link>
          </p>

        </div>

        {/* ── RIGHT: Cinematic panel ── */}
        <div className="right-col" style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          padding:'60px 48px',position:'relative',overflow:'hidden',
          background:'linear-gradient(145deg,#0D0A20 0%,#090E1A 45%,#07090F 100%)',
        }}>
          {/* Ambient orbs */}
          <div style={{position:'absolute',top:'10%',left:'15%',width:'460px',height:'460px',borderRadius:'50%',background:'radial-gradient(circle,rgba(122,92,252,.17) 0%,transparent 68%)',animation:'float1 9s ease-in-out infinite',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'10%',right:'5%',width:'380px',height:'380px',borderRadius:'50%',background:'radial-gradient(circle,rgba(90,55,210,.11) 0%,transparent 65%)',animation:'float2 11s ease-in-out infinite',pointerEvents:'none'}}/>
          {/* Dot grid */}
          <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,.055) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}}/>
          {/* Vignette */}
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 35%,rgba(4,6,12,.65) 100%)',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:'380px'}}>
            {/* Badge */}
            <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(122,92,252,.14)',border:'1px solid rgba(122,92,252,.28)',borderRadius:'20px',padding:'6px 16px',marginBottom:'28px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#7A5CFC',boxShadow:'0 0 8px rgba(122,92,252,.8)',display:'inline-block',animation:'pulse 2s ease infinite'}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#A78BFA',fontWeight:600,letterSpacing:'0.09em'}}>3 minutos para o primeiro vídeo</span>
            </div>

            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'32px',fontWeight:800,color:'#ECEEF8',letterSpacing:'-0.045em',marginBottom:'16px',lineHeight:1.1}}>
              Você está a 3 min<br/>do seu primeiro vídeo viral
            </h2>
            <p style={{fontSize:'15px',color:'rgba(236,238,248,.55)',lineHeight:1.8,marginBottom:'38px'}}>
              Nossa IA escreve o roteiro, narra com voz realista e monta o vídeo completo. Você só escolhe o tema.
            </p>

            {/* Steps */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px',textAlign:'left'}}>
              {[
                {n:'01', t:'Escolha um tema',    s:'True crime, mistério, finanças ou religioso'},
                {n:'02', t:'A IA gera tudo',     s:'Roteiro GPT-4o + Voz IA + Vídeo Runway ML'},
                {n:'03', t:'Publique e monetize',s:'YouTube, TikTok, Instagram e Shorts'},
              ].map((s,i) => (
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'16px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'16px 18px',backdropFilter:'blur(4px)'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',fontWeight:600,color:'rgba(122,92,252,.6)',flexShrink:0,letterSpacing:'0.04em',marginTop:'2px'}}>{s.n}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:'14px',fontWeight:700,color:'#ECEEF8',marginBottom:'3px'}}>{s.t}</div>
                    <div style={{fontSize:'12px',color:'rgba(236,238,248,.45)',lineHeight:1.55}}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{display:'flex',gap:'12px',marginTop:'28px',justifyContent:'center'}}>
              {[
                {v:'12k+',  l:'Inscritos gerados'},
                {v:'3 min', l:'Por vídeo'},
                {v:'R$0',   l:'Para começar'},
              ].map((s,i) => (
                <div key={i} style={{flex:1,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'12px 8px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:800,color:'#ECEEF8',letterSpacing:'-0.04em',lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:'10px',color:'rgba(236,238,248,.4)',marginTop:'4px',lineHeight:1.4,fontFamily:"'JetBrains Mono',monospace"}}>{s.l}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
