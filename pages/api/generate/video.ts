import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export const config = { maxDuration: 300 }
import RunwayML from '@runwayml/sdk'
import { getUsers, saveUser, saveVideo, generateId, ensureAdmin } from '../../../lib/db'

// OpenAI TTS voices
const OPENAI_VOICES: Record<string,string> = {
  masculine: 'onyx',
  feminine:  'nova',
  neutral:   'echo',
  asmr:      'fable',
}

// Tom de voz por tipo de conteúdo
const CONTENT_TONE: Record<string,string> = {
  faceless:      'narrador grave e misterioso, tom de documentário sombrio',
  educational:   'narrador educativo e claro, tom de documentário informativo',
  inspirational: 'narrador motivacional e empolgante, tom positivo e encorajador',
  religious:     'narrador reverente e acolhedor, tom espiritual e reflexivo',
  news:          'narrador jornalístico e direto, tom informativo e objetivo',
  mystery:       'narrador intrigante e suspense, tom de investigação',
  truecrime:     'narrador sério e investigativo, tom de true crime',
  finance:       'narrador confiante e direto, tom de educação financeira',
  nature:        'narrador contemplativo e encantado, tom de documentário natural',
  sports:        'narrador empolgante e dinâmico, tom esportivo',
  food:          'narrador caloroso e apaixonado, tom gastronômico',
  horror:        'narrador tenso e assustador, tom de terror psicológico',
  asmr:          'narrador suave e sussurrado, tom relaxante',
}

// Busca imagens no Pexels para cada cena
async function fetchPexelsImages(queries: string[], pexelsKey: string, format: string = 'landscape'): Promise<string[]> {
  const orientation = format === 'portrait' ? 'portrait' : 'landscape'
  const images: string[] = []
  for (const query of queries.slice(0, 5)) {
    try {
      const r = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`,
        { headers: { Authorization: pexelsKey } }
      )
      if (r.ok) {
        const d = await r.json()
        const url = d.photos?.[0]?.src?.large2x || d.photos?.[0]?.src?.large || ''
        if (url) images.push(url)
      }
    } catch(e) { console.error('Pexels error:', e) }
  }
  return images
}

// Gera audio com OpenAI TTS e retorna base64
async function generateAudio(text: string, voice: string, openaiKey: string): Promise<string> {
  try {
    const narration = text.replace(/\[.*?\]/g, '').trim().substring(0, 4000)
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: narration,
        voice: voice,
        speed: 0.95,
      })
    })
    if (!r.ok) {
      const errBody = await r.text()
      console.error(`OpenAI TTS error ${r.status}:`, errBody)
      return ''
    }
    const arrayBuf = await r.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuf)
    let binary = ''
    const chunkSize = 8192
    for (let i = 0; i < uint8.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(uint8.slice(i, i + chunkSize)))
    }
    return 'data:audio/mpeg;base64,' + btoa(binary)
  } catch(e) { console.error('OpenAI TTS error:', e); return '' }
}

async function generateRunwayVideo(promptText: string, format: string): Promise<string> {
  const apiKey = process.env.RUNWAY_API_KEY
  if (!apiKey) throw new Error('RUNWAY_API_KEY não configurada')

  const client = new RunwayML({ apiKey })
  const ratio = format === 'portrait' ? '720:1280' : '1280:720'

  // Runway limita promptText a 1000 chars (UTF-16 code units)
  const safePrompt = promptText.substring(0, 1000)

  const task = await client.textToVideo.create({
    model: 'gen4.5',
    promptText: safePrompt,
    ratio: ratio as '1280:720' | '720:1280',
    duration: 10,
  })

  const taskId = task.id
  console.log(`Runway task criada: ${taskId}`)

  // Polling com timeout de 4 minutos (deixa margem para o resto do handler)
  const deadline = Date.now() + 4 * 60 * 1000
  let result: any
  do {
    await new Promise(r => setTimeout(r, 8000))
    result = await client.tasks.retrieve(taskId)
    console.log(`Runway status: ${result.status}`)
    if (Date.now() > deadline) throw new Error('Runway timeout: geração demorou mais de 4 minutos')
    if (result.status === 'CANCELLED') throw new Error('Runway task foi cancelada')
    if (result.status === 'THROTTLED') {
      // Continua tentando se throttled (limite de concorrência)
      console.log('Runway throttled, aguardando...')
      continue
    }
  } while (!['SUCCEEDED', 'FAILED'].includes(result.status))

  if (result.status === 'FAILED') {
    throw new Error(`Runway falhou: ${result.failure || result.failureCode || 'erro desconhecido'}`)
  }

  if (!result.output || result.output.length === 0) {
    throw new Error('Runway retornou sem URL de vídeo no output')
  }

  return result.output[0] as string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await ensureAdmin()
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatorio' })
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    let decoded: any
    try { decoded = jwt.verify(auth.split(' ')[1], secret) }
    catch { return res.status(401).json({ error: 'Token invalido. Faca login novamente.' }) }

    const users = await getUsers()
    const idx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (idx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' })
    const user = users[idx]
    if (!user.active) return res.status(403).json({ error: 'Conta inativa.' })
    if ((user.credits ?? 0) <= 0) return res.status(402).json({ error: 'Sem creditos. Faca upgrade.' })

    const { prompt, contentType = 'faceless', duration = 'medium', voice = 'masculine', platforms = ['youtube'], format = 'landscape', language = 'pt', scriptData } = req.body
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt obrigatorio' })

    const openaiKey = process.env.OPENAI_API_KEY || ''
    const pexelsKey = process.env.PEXELS_API_KEY || ''

    let title = prompt.substring(0, 60)
    let script = ''
    let description = ''
    let tags: string[] = []
    let scenes: Array<{text: string, imageQuery: string}> = []
    let audioBase64 = ''
    let images: string[] = []
    let runwayVideoUrl = ''

    // ── STEP 1: Use scriptData if provided (from preview), else call GPT-4o ─
    if (scriptData && scriptData.scenes && scriptData.scenes.length > 0) {
      // Script was already generated via /api/generate/script — skip GPT call
      title = scriptData.title || title
      description = scriptData.description || ''
      tags = scriptData.tags || []
      scenes = scriptData.scenes || []
      script = scenes.map((s: any) => s.text || '').join(' ')
    } else if (openaiKey) {
      const dMap: Record<string,string> = { short: '4 cenas de 10-15s (total até 1 minuto)', long: '10 cenas de 15-20s (total de 1 a 3 minutos)' }
      const tone = CONTENT_TONE[contentType] || 'narrador envolvente, tom de documentário'
      const langMap: Record<string,string> = {
        pt: 'português brasileiro fluido e natural',
        en: 'fluent American English, natural and engaging',
        es: 'español latinoamericano fluido y natural',
      }
      const langInstruction = langMap[language] || langMap.pt

      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 2500,
            messages: [{
              role: 'system',
              content: `Você é roteirista profissional especialista em vídeos virais no YouTube.
REGRA ABSOLUTA: O roteiro DEVE ser EXATAMENTE sobre o tema informado pelo usuário. Nunca desvie do assunto.
Escreva em ${langInstruction}.
Estrutura: ${dMap[duration] || '6 cenas de 20-30s'}. Tom: ${tone}.

IMPORTANTE:
- O campo "scenes" contém EXATAMENTE o texto que será narrado em cada cena (palavra por palavra como sairá do TTS)
- Cada cena: 25-40 palavras, frases completas, sem marcações como [pausa] ou [música] ou [efeito]
- A narração deve ser contínua — cada scene.text é um trecho sequencial do roteiro
- imageQuery em inglês para buscar imagem no Pexels que represente visualmente aquela cena (seja específico e relevante ao tema)
- Use imagens realistas e relevantes ao tema — se for sobre Deus/religião use igrejas, céu, luz, fé; se for natureza use paisagens; etc.

RETORNE APENAS JSON válido, sem markdown:
{
  "title": "título atrativo máximo 70 chars sobre o tema exato",
  "description": "descrição para publicação máximo 250 chars com call to action",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "scenes": [
    {"text": "texto exato narrado nesta cena sem pontuação de palco", "imageQuery": "specific relevant english search term for pexels"},
    {"text": "continuação natural do trecho anterior...", "imageQuery": "..."}
  ]
}`,
            }, {
              role: 'user',
              content: `Crie o roteiro EXATAMENTE sobre este tema: ${prompt}`,
            }]
          })
        })
        if (aiRes.ok) {
          const raw = (await aiRes.json()).choices?.[0]?.message?.content || ''
          try {
            const p = JSON.parse(raw.replace(/```json/gi,'').replace(/```/g,'').trim())
            title = p.title || title
            description = p.description || ''
            tags = p.tags || []
            scenes = p.scenes || []
            // Use scenes as source of truth for narration — ensures audio matches subtitles
            script = scenes.map((s: any) => s.text || '').join(' ')
          } catch { script = raw; title = prompt.substring(0,60) }
        }
      } catch(e) { console.error('OpenAI error:', e) }
    }

    if (!script || scenes.length === 0) {
      script = `Você está prestes a descobrir a verdade sobre ${prompt}. O que você vai ouvir agora é baseado em fatos reais que poucos conhecem. Prepare-se para o que está por vir.`
      scenes = [{ text: script, imageQuery: 'dark mysterious conspiracy revelation' }]
      tags = ['misterio', 'conspiracao', 'dark channel', 'verdade', 'faceless']
    }

    // ── STEP 2: OpenAI TTS gera audio da narracao ────────────────────────
    if (openaiKey && script) {
      const openaiVoice = OPENAI_VOICES[voice] || OPENAI_VOICES.masculine
      audioBase64 = await generateAudio(script, openaiVoice, openaiKey)
      console.log('OpenAI TTS:', audioBase64 ? `OK (${Math.round(audioBase64.length/1024)}kb)` : 'FAILED')
    }

    // ── STEP 3: Runway ML gera vídeo real em MP4 ──────────────────────────
    let runwayError = ''
    try {
      const visualQueries = scenes.slice(0, 3).map(s => s.imageQuery).join(', ')
      const runwayPrompt = `Cinematic b-roll video about: ${prompt}. Visual style: ${visualQueries}. High quality, dramatic lighting, smooth camera movement.`
      runwayVideoUrl = await generateRunwayVideo(runwayPrompt, format)
      console.log('Runway vídeo gerado:', runwayVideoUrl)
    } catch (e: any) {
      runwayError = e?.message || 'Erro desconhecido no Runway'
      console.error('Runway error:', runwayError)
      // Fallback: busca imagens no Pexels
      if (pexelsKey && scenes.length > 0) {
        const queries = scenes.map(s => s.imageQuery)
        images = await fetchPexelsImages(queries, pexelsKey, format)
        if (images.length === 0) images = ['https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg']
      }
    }

    // ── STEP 4: Salva e retorna ───────────────────────────────────────────
    users[idx].credits = Math.max(0, (user.credits ?? 1) - 1)
    users[idx].videoCount = (user.videoCount ?? 0) + 1
    await saveUser(users[idx])

    const video = {
      id: generateId(),
      userId: user.id,
      title,
      script,
      description,
      tags,
      prompt,
      contentType,
      duration,
      voice,
      platforms,
      format,
      language,
      scenes,
      images,
      audioBase64,
      runwayVideoUrl,
      hasAudio: audioBase64.length > 0,
      hasImages: images.length > 0,
      hasRunwayVideo: runwayVideoUrl.length > 0,
      runwayError: runwayError || undefined,
      status: 'ready',
      createdAt: new Date().toISOString(),
    }
    await saveVideo(video)

    // Send first-video celebration email
    const isFirstVideo = (user.videoCount ?? 1) === 1
    if (isFirstVideo && user.email) {
      const resendKey = process.env.RESEND_API_KEY || ''
      if (resendKey) {
        const userName = user.name || 'criador'
        const upgradeUrl = 'https://pay.cakto.com.br/37beu86'
        const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>NOCTURN.AI</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding-bottom:24px;text-align:center;">
  <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#C5183A,#8B0A22);border-radius:8px;color:#fff;font-weight:800;font-size:15px;text-align:center;line-height:32px;">N</span>
  <span style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;margin-left:8px;vertical-align:middle;">NOCTURN.AI</span>
</td></tr>
<tr><td style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:40px 36px;">
  <div style="font-size:48px;text-align:center;margin-bottom:20px;">🎉</div>
  <h1 style="font-size:26px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;text-align:center;line-height:1.15;">
    ${userName}, seu primeiro vídeo<br>foi <span style="color:#C5183A;">gerado com sucesso!</span>
  </h1>
  <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 24px;text-align:center;">
    Você acabou de criar <strong style="color:#0F172A;">"${title}"</strong><br>
    Isso custaria <strong style="color:#0F172A;">~R$400</strong> para um editor humano fazer. Você fez em menos de 3 minutos.
  </p>
  <div style="background:linear-gradient(135deg,rgba(197,24,58,.06),rgba(124,58,237,.04));border:1px solid rgba(197,24,58,.2);border-radius:14px;padding:20px 24px;margin-bottom:24px;text-align:center;">
    <div style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;margin-bottom:6px;">
      Com o plano Pro → R$0,97 por vídeo
    </div>
    <div style="font-size:13px;color:#64748B;">100 vídeos/mês · Todas as plataformas · Suporte prioritário</div>
  </div>
  <a href="${upgradeUrl}" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-bottom:12px;">
    Gerar 100 vídeos/mês por R$97 →
  </a>
  <a href="https://nocturn-ai.vercel.app/dashboard" style="display:block;text-align:center;color:#94A3B8;font-size:12px;text-decoration:none;margin-top:8px;">
    Voltar ao dashboard
  </a>
</td></tr>
<tr><td style="padding-top:20px;text-align:center;">
  <p style="font-size:11px;color:#94A3B8;line-height:1.8;">NOCTURN.AI · Garantia de 7 dias em qualquer plano</p>
</td></tr>
</table></td></tr></table>
</body></html>`
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
            to: user.email,
            subject: `🎉 Seu primeiro vídeo foi gerado, ${userName}! Veja o que vem a seguir`,
            html: htmlBody,
            text: `Parabéns ${userName}! Seu primeiro vídeo "${title}" foi gerado com sucesso no NOCTURN.AI. Acesse: https://nocturn-ai.vercel.app/dashboard`,
          }),
        }).catch(e => console.error('First video email error:', e))
      }
    }

    res.status(200).json({ video, creditsRemaining: users[idx].credits })
  } catch(e: any) {
    console.error('Generate error:', e)
    res.status(500).json({ error: 'Erro ao gerar. Tente novamente.' })
  }
}