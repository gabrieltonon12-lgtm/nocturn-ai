import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, saveVideo, generateId, ensureAdmin } from '../../../lib/db'

// ElevenLabs voice IDs para cada estilo
const VOICE_IDS: Record<string, string> = {
  masculine: 'TxGEqnHWrfWFTfGW9XjX', // Josh — grave masculino
  feminine:  'EXAVITQu4vr4xnSDxMaL', // Bella — feminina misteriosa  
  neutral:   'pNInz6obpgDQGcFmaJgB', // Adam — narrador neutro
  asmr:      'MF3mGyEYCl7XYWbV9V6O', // Elli — sussurrada
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    ensureAdmin()

    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatorio' })
    const token = auth.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'

    let decoded: any
    try { decoded = jwt.verify(token, secret) }
    catch { return res.status(401).json({ error: 'Token invalido ou expirado. Faca login novamente.' }) }

    const users = getUsers()
    const userIdx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)

    if (userIdx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' })
    const user = users[userIdx]
    if (!user.active) return res.status(403).json({ error: 'Conta inativa. Verifique sua assinatura.' })
    if ((user.credits ?? 0) <= 0) return res.status(402).json({ error: 'Sem creditos. Faca upgrade do seu plano.' })

    const { prompt, contentType = 'faceless', duration = 'medium', voice = 'masculine', platforms = ['youtube'] } = req.body
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt obrigatorio' })

    const openaiKey = process.env.OPENAI_API_KEY
    const elevenKey = process.env.ELEVENLABS_API_KEY

    let script = ''
    let title = ''
    let description = ''
    let tags: string[] = []
    let audioUrl = ''
    let audioBase64 = ''

    // ─── STEP 1: GPT-4o gera o roteiro ────────────────────────────────────
    if (openaiKey) {
      try {
        const durationMap: Record<string,string> = {
          short: '30 a 60 segundos',
          medium: '5 a 10 minutos',
          long: '15 a 30 minutos'
        }
        const voiceMap: Record<string,string> = {
          masculine: 'voz grave masculina misteriosa',
          feminine: 'voz feminina misteriosa',
          neutral: 'narrador neutro',
          asmr: 'voz sussurrada ASMR'
        }

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 1500,
            messages: [{
              role: 'system',
              content: `Voce e um roteirista especialista em dark channels faceless para YouTube e TikTok.
Crie roteiros envolventes, misteriosos e que prendem atencao. Sempre em portugues brasileiro.
Estilo: ${contentType}. Voz: ${voiceMap[voice] || 'narrador misterioso'}.
Duracao alvo: ${durationMap[duration] || '5 a 10 minutos'}.

RESPONDA APENAS EM JSON com esta estrutura exata:
{
  "title": "titulo do video (max 70 chars, clickbait misterioso)",
  "script": "roteiro completo narrado em primeira pessoa, sem didascalias, so a fala pura para narrar em voz over. Min 200 palavras.",
  "description": "descricao para YouTube/TikTok com call to action (max 300 chars)",
  "tags": ["tag1","tag2","tag3","tag4","tag5"]
}`
            }, {
              role: 'user',
              content: `Crie um roteiro de dark channel sobre: ${prompt}`
            }]
          })
        })

        if (aiRes.ok) {
          const aiData = await aiRes.json()
          const raw = aiData.choices?.[0]?.message?.content || ''
          const cleaned = raw.replace(/```json/gi,'').replace(/```/g,'').trim()
          try {
            const parsed = JSON.parse(cleaned)
            title = parsed.title || prompt.substring(0, 60)
            script = parsed.script || ''
            description = parsed.description || ''
            tags = parsed.tags || []
          } catch {
            script = raw
            title = prompt.substring(0, 60)
          }
        }
      } catch (e) {
        console.error('OpenAI error:', e)
      }
    }

    // Fallback se OpenAI falhar
    if (!script) {
      title = prompt.substring(0, 60)
      script = `Voce esta prestes a descobrir uma das verdades mais perturbadoras sobre ${prompt}. O que voce vai ouvir agora e baseado em fatos reais que poucos conhecem. Prepare-se para questionar tudo que voce acreditava ser verdade. Compartilhe este video antes que ele seja removido.`
      tags = ['conspiração', 'mistério', 'verdade', 'dark channel', 'faceless']
    }

    // ─── STEP 2: ElevenLabs sintetiza o audio ────────────────────────────
    if (elevenKey && script) {
      try {
        const voiceId = VOICE_IDS[voice] || VOICE_IDS.masculine
        // Usar apenas os primeiros ~800 chars para o audio (limite de API no plano free)
        const scriptForAudio = script.substring(0, 800)

        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text: scriptForAudio,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: voice === 'asmr' ? 0.85 : 0.5,
              similarity_boost: 0.8,
              style: voice === 'masculine' ? 0.6 : 0.4,
              use_speaker_boost: true,
            }
          })
        })

        if (elRes.ok) {
          // Convert audio buffer to base64 to send to client
          const arrayBuffer = await elRes.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          let binary = ''
          uint8Array.forEach(b => { binary += String.fromCharCode(b) })
          audioBase64 = 'data:audio/mpeg;base64,' + Buffer.from(arrayBuffer).toString('base64')
          console.log('ElevenLabs audio generated:', arrayBuffer.byteLength, 'bytes')
        } else {
          const errText = await elRes.text()
          console.error('ElevenLabs error:', elRes.status, errText)
        }
      } catch (e) {
        console.error('ElevenLabs error:', e)
      }
    }

    // ─── STEP 3: Salva e retorna ──────────────────────────────────────────
    users[userIdx].credits = Math.max(0, (user.credits ?? 1) - 1)
    users[userIdx].videoCount = (user.videoCount ?? 0) + 1
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
      audioBase64, // audio narrado pelo ElevenLabs
      status: 'ready',
      createdAt: new Date().toISOString(),
    }
    saveVideo(video)

    res.status(200).json({
      video,
      creditsRemaining: users[userIdx].credits,
    })
  } catch (e: any) {
    console.error('Generate error:', e)
    res.status(500).json({ error: 'Erro ao gerar video. Tente novamente.' })
  }
}