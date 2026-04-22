import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../../lib/auth'
import { getVideos, ensureAdmin } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  
  try {
    await ensureAdmin()
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatório' })
    const token = auth.split(' ')[1]
    const secret = process.env.JWT_SECRET!

    let decoded: any
    try {
      decoded = jwt.verify(token, secret)
    } catch {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const videos = await getVideos(decoded.id)
    res.status(200).json({ videos })
  } catch (e: any) {
    console.error('Videos error:', e)
    res.status(500).json({ error: 'Erro ao buscar vídeos' })
  }
}