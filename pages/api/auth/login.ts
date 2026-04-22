import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../../../lib/auth'
import bcrypt from 'bcryptjs'
import { getUsers, ensureAdmin } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  try {
    await ensureAdmin()
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })

    const users = await getUsers()
    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' })
    if (!user.active) return res.status(403).json({ error: 'Conta inativa. Verifique sua assinatura.' })
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou senha incorretos' })
    
    const secret = process.env.JWT_SECRET!
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '30d' })
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
        role: user.role,
      }
    })
  } catch (e: any) {
    console.error('Login error:', e)
    res.status(500).json({ error: 'Erro interno. Tente novamente.' })
  }
}