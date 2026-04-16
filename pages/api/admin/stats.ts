import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, getVideos } from '../../../lib/db'

const JWT = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Token necessario' })
  let d: any
  try { d = jwt.verify(token, JWT) } catch { return res.status(401).json({ error: 'invalido' }) }
  if (d.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' })

  const users = await getUsers()
  const videos = await getVideos()
  const rev: Record<string, number> = { starter: 47, pro: 97, enterprise: 297 }

  const mrr = users
    .filter((u: any) => u.active && u.plan && u.plan !== 'free')
    .reduce((s: number, u: any) => s + (rev[u.plan] || 0), 0)

  const today = new Date().toDateString()
  const videosToday = videos.filter((v: any) => new Date(v.createdAt).toDateString() === today).length

  // Videos per day last 7 days
  const videosByDay: Record<string,number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('pt-BR', { weekday:'short', day:'numeric' })
    videosByDay[key] = 0
  }
  videos.forEach((v: any) => {
    const date = new Date(v.createdAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
    if (diffDays <= 6) {
      const key = date.toLocaleDateString('pt-BR', { weekday:'short', day:'numeric' })
      if (key in videosByDay) videosByDay[key]++
    }
  })

  // Users by plan
  const byPlan: Record<string,number> = { free: 0, starter: 0, pro: 0, enterprise: 0 }
  users.forEach((u: any) => { byPlan[u.plan] = (byPlan[u.plan] || 0) + 1 })

  // New users last 7 days
  const newUsers7d = users.filter((u: any) => {
    const diff = (Date.now() - new Date(u.createdAt).getTime()) / 86400000
    return diff <= 7
  }).length

  const activeUsers = users.filter((u: any) => u.active).length

  res.status(200).json({
    stats: { mrr, totalUsers: users.length, activeUsers, videosToday, totalVideos: videos.length, churn: 2.1, newUsers7d, byPlan, videosByDay },
    users: users.map(({ password: _, ...u }: any) => u),
  })
}
