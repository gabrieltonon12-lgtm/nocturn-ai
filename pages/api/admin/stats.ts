import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, getVideos } from '../../../lib/db'

const JWT = process.env.JWT_SECRET || 'nocturnai_secret_2025'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Token necessario' })
  let d: any
  try { d = jwt.verify(token, JWT) } catch { return res.status(401).json({ error: 'invalido' }) }
  if (d.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' })

  const users = await getUsers()
  const videos = await getVideos()
  const rev: Record<string, number> = { starter: 47, pro: 97, enterprise: 297 }
  const mrr = users.filter((u: any) => u.active).reduce((s: number, u: any) => s + (rev[u.plan] || 0), 0)
  const today = new Date().toDateString()
  const videosToday = videos.filter((v: any) => new Date(v.createdAt).toDateString() === today).length
  res.status(200).json({
    stats: { mrr, totalUsers: users.length, videosToday, churn: 2.1 },
    users: users.map(({ password: _, ...u }: any) => u),
  })
}
