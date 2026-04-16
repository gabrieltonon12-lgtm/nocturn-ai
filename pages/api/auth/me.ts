import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatorio' })
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    let decoded: any
    try { decoded = jwt.verify(auth.split(' ')[1], secret) }
    catch { return res.status(401).json({ error: 'Token invalido' }) }

    const users = await getUsers()
    const user = users.find((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' })

    res.status(200).json({
      user: {
        id: user.id, name: user.name, email: user.email,
        plan: user.plan, credits: user.credits, role: user.role,
        videoCount: user.videoCount,
        youtube: user.youtube ? {
          channelId: user.youtube.channelId,
          channelTitle: user.youtube.channelTitle,
          channelThumb: user.youtube.channelThumb,
          connectedAt: user.youtube.connectedAt,
        } : null,
      }
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
