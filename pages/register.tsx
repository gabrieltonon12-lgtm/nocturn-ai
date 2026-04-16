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
    background: '#0C1222',
    border: '1px solid #192436',
    borderRadius: '9px',
    padding: '12px 14px',
    color: '#EDF1F8',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter',system-ui,sans-serif",
    transition: 'border-color .15s',
  }

  return (
    <>
      <Head><title>Criar Conta — NOCTURN.AI</title></Head>

      <div style={{
        minHeight: '100vh',
        background: '#05080F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Inter',system-ui,sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient */}
        <div style={{position:'absolute',top:'-20%',left:'-15%',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(197,24,58,.05) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-20%',right:'-15%',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(124,58,237,.04) 0%,transparent 65%)',pointerEvents:'none'}}/>

        <div style={{width:'100%',maxWidth:'440px',position:'relative',zIndex:1}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',marginBottom:'32px'}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#C5183A,#8B0A22)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'15px',letterSpacing:'-0.5px',boxShadow:'0 2px 10px rgba(197,24,58,.35)'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'18px',fontWeight:700,color:'#EDF1F8',letterSpacing:'-0.03em'}}>NOCTURN.AI</span>
          </div>

          {/* Card */}
          <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'16px',padding:'36px'}}>

            {/* Stepper */}
            <div style={{display:'flex',alignItems:'center',gap:'0',marginBottom:'28px'}}>
              {['Criar conta','Dashboard','Gerar vídeo'].map((step,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',flex:1}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',minWidth:'70px'}}>
                    <div style={{
                      width:'26px',height:'26px',borderRadius:'50%',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:'11px',fontWeight:600,flexShrink:0,
                      background:i===0?'#C5183A':'#0C1222',
                      border:i===0?'none':'1px solid #192436',
                      color:i===0?'#fff':'#364A62',
                    }}>{i+1}</div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:i===0?'#C5183A':'#364A62',letterSpacing:'0.02em',whiteSpace:'nowrap'}}>{step}</span>
                  </div>
                  {i<2&&<div style={{flex:1,height:'1px',background:'#192436',margin:'0 4px',marginBottom:'16px'}}/>}
                </div>
              ))}
            </div>

            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'22px',fontWeight:700,letterSpacing:'-0.03em',color:'#EDF1F8',marginBottom:'6px',textAlign:'center'}}>
              Crie sua conta grátis
            </h1>
            <p style={{fontSize:'13px',color:'#6E8099',textAlign:'center',marginBottom:'22px',lineHeight:1.6,fontWeight:400}}>
              Em 2 minutos você gera seu primeiro vídeo dark channel.<br/>
              <span style={{color:'#EDF1F8',fontWeight:500}}>Sem câmera. Sem aparecer. Sem cartão.</span>
            </p>

            {plan && planNames[plan as string] && (
              <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.18)',color:'#10B981',padding:'8px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'18px',textAlign:'center',fontWeight:500,fontFamily:"'JetBrains Mono',monospace"}}>
                Plano selecionado: {planNames[plan as string]}
              </div>
            )}

            {error && (
              <div style={{background:'rgba(197,24,58,.08)',border:'1px solid rgba(197,24,58,.2)',color:'#C5183A',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'18px',fontWeight:500}}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {[
                {label:'Nome',type:'text',value:name,set:setName,placeholder:'Seu nome completo'},
                {label:'Email',type:'email',value:email,set:setEmail,placeholder:'seu@email.com'},
                {label:'Senha',type:'password',value:password,set:setPassword,placeholder:'Mínimo 6 caracteres'},
              ].map(f=>(
                <div key={f.label} style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                    {f.label}
                  </label>
                  <input
                    style={inputStyle}
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    required
                    placeholder={f.placeholder}
                    minLength={f.type==='password'?6:undefined}
                    onFocus={e => e.target.style.borderColor='#C5183A'}
                    onBlur={e => e.target.style.borderColor='#192436'}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#0C1222' : 'linear-gradient(135deg,#C5183A,#8B0A22)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  marginTop: '4px',
                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                  letterSpacing: '-0.02em',
                  transition: 'opacity .15s,box-shadow .15s',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(197,24,58,.25)',
                }}
              >
                {loading ? 'Criando conta...' : 'Criar conta e começar →'}
              </button>
            </form>

            <div style={{background:'rgba(16,185,129,.04)',border:'1px solid rgba(16,185,129,.12)',borderRadius:'8px',padding:'10px 14px',marginTop:'16px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.03em'}}>
              ✓ Sem cartão &nbsp;·&nbsp; ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Garantia 7 dias
            </div>
          </div>

          <p style={{textAlign:'center',fontSize:'13px',color:'#364A62',marginTop:'18px',fontWeight:400}}>
            Já tem conta?{' '}
            <Link href="/login" style={{color:'#C5183A',fontWeight:600}}>Entrar</Link>
          </p>
        </div>
      </div>
    </>
  )
}
