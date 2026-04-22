import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import bcrypt from 'bcryptjs'
import { getUsers, saveUser } from '../../../lib/db'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'Token e senha obrigatórios' })
  if (password.length < 6) return res.status(400).json({ error: 'Senha mínimo 6 caracteres' })

  try {
    const email = await redis.get<string>(`reset:${token}`)
    if (!email) return res.status(400).json({ error: 'Link inválido ou expirado. Solicite um novo.' })

    const users = await getUsers()
    const idx = users.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' })

    users[idx].password = await bcrypt.hash(password, 10)
    await saveUser(users[idx])
    await redis.del(`reset:${token}`)

    res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('Reset password error:', e)
    res.status(500).json({ error: 'Erro ao redefinir senha' })
  }
}
