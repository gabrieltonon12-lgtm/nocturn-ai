import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getVideos } from '../../lib/db'

interface Props { video: any | null }

export default function PublicVideo({ video }: Props) {
  if (!video) return (
    <div style={{ minHeight: '100vh', background: '#05080F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E8099', fontFamily: "'Inter',sans-serif", flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px', opacity: 0.2 }}>🎬</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#ECF2FA' }}>Vídeo não encontrado</div>
      <Link href="/" style={{ color: '#C5183A', fontSize: '13px' }}>← Voltar ao início</Link>
    </div>
  )

  const thumb = video.images?.[0] || ''
  const tags = (video.tags || []).slice(0, 5)

  return (
    <>
      <Head>
        <title>{video.title} — NOCTURN.AI</title>
        <meta name="description" content={video.description || video.title} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description || 'Vídeo gerado com IA no NOCTURN.AI'} />
        {thumb && <meta property="og:image" content={thumb} />}
        <meta property="og:type" content="video.other" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={video.title} />
        {thumb && <meta name="twitter:image" content={thumb} />}
      </Head>

      <div style={{ minHeight: '100vh', background: '#05080F', color: '#ECF2FA', fontFamily: "'Inter',system-ui,sans-serif" }}>

        {/* Hero */}
        <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
          {thumb && <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.5)' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,15,.2) 0%, rgba(5,8,15,.95) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto', padding: '80px 24px 0' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6E8099', textDecoration: 'none', marginBottom: '24px' }}>
              <span style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '12px', color: '#fff' }}>N</span>
              NOCTURN.AI
            </Link>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '28px', fontWeight: 800, letterSpacing: '-0.04em', color: '#ECF2FA', lineHeight: 1.3, marginBottom: '12px' }}>{video.title}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tags.map((t: string) => (
                <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#C5183A', background: 'rgba(197,24,58,.1)', border: '1px solid rgba(197,24,58,.2)', padding: '3px 10px', borderRadius: '20px' }}>#{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Scene images */}
          {video.images?.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{video.images.length} cenas</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '8px' }}>
                {video.images.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
                    <img src={img} alt={`Cena ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
                    <div style={{ position: 'absolute', bottom: '4px', left: '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'rgba(255,255,255,.6)', fontWeight: 700 }}>C{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {video.description && (
            <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Descrição</div>
              <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.75, margin: 0 }}>{video.description}</p>
            </div>
          )}

          {/* Script preview */}
          {video.script && (
            <div style={{ background: '#080D1A', border: '1px solid #192436', borderRadius: '12px', padding: '18px', marginBottom: '28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#364A62', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Roteiro</div>
              <p style={{ fontSize: '13px', color: '#6E8099', lineHeight: 1.8, margin: 0 }}>{video.script.substring(0, 400)}{video.script.length > 400 ? '...' : ''}</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg,rgba(197,24,58,.1),rgba(124,58,237,.06))', border: '1px solid rgba(197,24,58,.2)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '20px', fontWeight: 800, color: '#ECF2FA', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Crie vídeos como esse com IA
            </div>
            <div style={{ fontSize: '13px', color: '#6E8099', marginBottom: '20px', lineHeight: 1.6 }}>
              Roteiro + narração + imagens em menos de 3 minutos.<br />1 vídeo grátis, sem cartão.
            </div>
            <Link href="/register" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', color: '#fff', padding: '13px 32px', borderRadius: '10px', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', textDecoration: 'none', boxShadow: '0 4px 20px rgba(197,24,58,.3)' }}>
              Criar meu vídeo grátis →
            </Link>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#364A62' }}>
            Criado com NOCTURN.AI · {video.createdAt ? new Date(video.createdAt).toLocaleDateString('pt-BR') : ''}
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string
    const videos = await getVideos()
    const video = videos.find((v: any) => v.id === id)
    if (!video) return { props: { video: null } }
    // Strip audioBase64 for public page (too large for SSR)
    const { audioBase64: _, ...safe } = video
    return { props: { video: safe } }
  } catch {
    return { props: { video: null } }
  }
}
