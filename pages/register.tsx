import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

declare global { interface Window { fbq: any; ttq: any } }

export default function Register() {
  const router = useRouter()
  const { plan } = router.query
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const planNames: Record<string,string> = {
    starter: 'Starter — R\$47/mês',
    pro: 'Pro — R\$97/mês',
    enterprise: 'Enterprise — R\$297/mês'
  }
  const planValues: Record<string,number> = { starter: 47, pro: 97, enterprise: 297 }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
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

      // Facebook Pixel — CompleteRegistration
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'NOCTURN.AI',
          currency: 'BRL',
          value: planValues[plan as string || 'starter'] || 47,
          status: true,
        })
      }

      // TikTok Pixel — CompleteRegistration
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.identify({ email })
        window.ttq.track('CompleteRegistration', {
          content_name: 'NOCTURN.AI Registration',
          currency: 'BRL',
          value: planValues[plan as string || 'starter'] || 47,
        })
      }

      // Server-side events
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

  return (
    <>
      <Head>
        <title>Criar Conta — NOCTURN.AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#080b10', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Syne', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ background: '#0e1219', border: '1px solid #1e2840', borderRadius: '16px', padding: '40px', marginBottom: '16px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', justifyContent: 'center' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#ff3c5c,#ff6b35)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '14px' }}>DC</div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#f0f2f8' }}>NOCTURN.AI</span>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff3c5c,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>1</div>
              <div style={{ flex: 1, height: '1px', background: '#1e2840' }} />
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#141920', border: '1px solid #1e2840', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4a5568', flexShrink: 0 }}>2</div>
              <div style={{ flex: 1, height: '1px', background: '#1e2840' }} />
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#141920', border: '1px solid #1e2840', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4a5568', flexShrink: 0 }}>3</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '10px', fontFamily: 'monospace' }}>
              <span style={{ color: '#ff3c5c', fontWeight: 700 }}>Criar conta</span>
              <span style={{ color: '#4a5568' }}>Dashboard</span>
              <span style={{ color: '#4a5568' }}>Gerar vídeo</span>
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', textAlign: 'center', color: '#f0f2f8' }}>Crie sua conta grátis</h1>
            <p style={{ fontSize: '13px', color: '#8892a4', textAlign: 'center', marginBottom: '22px', lineHeight: 1.6 }}>
              Em 2 minutos você gera seu primeiro vídeo dark channel.<br />
              <strong style={{ color: '#f0f2f8' }}>Sem câmera. Sem aparecer. Sem cartão.</strong>
            </p>

            {plan && planNames[plan as string] && (
              <div style={{ background: 'rgba(0,208,132,.08)', border: '1px solid rgba(0,208,132,.2)', color: '#00d084', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '18px', textAlign: 'center', fontWeight: 600 }}>
                Plano selecionado: {planNames[plan as string]}
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(255,60,92,.08)', border: '1px solid rgba(255,60,92,.2)', color: '#ff3c5c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Nome</label>
                <input style={{ background: '#141920', border: '1px solid #1e2840', borderRadius: '8px', padding: '12px 14px', color: '#f0f2f8', fontSize: '14px', outline: 'none' }}
                  type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome completo" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Email</label>
                <input style={{ background: '#141920', border: '1px solid #1e2840', borderRadius: '8px', padding: '12px 14px', color: '#f0f2f8', fontSize: '14px', outline: 'none' }}
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Senha</label>
                <input style={{ background: '#141920', border: '1px solid #1e2840', borderRadius: '8px', padding: '12px 14px', color: '#f0f2f8', fontSize: '14px', outline: 'none' }}
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" minLength={6} />
              </div>
              <button type="submit" disabled={loading}
                style={{ background: 'linear-gradient(135deg,#ff3c5c,#ff6b35)', color: '#fff', border: 'none', borderRadius: '9px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '4px' }}>
                {loading ? 'Criando conta...' : 'Criar conta e começar →'}
              </button>
            </form>

            <div style={{ background: 'rgba(0,208,132,.05)', border: '1px solid rgba(0,208,132,.1)', borderRadius: '8px', padding: '12px', marginTop: '14px', textAlign: 'center', fontSize: '11px', color: '#8892a4', lineHeight: 1.8 }}>
              ✓ Sem cartão · ✓ Cancele quando quiser · ✓ Garantia 7 dias
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#ff3c5c', textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
          </p>
        </div>
      </div>
    </>
  )
}