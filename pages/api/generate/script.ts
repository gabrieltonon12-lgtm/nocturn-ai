import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, ensureAdmin } from '../../../lib/db'
import { rateLimit } from '../../../lib/rateLimit'

const CONTENT_TONE: Record<string,string> = {
  faceless:'narrador grave e misterioso, tom de documentário sombrio',
  educational:'narrador educativo e claro, tom de documentário informativo',
  inspirational:'narrador motivacional e empolgante, tom positivo e encorajador',
  religious:'narrador reverente e acolhedor, tom espiritual e reflexivo',
  news:'narrador jornalístico e direto, tom informativo e objetivo',
  mystery:'narrador intrigante e suspense, tom de investigação',
  truecrime:'narrador sério e investigativo, tom de true crime',
  finance:'narrador confiante e direto, tom de educação financeira',
  nature:'narrador contemplativo e encantado, tom de documentário natural',
  sports:'narrador empolgante e dinâmico, tom esportivo',
  food:'narrador caloroso e apaixonado, tom gastronômico',
  horror:'narrador tenso e assustador, tom de terror psicológico',
  asmr:'narrador suave e sussurrado, tom relaxante',
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
    catch { return res.status(401).json({ error: 'Token invalido' }) }

    const users = await getUsers()
    const user = users.find((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' })
    if (!user.active) return res.status(403).json({ error: 'Conta inativa' })
    if ((user.credits ?? 0) <= 0) return res.status(402).json({ error: 'Sem creditos. Faca upgrade.' })

    // Rate limit: 10 previews per hour per user
    const rl = await rateLimit(`script:${user.id}`, 10, 3600)
    if (!rl.ok) return res.status(429).json({ error: 'Muitas gerações. Aguarde um momento.' })

    const { prompt, contentType = 'faceless', duration = 'medium', voice = 'masculine' } = req.body
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt obrigatorio' })

    const openaiKey = process.env.OPENAI_API_KEY || ''
    if (!openaiKey) return res.status(500).json({ error: 'OpenAI não configurado' })

    const dMap: Record<string,string> = { short:'4 cenas curtas de 10-15s', medium:'6 cenas de 20-30s', long:'8 cenas de 30-45s' }
    const tone = CONTENT_TONE[contentType] || 'narrador envolvente, tom de documentário'

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2500,
        messages: [{
          role: 'system',
          content: `Você é roteirista profissional especialista em vídeos virais no YouTube.
REGRA: O roteiro DEVE ser EXATAMENTE sobre o tema informado. Nunca desvie.
Escreva em português brasileiro fluido. Estrutura: ${dMap[duration]||'6 cenas'}. Tom: ${tone}.
Cada cena: 25-40 palavras, frases completas, sem [marcações de palco].
imageQuery em inglês para Pexels, específico e relevante ao tema.
RETORNE APENAS JSON válido sem markdown:
{"title":"...","description":"...","tags":["..."],"scenes":[{"text":"...","imageQuery":"..."}]}`
        }, {
          role: 'user',
          content: `Crie o roteiro sobre: ${prompt}`
        }]
      })
    })

    if (!aiRes.ok) return res.status(500).json({ error: 'Erro ao gerar roteiro' })
    const raw = (await aiRes.json()).choices?.[0]?.message?.content || ''
    const parsed = JSON.parse(raw.replace(/```json/gi,'').replace(/```/g,'').trim())

    res.status(200).json({
      title: parsed.title || prompt.substring(0,60),
      description: parsed.description || '',
      tags: parsed.tags || [],
      scenes: parsed.scenes || [],
    })
  } catch (e: any) {
    console.error('Script preview error:', e)
    res.status(500).json({ error: 'Erro ao gerar roteiro. Tente novamente.' })
  }
}
