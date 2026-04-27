import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { getVideoById } from '../../lib/db'

interface Props { video: any | null }

export default function PublicVideo({ video }: Props) {
  const [copied, setCopied] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  if (!video) return (
    <div style={{ minHeight: '100vh', background: '#05080F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E8099', fontFamily: "'Figtree',system-ui,sans-serif", flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px', opacity: 0.2 }}>🎬</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: 700, color: '#ECF2FA' }}>Vídeo não encontrado</div>
      <Link href="/" style={{ color: '#C5183A', fontSize: '13px' }}>← Voltar ao início</Link>
    </div>
  )

  const thumb = video.runwayVideoUrl ? '' : (video.images?.[0] || '')
  const tags = (video.tags || []).slice(0, 5)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://nocturn-ai.vercel.app/v/${video.id}`
  const isRunway = !!video.runwayVideoUrl
  const isPortrait = video.format === 'portrait'

  const copyLink = () => {
    const url = `https://nocturn-ai.vercel.app/v/${video.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setShareMsg('Link copiado!')
      setTimeout(() => { setCopied(false); setShareMsg('') }, 3000)
    })
  }

  const shareWhatsApp = () => {
    const url = `https://nocturn-ai.vercel.app/v/${video.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(`${video.title} — criado com IA em 3 minutos\n${url}`)}`, '_blank')
  }

  const shareTwitter = () => {
    const url = `https://nocturn-ai.vercel.app/v/${video.id}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${video.title} — criado com IA em menos de 3 minutos no @NocturnAI\n`)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <>
      <Head>
        <title>{video.title} — NOCTURN.AI</title>
        <meta name="description" content={video.description || 'Vídeo gerado com IA no NOCTURN.AI em menos de 3 minutos'} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description || 'Criado com IA — roteiro, narração e vídeo automáticos. Grátis no NOCTURN.AI.'} />
        <meta property="og:type" content="video.other" />
        <meta property="og:url" content={`https://nocturn-ai.vercel.app/v/${video.id}`} />
        {thumb && <meta property="og:image" content={thumb} />}
        {!thumb && <meta property="og:image" content="https://nocturn-ai.vercel.app/og-image.svg" />}
        <meta name="twitter:card" content={thumb ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content="Criado com IA em menos de 3 minutos. Grátis no NOCTURN.AI." />
        {thumb && <meta name="twitter:image" content={thumb} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }
        body { -webkit-font-smoothing: antialiased; background: #05080F; }
        .share-btn { transition: background .15s, transform .12s; }
        .share-btn:hover { transform: translateY(-1px); }
        .cta-card { transition: box-shadow .2s; }
        .cta-card:hover { box-shadow: 0 24px 80px rgba(197,24,58,.2) !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#05080F', color: '#ECF2FA', fontFamily: "'Figtree',system-ui,sans-serif" }}>

        {/* Nav */}
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #192436', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,8,15,.95)', backdropFilter: 'blur(12px)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ECF2FA' }}>
            <span style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '7px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '13px', color: '#fff', boxShadow: '0 2px 8px rgba(197,24,58,.4)' }}>N</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em' }}>NOCTURN.AI</span>
          </Link>
          <Link href="/register" style={{ background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '8px 18px', borderRadius: '8px', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '12px', boxShadow: '0 4px 16px rgba(197,24,58,.35)' }}>
            Criar canal grátis →
          </Link>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 20px 80px', animation: 'fadeUp .4s ease' }}>

          {/* Title + tags */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#ECF2FA', lineHeight: 1.2, marginBottom: '12px' }}>{video.title}</h1>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {tags.map((t: string) => (
                <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', background: 'rgba(197,24,58,.1)', border: '1px solid rgba(197,24,58,.2)', padding: '3px 10px', borderRadius: '20px' }}>#{t}</span>
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {isRunway && <span style={{ color: '#C5183A', fontWeight: 600 }}>● RUNWAY ML GEN4.5</span>}
              {video.createdAt && <span>Criado em {new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />Gerado em &lt; 3 minutos</span>
            </div>
          </div>

          {/* Video player — Runway */}
          {isRunway && (
            <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #192436', background: '#000', position: 'relative' }}>
              <video
                src={video.runwayVideoUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', display: 'block', aspectRatio: isPortrait ? '9/16' : '16/9', maxHeight: isPortrait ? '600px' : '420px', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,.7)', border: '1px solid rgba(197,24,58,.4)', borderRadius: '6px', padding: '4px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#C5183A', fontWeight: 600, letterSpacing: '0.06em', backdropFilter: 'blur(8px)' }}>
                RUNWAY ML GEN4.5
              </div>
            </div>
          )}

          {/* Pexels scenes grid */}
          {!isRunway && video.images?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>{video.images.length} cenas cinematográficas</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '8px' }}>
                {video.images.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
                    <img src={img} alt={`Cena ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(0.8)' }} loading="lazy" />
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>C{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share strip */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px', padding: '14px 16px', background: '#080D1A', border: '1px solid #192436', borderRadius: '12px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '4px' }}>Compartilhar</span>
            <button onClick={copyLink} className="share-btn" style={{ background: copied ? 'rgba(16,185,129,.12)' : 'rgba(255,255,255,.06)', border: `1px solid ${copied ? 'rgba(16,185,129,.3)' : '#192436'}`, color: copied ? '#10B981' : '#6E8099', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
              {copied ? '✓ Copiado!' : '🔗 Copiar link'}
            </button>
            <button onClick={shareWhatsApp} className="share-btn" style={{ background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.2)', color: '#25D366', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
              WhatsApp
            </button>
            <button onClick={shareTwitter} className="share-btn" style={{ background: 'rgba(29,161,242,.08)', border: '1px solid rgba(29,161,242,.2)', color: '#1DA1F2', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
              X / Twitter
            </button>
          </div>

          {/* Description */}
          {video.description && (
            <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Descrição para YouTube/TikTok</div>
              <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.8, margin: 0 }}>{video.description}</p>
            </div>
          )}

          {/* Script preview */}
          {video.script && (
            <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '12px', padding: '18px', marginBottom: '28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Roteiro gerado por GPT-4o</div>
              <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.85, margin: 0 }}>{video.script.substring(0, 500)}{video.script.length > 500 ? '...' : ''}</p>
            </div>
          )}

          {/* Viral loop CTA */}
          <div className="cta-card" style={{ background: 'linear-gradient(160deg,rgba(197,24,58,.12),rgba(124,58,237,.06))', border: '1px solid rgba(197,24,58,.25)', borderRadius: '20px', padding: '36px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(197,24,58,.08)', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(197,24,58,.1) 0%,transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>✦ Criado com NOCTURN.AI</div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#ECF2FA', lineHeight: 1.15, marginBottom: '14px' }}>
                Este vídeo foi criado em<br /><span style={{ color: '#C5183A' }}>menos de 3 minutos</span> com IA
              </h2>
              <p style={{ fontSize: '14px', color: '#6E8099', lineHeight: 1.8, marginBottom: '28px', maxWidth: '420px', margin: '0 auto 28px' }}>
                Roteiro GPT-4o · Narração TTS · Vídeo Runway ML<br />
                <strong style={{ color: '#ECF2FA' }}>Sem câmera. Sem aparecer. 1 vídeo grátis para você testar.</strong>
              </p>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['+1.200 criadores', '< 3 min por vídeo', 'R$0,97 no Pro'].map((t, i) => (
                  <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 700 }}>✓</span> {t}
                  </span>
                ))}
              </div>

              <Link href="/register" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '16px 40px', borderRadius: '12px', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em', boxShadow: '0 8px 32px rgba(197,24,58,.4)', marginBottom: '12px' }}>
                Criar Meu Canal Grátis Agora →
              </Link>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>
                Sem cartão · 1 vídeo grátis · 7 dias de garantia
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string
    const video = await getVideoById(id)
    if (!video) return { props: { video: null } }
    const { audioBase64: _, ...safe } = video
    return { props: { video: safe } }
  } catch {
    return { props: { video: null } }
  }
}
