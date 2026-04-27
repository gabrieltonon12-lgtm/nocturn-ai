import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

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

  return (
    <>
      <Head><title>Entrar — NOCTURN.AI</title></Head>

      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
        @keyframes float2   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
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
          maxWidth:'480px',margin:'0 auto',
          animation:'fadeUp .4s ease both',
        }}>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'48px',alignSelf:'flex-start'}}>
            <div style={{
              width:'38px',height:'38px',
              background:'linear-gradient(135deg,#7A5CFC,#5B21B6)',
              borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:"'Syne',sans-serif",fontWeight:800,color:'#fff',fontSize:'17px',
              boxShadow:'0 4px 18px rgba(122,92,252,.45)',letterSpacing:'-0.5px',flexShrink:0,
            }}>N</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:700,color:D.t1,letterSpacing:'-0.04em'}}>NOCTURN.AI</span>
          </div>

          {/* Heading */}
          <div style={{alignSelf:'flex-start',marginBottom:'36px'}}>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'30px',fontWeight:800,letterSpacing:'-0.045em',color:D.t1,marginBottom:'10px',lineHeight:1.1}}>
              Bem-vindo de volta
            </h1>
            <p style={{fontSize:'15px',color:D.t2,lineHeight:1.65,fontWeight:400}}>
              Entre para continuar criando vídeos com IA.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{width:'100%',background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.3)',color:'#F87171',padding:'12px 16px',borderRadius:'10px',fontSize:'14px',marginBottom:'20px',fontWeight:500}}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'18px',width:'100%'}}>

            <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
              <label style={{fontSize:'11px',fontWeight:600,color:D.t3,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Email</label>
              <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com" />
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label style={{fontSize:'11px',fontWeight:600,color:D.t3,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Senha</label>
                <Link href="/forgot-password" className="link-acc" style={{fontSize:'13px'}}>
                  Esqueci minha senha
                </Link>
              </div>
              <input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="btn-acc" style={{marginTop:'4px'}}>
              {loading ? 'Entrando...' : 'Entrar na conta →'}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:'14px',color:D.t2,marginTop:'28px'}}>
            Não tem conta?{' '}
            <Link href="/register" className="link-acc">Criar grátis</Link>
          </p>

          {/* Social proof */}
          <div style={{
            marginTop:'44px',width:'100%',
            background:D.card,border:`1px solid ${D.line}`,borderRadius:'16px',
            padding:'20px 22px',boxShadow:'0 4px 24px rgba(0,0,0,.5)',
          }}>
            <div style={{display:'flex',gap:'3px',marginBottom:'11px'}}>
              {[...Array(5)].map((_,i) => <span key={i} style={{color:D.amber,fontSize:'13px'}}>★</span>)}
            </div>
            <p style={{fontSize:'13px',color:D.t2,lineHeight:1.75,marginBottom:'14px',fontStyle:'italic'}}>
              "Criei 3 canais em 6 semanas sem aparecer em nenhum. O canal maior já tem 12 mil inscritos e já monetizou."
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{
                width:'34px',height:'34px',borderRadius:'50%',flexShrink:0,
                background:'linear-gradient(135deg,#7A5CFC,#4C1D95)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'14px',
              }}>R</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:700,color:D.t1,letterSpacing:'-0.01em'}}>Rafael M.</div>
                <div style={{fontSize:'11px',color:D.t3,marginTop:'1px'}}>Canal True Crime · 12k inscritos</div>
              </div>
              <div style={{
                marginLeft:'auto',fontFamily:"'JetBrains Mono',monospace",
                fontSize:'9px',padding:'3px 10px',borderRadius:'20px',
                background:D.gDim,color:D.green,fontWeight:600,letterSpacing:'0.05em',
                border:'1px solid rgba(52,211,153,.2)',
              }}>
                Verificado ✓
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Cinematic panel ── */}
        <div className="right-col" style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          padding:'60px 48px',position:'relative',overflow:'hidden',
          background:'linear-gradient(145deg,#0D0A20 0%,#090E1A 45%,#07090F 100%)',
        }}>
          {/* Ambient orbs */}
          <div style={{position:'absolute',top:'8%',left:'18%',width:'440px',height:'440px',borderRadius:'50%',background:'radial-gradient(circle,rgba(122,92,252,.18) 0%,transparent 68%)',animation:'float1 9s ease-in-out infinite',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'12%',right:'8%',width:'360px',height:'360px',borderRadius:'50%',background:'radial-gradient(circle,rgba(90,55,210,.12) 0%,transparent 65%)',animation:'float2 11s ease-in-out infinite',pointerEvents:'none'}}/>
          {/* Dot grid */}
          <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}}/>
          {/* Vignette */}
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 40%,rgba(4,6,12,.7) 100%)',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:'380px'}}>
            {/* Badge */}
            <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(122,92,252,.14)',border:'1px solid rgba(122,92,252,.28)',borderRadius:'20px',padding:'6px 16px',marginBottom:'30px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#7A5CFC',boxShadow:'0 0 8px rgba(122,92,252,.8)',display:'inline-block',animation:'pulse 2s ease infinite'}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#A78BFA',fontWeight:600,letterSpacing:'0.09em'}}>GPT-4o · RUNWAY ML · TTS</span>
            </div>

            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'34px',fontWeight:800,color:'#ECEEF8',letterSpacing:'-0.045em',marginBottom:'16px',lineHeight:1.1}}>
              Crie vídeos virais<br/>com IA em minutos
            </h2>
            <p style={{fontSize:'15px',color:'rgba(236,238,248,.55)',lineHeight:1.8,marginBottom:'40px'}}>
              Roteiro automático, voz IA realista e vídeo pronto para publicar. Sem câmera, sem edição.
            </p>

            {/* Steps */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px',textAlign:'left'}}>
              {[
                {n:'01', t:'Escolha um tema', s:'True crime, finanças, mistério, religioso e mais'},
                {n:'02', t:'IA gera tudo',    s:'GPT-4o escreve · TTS narra · Runway anima'},
                {n:'03', t:'Publique e monetize', s:'YouTube · TikTok · Instagram · Shorts'},
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
          </div>
        </div>

      </div>
    </>
  )
}
