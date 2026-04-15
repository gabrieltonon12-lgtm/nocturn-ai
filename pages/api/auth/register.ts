import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getUsers, saveUsers, generateId, ensureAdmin } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    ensureAdmin()
    const { name, email, password, plan = 'starter' } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha obrigatórios' })
    if (password.length < 6) return res.status(400).json({ error: 'Senha mínimo 6 caracteres' })
    
    const users = getUsers()
    if (users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }
    
    const hashed = await bcrypt.hash(password, 10)
    const user = {
      id: generateId(), name, email,
      password: hashed,
      plan: 'free', credits: 0,
      role: 'user', active: true,
      videoCount: 0,
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    saveUsers(users)
    
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan: user.plan }, secret, { expiresIn: '30d' })
    
    res.status(201).json({ token, user: { id:user.id, name:user.name, email:user.email, plan:user.plan, credits:user.credits, role:user.role } })
  } catch (e: any) {
    console.error('Register error:', e)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
}