import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, generateId } from '../../../lib/db'
const JWT_SECRET = process.env.JWT_SECRET || 'nocturnai_secret_2025'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { name, email, password, plan } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatorios' })
  const users = getUsers()
  if (users.find((u: any) => u.email === email)) return res.status(400).json({ error: 'Email ja cadastrado' })
  const hashedPassword = await bcrypt.hash(password, 10)
  const planCredits: Record<string,number> = { starter: 20, pro: 100, enterprise: 99999 }
  const newUser = { id: generateId(), name, email, password: hashedPassword, plan: plan || 'starter', credits: planCredits[plan] || 20, role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user', active: false, videoCount: 0, createdAt: new Date().toISOString() }
  users.push(newUser)
  saveUsers(users)
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' })
  const { password: _, ...u } = newUser
  res.status(201).json({ token, user: u })
}