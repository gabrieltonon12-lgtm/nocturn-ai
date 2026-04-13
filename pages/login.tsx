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
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.role === 'admin') router.push('/admin')
      else router.push('/dashboard')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }
  const s: Record<string,React.CSSProperties> = {
    wrap:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#080b10'},
    card:{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'16px',padding:'40px',width:'100%',maxWidth:'420px'},
    logo:{display:'flex',alignItems:'center',gap:'10px',marginBottom:'28px',justifyContent:'center'},
    logoIcon:{width:'36px',height:'36px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800 as any,color:'#fff',fontSize:'14px'},
    title:{fontSize:'22px',fontWeight:800 as any,marginBottom:'24px',textAlign:'center' as any,color:'#f0f2f8'},
    error:{background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.3)',color:'#ff3c5c',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'16px'},
    form:{display:'flex',flexDirection:'column' as any,gap:'16px'},
    field:{display:'flex',flexDirection:'column' as any,gap:'6px'},
    label:{fontSize:'11px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase' as any},
    input:{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'11px 13px',color:'#f0f2f8',fontSize:'14px',outline:'none'},
    btn:{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',padding:'13px',fontSize:'14px',fontWeight:700 as any,cursor:'pointer',marginTop:'4px'},
    link:{textAlign:'center' as any,fontSize:'13px',color:'#4a5568',marginTop:'20px'},
  }
  return (<><Head><title>Login — NOCTURN.AI</title></Head>
    <div style={s.wrap}><div style={s.card}>
      <div style={s.logo}><div style={s.logoIcon}>DC</div><div style={{fontSize:'18px',fontWeight:800,color:'#f0f2f8'}}>NOCTURN.AI</div></div>
      <h1 style={s.title}>Entrar na conta</h1>
      {error && <div style={s.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.field}><label style={s.label}>Email</label><input style={s.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com"/></div>
        <div style={s.field}><label style={s.label}>Senha</label><input style={s.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/></div>
        <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p style={s.link}>Não tem conta? <Link href="/register" style={{color:'#ff3c5c'}}>Criar agora</Link></p>
    </div></div></>)
}