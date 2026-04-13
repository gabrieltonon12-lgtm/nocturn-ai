import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, saveVideo, generateId, ensureAdmin } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  try {
    ensureAdmin()
    
    // Auth
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatório' })
    const token = auth.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    
    let decoded: any
    try {
      decoded = jwt.verify(token, secret)
    } catch {
      return res.status(401).json({ error: 'Token inválido ou expirado. Faça login novamente.' })
    }
    
    const users = getUsers()
    const userIdx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    
    if (userIdx === -1) {
      // User not in this instance's /tmp — re-create from JWT data for this session
      // This handles the serverless cold-start issue
      const tempUser = {
        id: decoded.id,
        name: decoded.name || decoded.email?.split('@')[0] || 'User',
        email: decoded.email,
        plan: decoded.plan || 'pro',
        credits: 50,
        role: decoded.role || 'user',
        active: true,
        videoCount: 0,
        createdAt: new Date().toISOString(),
      }
      users.push(tempUser)
      saveUsers(users)
    }
    
    const user = users[userIdx === -1 ? users.length - 1 : userIdx]
    
    if (!user.active) return res.status(403).json({ error: 'Conta inativa. Verifique sua assinatura.' })
    if ((user.credits ?? 0) <= 0) return res.status(402).json({ error: 'Sem créditos. Faça upgrade do seu plano.' })
    
    const { prompt, contentType = 'faceless', duration = 'medium', voice = 'masculine', platforms = ['youtube'] } = req.body
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt obrigatório' })
    
    // Generate script with OpenAI
    const openaiKey = process.env.OPENAI_API_KEY
    let script = ''
    let title = ''
    let description = ''
    let tags: string[] = []
    
    if (openaiKey) {
      try {
        const durationMap: Record<string,string> = { short:'30 a 60 segundos', medium:'5 a 10 minutos', long:'15 a 30 minutos' }
        const voiceMap: Record<string,string> = { masculine:'voz grave masculina misteriosa', feminine:'voz feminina misteriosa', neutral:'narrador neutro', asmr:'voz sussurrada ASMR' }
        
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 1500,
            messages: [{
              role: 'system',
              content: 'Você é um especialista em criar roteiros para dark channels no YouTube e TikTok. Crie roteiros envolventes, misteriosos e otimizados para engajamento. Responda APENAS em JSON válido sem markdown.'
            }, {
              role: 'user',
              content: `Crie um roteiro completo para dark channel sobre: "${prompt}"
Tipo: ${contentType} | Duração: ${durationMap[duration]} | Voz: ${voiceMap[voice]}

Responda APENAS com este JSON (sem markdown):
{
  "title": "título chamativo para YouTube (máx 60 chars)",
  "script": "roteiro completo narrado para ${durationMap[duration]}",
  "description": "descrição YouTube com SEO (200 chars)",
  "tags": ["tag1","tag2","tag3","tag4","tag5"]
}`
            }]
          })
        })
        const aiData = await aiRes.json()
        const raw = aiData.choices?.[0]?.message?.content || '{}'
        const clean = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        title = parsed.title || prompt.substring(0, 60)
        script = parsed.script || ''
        description = parsed.description || ''
        tags = parsed.tags || []
      } catch (e) {
        console.error('OpenAI error:', e)
        title = prompt.substring(0, 60)
        script = `Roteiro gerado para: ${prompt}\n\nEste é um dark channel sobre ${contentType}. O vídeo terá duração de ${duration} com ${voice}.\n\nConteúdo completo seria gerado pela IA aqui...`
      }
    } else {
      title = prompt.substring(0, 60)
      script = `[Demo] Roteiro para: ${prompt}\n\nConfigue OPENAI_API_KEY para gerar roteiros reais.`
    }
    
    // Decrement credits
    users[userIdx === -1 ? users.length - 1 : userIdx].credits = (user.credits ?? 1) - 1
    users[userIdx === -1 ? users.length - 1 : userIdx].videoCount = (user.videoCount ?? 0) + 1
    saveUsers(users)
    
    // Save video
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
      status: 'ready',
      createdAt: new Date().toISOString(),
    }
    saveVideo(video)
    
    res.status(200).json({
      video,
      creditsRemaining: users[userIdx === -1 ? users.length - 1 : userIdx].credits,
    })
  } catch (e: any) {
    console.error('Generate error:', e)
    res.status(500).json({ error: 'Erro ao gerar vídeo. Tente novamente.' })
  }
}