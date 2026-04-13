import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUsers } from '../../../lib/db'
const JWT_SECRET = process.env.JWT_SECRET || 'nocturnai_secret_2025'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatorios' })
  const users = getUsers()
  const user = users.find((u: any) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Email ou senha incorretos' })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' })
  const { password: _, ...u } = user
  res.status(200).json({ token, user: u })
}