import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { getUsers, saveUser } from '../../../lib/db'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end()

  const token = (req.query.token || req.body?.token) as string
  if (!token) return res.status(400).json({ error: 'Token obrigatório' })

  const email = await redis.get<string>(`verify:${token}`)
  if (!email) return res.status(400).json({ error: 'Link inválido ou expirado' })

  const users = await getUsers()
  const idx = users.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase())
  if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' })

  users[idx].verified = true
  await saveUser(users[idx])
  await redis.del(`verify:${token}`)

  res.status(200).json({ ok: true, message: 'Email verificado com sucesso!' })
}
