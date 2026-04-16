import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Obrigado() {
  const router = useRouter()
  const { plano } = router.query
  const [count, setCount] = useState(5)

  useEffect(() => {
    const iv = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(iv); router.push('/dashboard'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [router])

  const planNames: Record<string, string> = {
    starter: 'Starter — 20 vídeos/mês',
    pro: 'Pro — 100 vídeos/mês',
    enterprise: 'Enterprise — Ilimitado',
  }
  const planCredits: Record<string, number> = { starter: 20, pro: 100, enterprise: 99999 }
  const plan = (plano as string) || 'starter'

  return (
    <>
      <Head>
        <title>Pagamento confirmado — NOCTURN.AI</title>
      </Head>
      <div style={{ minHeight: '100vh', background: '#05080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter',system-ui,sans-serif", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(5,150,105,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(197,24,58,.04) 0%,transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#fff', fontSize: '15px' }}>N</div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#EDF1F8', letterSpacing: '-0.03em' }}>NOCTURN.AI</span>
          </div>

          {/* Card */}
          <div style={{ background: '#080D1A', border: '1px solid rgba(5,150,105,.3)', borderRadius: '20px', padding: '40px 36px', boxShadow: '0 0 60px rgba(5,150,105,.08),0 32px 80px rgba(0,0,0,.7)' }}>
            {/* Check icon */}
            <div style={{ width: '72px', height: '72px', background: 'rgba(5,150,105,.12)', border: '2px solid rgba(5,150,105,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>✓</div>

            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '26px', fontWeight: 800, color: '#ECF2FA', letterSpacing: '-0.04em', marginBottom: '8px' }}>
              Pagamento confirmado!
            </div>
            <div style={{ fontSize: '14px', color: '#6E8099', marginBottom: '28px', lineHeight: 1.6 }}>
              Sua conta foi ativada. Confira seu email para os dados de acesso.
            </div>

            {/* Plan badge */}
            <div style={{ background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.2)', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Plano ativado</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#ECF2FA', marginBottom: '4px' }}>{planNames[plan] || planNames.starter}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '32px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                {planCredits[plan] === 99999 ? '∞' : planCredits[plan] || 20}
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#6E8099', marginLeft: '6px' }}>créditos/mês</span>
              </div>
            </div>

            <Link href="/dashboard" style={{ display: 'block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '14px', borderRadius: '12px', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', textDecoration: 'none', marginBottom: '12px', boxShadow: '0 4px 20px rgba(197,24,58,.3)' }}>
              Acessar meu dashboard →
            </Link>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>
              Redirecionando em {count}s...
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/termos" style={{ fontSize: '12px', color: '#364A62', fontFamily: "'JetBrains Mono',monospace" }}>Termos de Uso</Link>
            <Link href="/privacidade" style={{ fontSize: '12px', color: '#364A62', fontFamily: "'JetBrains Mono',monospace" }}>Privacidade</Link>
          </div>
        </div>
      </div>
    </>
  )
}
