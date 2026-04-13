import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getVideos } from '../../lib/db'
const JWT_SECRET = process.env.JWT_SECRET || 'nocturnai_secret_2025'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Token necessario' })
  let decoded: any
  try { decoded = jwt.verify(token, JWT_SECRET) } catch { return res.status(401).json({ error: 'Token invalido' }) }
  const videos = getVideos()
  const userVideos = decoded.role === 'admin' ? videos : videos.filter((v: any) => v.userId === decoded.id)
  res.status(200).json({ videos: userVideos.reverse() })
}