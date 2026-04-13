import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, getVideos, saveVideos, generateId } from '../../../lib/db'
const JWT_SECRET = process.env.JWT_SECRET || 'nocturnai_secret_2025'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const token = req.headers.authorization?.replace('Bearer ','')
  if (!token) return res.status(401).json({ error: 'Token necessario' })
  let decoded: any
  try { decoded = jwt.verify(token, JWT_SECRET) } catch { return res.status(401).json({ error: 'Token invalido' }) }
  const users = getUsers()
  const user = users.find((u: any) => u.id === decoded.id)
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' })
  if ((user.credits || 0) <= 0) return res.status(403).json({ error: 'Creditos insuficientes. Faca upgrade do plano.' })
  const { prompt, contentType, duration, voice, platforms } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt obrigatorio' })
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const durMap: Record<string,string> = { short:'60 segundos', medium:'8 minutos', long:'20 minutos' }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Crie um roteiro para video de ' + (durMap[duration]||'8 minutos') + ' sobre: ' + prompt + '. Retorne APENAS JSON: {"title":"titulo","description":"desc","script":"roteiro","tags":["t1","t2"],"thumbnail_concept":"desc visual"}' }],
      max_tokens: 1000,
    })
    const content = completion.choices[0].message.content || '{}'
    let data: any = {}
    try { data = JSON.parse(content.replace(/```json|```/g,'').trim()) } catch { data = { title: prompt.substring(0,60) } }
    const userIdx = users.findIndex((u: any) => u.id === decoded.id)
    users[userIdx].credits = Math.max(0, (user.credits||20) - 1)
    users[userIdx].videoCount = (user.videoCount||0) + 1
    saveUsers(users)
    const videos = getVideos()
    const newVideo = { id: generateId(), userId: user.id, title: data.title||prompt.substring(0,60), description: data.description||'', script: data.script||'', tags: data.tags||[], contentType, duration, voice, platforms: platforms||['youtube'], status: 'done', createdAt: new Date().toISOString() }
    videos.push(newVideo)
    saveVideos(videos)
    res.status(200).json({ video: newVideo, creditsRemaining: users[userIdx].credits })
  } catch(e: any) { res.status(500).json({ error: 'Erro ao gerar: ' + e.message }) }
}