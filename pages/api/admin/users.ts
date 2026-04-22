import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUser, deleteUser } from '../../../lib/db'

const JWT = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'

function auth(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return false
  try { const d: any = jwt.verify(token, JWT); return d.role === 'admin' }
  catch { return false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!auth(req)) return res.status(403).json({ error: 'Acesso negado' })

  const users = await getUsers()

  if (req.method === 'GET') {
    return res.status(200).json({ users: users.map(({ password: _, ...u }: any) => u) })
  }

  if (req.method === 'POST') {
    const { action, userId, value } = req.body
    const idx = users.findIndex((u: any) => u.id === userId)
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' })

    switch (action) {
      case 'ban':
        users[idx].active = false
        break
      case 'unban':
        users[idx].active = true
        break
      case 'change_plan': {
        const planCredits: Record<string,number> = { starter: 20, pro: 100, enterprise: 99999, free: 1 }
        users[idx].plan = value
        users[idx].credits = planCredits[value] ?? 20
        break
      }
      case 'reset_credits': {
        const planCredits: Record<string,number> = { starter: 20, pro: 100, enterprise: 99999, free: 1 }
        users[idx].credits = planCredits[users[idx].plan] ?? 20
        break
      }
      case 'add_credits':
        users[idx].credits = (users[idx].credits ?? 0) + (parseInt(value) || 10)
        break
      case 'delete':
        await deleteUser(users[idx].id, users[idx].email)
        return res.status(200).json({ ok: true })
      default:
        return res.status(400).json({ error: 'Ação inválida' })
    }

    await saveUser(users[idx])
    return res.status(200).json({ ok: true, user: { ...users[idx], password: undefined } })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
