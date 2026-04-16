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
    background: '#0C1222',
    border: '1px solid #192436',
    borderRadius: '9px',
    padding: '12px 14px',
    color: '#EDF1F8',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'border-color .15s',
    fontFamily: "'Inter',system-ui,sans-serif",
  }

  return (
    <>
      <Head><title>Entrar — NOCTURN.AI</title></Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#05080F',
        fontFamily: "'Inter',system-ui,sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient */}
        <div style={{position:'absolute',top:'-20%',left:'-15%',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(197,24,58,.05) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-20%',right:'-15%',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(124,58,237,.04) 0%,transparent 65%)',pointerEvents:'none'}}/>

        <div style={{width:'100%',maxWidth:'400px',position:'relative',zIndex:1}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',marginBottom:'32px'}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#C5183A,#8B0A22)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:'#fff',fontSize:'15px',letterSpacing:'-0.5px',boxShadow:'0 2px 10px rgba(197,24,58,.35)'}}>N</div>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'18px',fontWeight:700,color:'#EDF1F8',letterSpacing:'-0.03em'}}>NOCTURN.AI</span>
          </div>

          {/* Card */}
          <div style={{background:'#080D1A',border:'1px solid #192436',borderRadius:'16px',padding:'36px'}}>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'22px',fontWeight:700,letterSpacing:'-0.03em',color:'#EDF1F8',marginBottom:'6px',textAlign:'center'}}>
              Bem-vindo de volta
            </h1>
            <p style={{fontSize:'13px',color:'#6E8099',textAlign:'center',marginBottom:'28px',fontWeight:400}}>
              Entre na sua conta para continuar
            </p>

            {error && (
              <div style={{background:'rgba(197,24,58,.08)',border:'1px solid rgba(197,24,58,.2)',color:'#C5183A',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'18px',fontWeight:500}}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                  Email
                </label>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  onFocus={e => e.target.style.borderColor = '#C5183A'}
                  onBlur={e => e.target.style.borderColor = '#192436'}
                />
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#364A62',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                    Senha
                  </label>
                  <Link href="/forgot-password" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'#C5183A',letterSpacing:'0.04em'}}>
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
                  onFocus={e => e.target.style.borderColor = '#C5183A'}
                  onBlur={e => e.target.style.borderColor = '#192436'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#0C1222' : 'linear-gradient(135deg,#C5183A,#8B0A22)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
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
                {loading ? 'Entrando...' : 'Entrar na conta'}
              </button>
            </form>
          </div>

          <p style={{textAlign:'center',fontSize:'13px',color:'#364A62',marginTop:'20px',fontWeight:400}}>
            Não tem conta?{' '}
            <Link href="/register" style={{color:'#C5183A',fontWeight:600}}>Criar agora</Link>
          </p>
        </div>
      </div>
    </>
  )
}
