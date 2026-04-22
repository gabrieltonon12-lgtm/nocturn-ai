import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../../../lib/auth'
import { getUsers } from '../../../lib/db'

const JWT = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Token obrigatório' })
  let decoded: any
  try { decoded = jwt.verify(token, JWT) } catch { return res.status(401).json({ error: 'Token inválido' }) }

  const users = await getUsers()
  const user = users.find((u: any) => u.id === decoded.id || u.email === decoded.email)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

  // Count how many users were referred by this user
  const referralCode = user.referralCode || user.id.substring(0, 8).toUpperCase()
  const referred = users.filter((u: any) => u.referredBy === referralCode)

  res.status(200).json({
    referralCode,
    referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nocturn-ai.vercel.app'}/register?ref=${referralCode}`,
    referredCount: referred.length,
    creditsEarned: referred.length * 5,
  })
}
