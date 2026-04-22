import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.role === 'admin') router.push('/admin')
      else router.push('/dashboard')
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
    transition: 'border-color .15s, box-shadow .15s',
    fontFamily: "'Inter',system-ui,sans-serif",
    fontWeight: 400,
  }

  return (
    <>
      <Head><title>Entrar — NOCTURN.AI</title></Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#FAFAFA',
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>
        {/* Left panel — form */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'40px',alignSelf:'flex-start'}}>
            <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#6E56CF,#4C3899)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'14px',boxShadow:'0 2px 8px rgba(110,86,207,.3)'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'17px',fontWeight:700,color:'#09090B',letterSpacing:'-0.03em'}}>NOCTURN.AI</span>
          </div>

          {/* Heading */}
          <div style={{alignSelf:'flex-start',marginBottom:'32px'}}>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'26px',fontWeight:600,letterSpacing:'-0.03em',color:'#09090B',marginBottom:'8px',lineHeight:1.2}}>
              Bem-vindo de volta
            </h1>
            <p style={{fontSize:'15px',color:'#52525B',lineHeight:1.6,fontWeight:400}}>
              Entre na sua conta para continuar criando.
            </p>
          </div>

          {error && (
            <div style={{width:'100%',background:'#FEE2E2',border:'1px solid rgba(220,38,38,.25)',color:'#DC2626',padding:'12px 16px',borderRadius:'8px',fontSize:'14px',marginBottom:'20px',fontWeight:500}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'18px',width:'100%'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <label style={{fontSize:'13px',fontWeight:500,color:'#09090B'}}>Email</label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                onFocus={e => { e.target.style.borderColor='#6E56CF'; e.target.style.boxShadow='0 0 0 3px rgba(110,86,207,.12)' }}
                onBlur={e => { e.target.style.borderColor='#E4E4E7'; e.target.style.boxShadow='none' }}
              />
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label style={{fontSize:'13px',fontWeight:500,color:'#09090B'}}>Senha</label>
                <Link href="/forgot-password" style={{fontSize:'13px',color:'#6E56CF',fontWeight:500,transition:'color .15s'}}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#4C3899'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='#6E56CF'}>
                  Esqueci minha senha
                </Link>
              </div>
              <input
                style={inputStyle}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                onFocus={e => { e.target.style.borderColor='#6E56CF'; e.target.style.boxShadow='0 0 0 3px rgba(110,86,207,.12)' }}
                onBlur={e => { e.target.style.borderColor='#E4E4E7'; e.target.style.boxShadow='none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#EBEBEC' : '#6E56CF',
                color: loading ? '#A1A1AA' : '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
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
              {loading ? 'Entrando...' : 'Entrar na conta'}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:'14px',color:'#52525B',marginTop:'24px',fontWeight:400}}>
            Não tem conta?{' '}
            <Link href="/register" style={{color:'#6E56CF',fontWeight:600}}>Criar agora</Link>
          </p>

          {/* Social proof */}
          <div style={{marginTop:'40px',width:'100%',background:'#FFFFFF',border:'1px solid #E4E4E7',borderRadius:'12px',padding:'18px 20px',boxShadow:'0 1px 2px rgba(0,0,0,.05)'}}>
            <div style={{display:'flex',gap:'3px',marginBottom:'10px'}}>
              {[...Array(5)].map((_,i)=><span key={i} style={{color:'#CA8A04',fontSize:'13px'}}>★</span>)}
            </div>
            <p style={{fontSize:'13px',color:'#52525B',lineHeight:1.7,marginBottom:'12px',fontStyle:'italic'}}>
              "Criei 3 canais em 6 semanas sem aparecer em nenhum. O canal maior já tem 12 mil inscritos e já monetizou."
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#6E56CF,#4C3899)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:'#fff',fontSize:'13px',flexShrink:0}}>R</div>
              <div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'13px',fontWeight:600,color:'#09090B',letterSpacing:'-0.01em'}}>Rafael M.</div>
                <div style={{fontSize:'11px',color:'#A1A1AA'}}>Canal True Crime · 12k inscritos</div>
              </div>
              <div style={{marginLeft:'auto',fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',padding:'3px 10px',borderRadius:'20px',background:'#DCFCE7',color:'#16A34A',fontWeight:600}}>
                Verificado ✓
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — decorative (hidden on mobile) */}
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
          {/* Decorative circles */}
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'400px',height:'400px',borderRadius:'50%',background:'rgba(255,255,255,.06)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'300px',height:'300px',borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:'360px'}}>
            <div style={{fontSize:'52px',marginBottom:'24px',lineHeight:1}}>🎬</div>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'28px',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.03em',marginBottom:'16px',lineHeight:1.2}}>
              Crie vídeos virais com IA
            </h2>
            <p style={{fontSize:'15px',color:'rgba(255,255,255,.75)',lineHeight:1.7,marginBottom:'32px'}}>
              Roteiro, voz e vídeo gerados automaticamente em menos de 3 minutos. Sem aparecer, sem câmera.
            </p>

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
              {[
                {val:'10k+',label:'Criadores'},
                {val:'3min',label:'Por vídeo'},
                {val:'100%',label:'Faceless'},
              ].map(s=>(
                <div key={s.val} style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'12px',padding:'16px 12px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'22px',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.03em'}}>{s.val}</div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,.6)',marginTop:'4px'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:767px) { .hide-sm { display:none !important; } }
      `}</style>
    </>
  )
}
