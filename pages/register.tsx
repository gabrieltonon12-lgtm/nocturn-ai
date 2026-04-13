import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

declare global { interface Window { ttq: any } }

export default function Register() {
  const router = useRouter()
  const { plan } = router.query
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const planPrices: Record<string,number> = { starter: 47, pro: 97, enterprise: 297 }
  const planUrls: Record<string,string> = {
    starter: 'https://pay.cakto.com.br/8euvzxd',
    pro: 'https://pay.cakto.com.br/37beu86',
    enterprise: 'https://pay.cakto.com.br/izhvx9t',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: plan || 'starter' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar conta')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // TikTok: CompleteRegistration event
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.identify({ email })
        window.ttq.track('CompleteRegistration', {
          content_name: 'NOCTURN.AI Registration',
          currency: 'BRL',
          value: planPrices[plan as string || 'starter'] || 47,
        })
        window.ttq.track('InitiateCheckout', {
          content_name: 'NOCTURN.AI ' + (plan || 'starter'),
          currency: 'BRL',
          value: planPrices[plan as string || 'starter'] || 47,
        })
      }

      // Also fire server-side event
      await fetch('/api/tiktok/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'CompleteRegistration', email, value: planPrices[plan as string || 'starter'] || 47 })
      }).catch(() => {})

      const selectedPlan = (plan as string) || 'starter'
      if (planUrls[selectedPlan]) window.location.href = planUrls[selectedPlan]
      else router.push('/dashboard')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  const planNames: Record<string,string> = { starter:'Starter — R\$47/mês', pro:'Pro — R\$97/mês', enterprise:'Enterprise — R\$297/mês' }
  const s: Record<string,React.CSSProperties> = {
    wrap:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#080b10'},
    card:{background:'#0e1219',border:'1px solid #1e2840',borderRadius:'16px',padding:'40px',width:'100%',maxWidth:'420px'},
    logo:{display:'flex',alignItems:'center',gap:'10px',marginBottom:'28px',justifyContent:'center'},
    logoIcon:{width:'36px',height:'36px',background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'14px'},
    title:{fontSize:'22px',fontWeight:800,marginBottom:'16px',textAlign:'center',color:'#f0f2f8'},
    planBadge:{background:'rgba(0,208,132,.1)',border:'1px solid rgba(0,208,132,.2)',color:'#00d084',padding:'8px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'16px',textAlign:'center'},
    error:{background:'rgba(255,60,92,.1)',border:'1px solid rgba(255,60,92,.3)',color:'#ff3c5c',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'16px'},
    form:{display:'flex',flexDirection:'column',gap:'16px'},
    field:{display:'flex',flexDirection:'column',gap:'6px'},
    label:{fontSize:'11px',color:'#4a5568',letterSpacing:'1.5px',textTransform:'uppercase'},
    input:{background:'#141920',border:'1px solid #1e2840',borderRadius:'8px',padding:'11px 13px',color:'#f0f2f8',fontSize:'14px',outline:'none'},
    btn:{background:'linear-gradient(135deg,#ff3c5c,#ff6b35)',color:'#fff',border:'none',borderRadius:'8px',padding:'13px',fontSize:'14px',fontWeight:700,cursor:'pointer',marginTop:'4px'},
    link:{textAlign:'center',fontSize:'13px',color:'#4a5568',marginTop:'20px'},
  }
  return (<><Head><title>Criar Conta — NOCTURN.AI</title></Head>
    <div style={s.wrap}><div style={s.card}>
      <div style={s.logo}><div style={s.logoIcon}>DC</div><div style={{fontSize:'18px',fontWeight:800,color:'#f0f2f8'}}>NOCTURN.AI</div></div>
      <h1 style={s.title}>Criar sua conta</h1>
      {plan && <div style={s.planBadge}>Plano: <strong>{planNames[plan as string]||plan}</strong></div>}
      {error && <div style={s.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.field}><label style={s.label}>Nome</label><input style={s.input} type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Seu nome"/></div>
        <div style={s.field}><label style={s.label}>Email</label><input style={s.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com"/></div>
        <div style={s.field}><label style={s.label}>Senha</label><input style={s.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Mínimo 8 caracteres" minLength={8}/></div>
        <button style={s.btn} type="submit" disabled={loading}>{loading?'Criando...':'Criar conta e assinar'}</button>
      </form>
      <p style={s.link}>Já tem conta? <Link href="/login" style={{color:'#ff3c5c'}}>Entrar</Link></p>
    </div></div></>)
}