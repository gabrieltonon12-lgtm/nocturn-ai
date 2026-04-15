import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, saveVideo, generateId, ensureAdmin } from '../../../lib/db'

const VOICE_IDS: Record<string,string> = {
  masculine: 'TxGEqnHWrfWFTfGW9XjX',
  feminine:  'EXAVITQu4vr4xnSDxMaL',
  neutral:   'pNInz6obpgDQGcFmaJgB',
  asmr:      'MF3mGyEYCl7XYWbV9V6O',
}

// Busca imagens no Pexels para cada cena
async function fetchPexelsImages(queries: string[], pexelsKey: string): Promise<string[]> {
  const images: string[] = []
  for (const query of queries.slice(0, 5)) {
    try {
      const r = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' dark mysterious')}&per_page=1&orientation=landscape`,
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

// Gera audio com ElevenLabs e retorna base64
async function generateAudio(text: string, voiceId: string, elevenKey: string): Promise<string> {
  try {
    // Limita a 900 chars para nao estourar cota
    const narration = text.replace(/\[.*?\]/g, '').trim().substring(0, 900)
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: narration,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true }
      })
    })
    if (!r.ok) { console.error('ElevenLabs status:', r.status, await r.text()); return '' }
    const buf = Buffer.from(await r.arrayBuffer())
    return 'data:audio/mpeg;base64,' + buf.toString('base64')
  } catch(e) { console.error('ElevenLabs error:', e); return '' }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    ensureAdmin()
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatorio' })
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    let decoded: any
    try { decoded = jwt.verify(auth.split(' ')[1], secret) }
    catch { return res.status(401).json({ error: 'Token invalido. Faca login novamente.' }) }

    const users = getUsers()
    const idx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (idx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' })
    const user = users[idx]
    if (!user.active) return res.status(403).json({ error: 'Conta inativa.' })
    if ((user.credits ?? 0) <= 0) return res.status(402).json({ error: 'Sem creditos. Faca upgrade.' })

    const { prompt, contentType = 'faceless', duration = 'medium', voice = 'masculine', platforms = ['youtube'] } = req.body
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt obrigatorio' })

    const openaiKey = process.env.OPENAI_API_KEY || ''
    const elevenKey = process.env.ELEVENLABS_API_KEY || ''
    const pexelsKey = process.env.PEXELS_API_KEY || ''

    let title = prompt.substring(0, 60)
    let script = ''
    let description = ''
    let tags: string[] = []
    let scenes: Array<{text: string, imageQuery: string}> = []
    let audioBase64 = ''
    let images: string[] = []

    // ── STEP 1: GPT-4o gera roteiro estruturado em cenas ──────────────────
    if (openaiKey) {
      const dMap: Record<string,string> = { short: '4 cenas curtas de 10-15s', medium: '6 cenas de 20-30s', long: '8 cenas de 30-45s' }
      const vMap: Record<string,string> = { masculine: 'narrador grave misterioso', feminine: 'narradora feminina misteriosa', neutral: 'narrador neutro', asmr: 'voz sussurrada intensa' }

      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 2000,
            messages: [{
              role: 'system',
              content: `Voce e roteirista de dark channels faceless. Crie roteiro em portugues brasileiro para: ${dMap[duration]}.
Estilo: ${contentType}. Voz: ${vMap[voice]}.
RETORNE APENAS JSON valido:
{
  "title": "titulo clickbait misterioso max 70 chars",
  "description": "descricao para publicacao max 250 chars com call to action",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "narration": "texto completo da narracao sem marcacoes de cena, fluido, envolvente, em primeira pessoa, min 150 palavras",
  "scenes": [
    {"text": "frase exata narrada nesta cena (20-30 palavras)", "imageQuery": "termo em ingles para busca de imagem dark no Pexels"},
    {"text": "...", "imageQuery": "..."}
  ]
}`
            }, {
              role: 'user',
              content: `Dark channel sobre: ${prompt}`
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
            script = p.narration || ''
            scenes = p.scenes || []
          } catch { script = raw; title = prompt.substring(0,60) }
        }
      } catch(e) { console.error('OpenAI error:', e) }
    }

    if (!script) {
      script = `Voce esta prestes a descobrir a verdade sobre ${prompt}. O que voce vai ouvir agora e baseado em fatos reais que poucos conhecem. Prepare-se.`
      scenes = [
        { text: script, imageQuery: 'dark mysterious conspiracy' }
      ]
      tags = ['misterio', 'conspiracao', 'dark channel', 'verdade', 'faceless']
    }

    // ── STEP 2: ElevenLabs gera audio da narracao ─────────────────────────
    if (elevenKey) {
      const voiceId = VOICE_IDS[voice] || VOICE_IDS.masculine
      audioBase64 = await generateAudio(script, voiceId, elevenKey)
    }

    // ── STEP 3: Pexels busca imagens para cada cena ───────────────────────
    if (pexelsKey && scenes.length > 0) {
      const queries = scenes.map(s => s.imageQuery)
      images = await fetchPexelsImages(queries, pexelsKey)
      // Garante ao menos 1 imagem fallback
      if (images.length === 0) images = ['https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg']
    }

    // ── STEP 4: Salva e retorna ───────────────────────────────────────────
    users[idx].credits = Math.max(0, (user.credits ?? 1) - 1)
    users[idx].videoCount = (user.videoCount ?? 0) + 1
    saveUsers(users)

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
      scenes,    // cenas com texto + imageQuery
      images,    // URLs das imagens Pexels
      audioBase64, // narração ElevenLabs em base64
      hasAudio: audioBase64.length > 0,
      hasImages: images.length > 0,
      status: 'ready',
      createdAt: new Date().toISOString(),
    }
    saveVideo(video)

    res.status(200).json({ video, creditsRemaining: users[idx].credits })
  } catch(e: any) {
    console.error('Generate error:', e)
    res.status(500).json({ error: 'Erro ao gerar. Tente novamente.' })
  }
}