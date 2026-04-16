import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const S = { bg:'#05080F', card:'#080D1A', line:'#192436', red:'#C5183A', t1:'#EDF1F8', t2:'#6E8099', t3:'#364A62' }
const inp: React.CSSProperties = { background:'#0C1222', border:'1px solid #192436', borderRadius:'9px', padding:'12px 14px', color:S.t1, fontSize:'14px', outline:'none', width:'100%', transition:'border-color .15s', fontFamily:"'Inter',system-ui,sans-serif", boxSizing:'border-box' }

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('As senhas não coincidem')
    if (password.length < 6) return setError('Senha mínimo 6 caracteres')
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Redefinir senha — NOCTURN.AI</title></Head>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:S.bg, fontFamily:"'Inter',system-ui,sans-serif" }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'center', marginBottom:'32px' }}>
            <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, color:'#fff', fontSize:'15px' }}>N</div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'18px', fontWeight:700, color:S.t1, letterSpacing:'-0.03em' }}>NOCTURN.AI</span>
          </div>

          <div style={{ background:S.card, border:`1px solid ${S.line}`, borderRadius:'16px', padding:'36px' }}>
            {done ? (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'40px', marginBottom:'16px' }}>✅</div>
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'20px', fontWeight:700, color:S.t1, marginBottom:'12px' }}>Senha redefinida!</h2>
                <p style={{ color:S.t2, fontSize:'14px', marginBottom:'0' }}>Redirecionando para o login...</p>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'22px', fontWeight:700, letterSpacing:'-0.03em', color:S.t1, marginBottom:'8px', textAlign:'center' }}>Nova senha</h1>
                <p style={{ fontSize:'13px', color:S.t2, textAlign:'center', marginBottom:'28px' }}>Digite sua nova senha abaixo.</p>

                {error && <div style={{ background:'rgba(197,24,58,.08)', border:'1px solid rgba(197,24,58,.2)', color:S.red, padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'18px' }}>{error}</div>}

                {!token && <div style={{ color:S.t2, textAlign:'center', fontSize:'13px' }}>Link inválido. <Link href="/forgot-password" style={{ color:S.red }}>Solicitar novo link</Link></div>}

                {token && (
                  <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                      <label style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:S.t3, letterSpacing:'0.08em', textTransform:'uppercase' }}>Nova senha</label>
                      <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="mínimo 6 caracteres"
                        onFocus={e => e.target.style.borderColor = S.red} onBlur={e => e.target.style.borderColor = S.line} />
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                      <label style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:S.t3, letterSpacing:'0.08em', textTransform:'uppercase' }}>Confirmar senha</label>
                      <input style={inp} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="repita a senha"
                        onFocus={e => e.target.style.borderColor = S.red} onBlur={e => e.target.style.borderColor = S.line} />
                    </div>
                    <button type="submit" disabled={loading} style={{ background: loading ? '#0C1222' : 'linear-gradient(135deg,#C5183A,#8B0A22)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontSize:'14px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontFamily:"'Space Grotesk',sans-serif" }}>
                      {loading ? 'Salvando...' : 'Salvar nova senha'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
