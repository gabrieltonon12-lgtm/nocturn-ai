import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [logged, setLogged] = useState(false)
  useEffect(() => {
    setLogged(!!localStorage.getItem('token'))
  }, [])

  return (
    <>
      <Head>
        <title>Página não encontrada — NOCTURN.AI</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#080b10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '24px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px',
            background: 'linear-gradient(135deg,#C5183A,#8B0A22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff',
          }}>N</div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '18px', color: '#F0F2F8', letterSpacing: '-0.03em' }}>
            NOCTURN.AI
          </span>
        </Link>

        {/* 404 */}
        <div style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: '120px',
          fontWeight: 800,
          letterSpacing: '-6px',
          lineHeight: 1,
          background: 'linear-gradient(135deg,#C5183A,#8B0A22)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          userSelect: 'none',
        }}>404</div>

        <h1 style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: '24px',
          fontWeight: 700,
          color: '#F0F2F8',
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}>
          Página não encontrada
        </h1>

        <p style={{ fontSize: '15px', color: '#64748B', margin: '0 0 40px', maxWidth: '360px', lineHeight: 1.7 }}>
          O link que você seguiu pode estar quebrado ou a página foi removida.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href={logged ? '/dashboard' : '/'} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '12px 24px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#C5183A,#8B0A22)',
            color: '#fff', fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', letterSpacing: '-0.02em',
            boxShadow: '0 4px 20px rgba(197,24,58,.3)',
          }}>
            {logged ? '← Voltar ao dashboard' : '← Ir para o início'}
          </Link>

          {!logged && (
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 24px', borderRadius: '10px',
              border: '1px solid #1e2840', background: 'transparent',
              color: '#94A3B8', fontWeight: 600, fontSize: '14px',
              textDecoration: 'none',
            }}>
              Fazer login
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
