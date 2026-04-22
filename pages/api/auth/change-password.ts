import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/auth'
import { getUserById, saveUser } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatório' })
  let decoded: any
  try { decoded = verifyToken(auth.split(' ')[1]) } catch { return res.status(401).json({ error: 'Token inválido' }) }

  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Campos obrigatórios' })
  if (newPassword.length < 6) return res.status(400).json({ error: 'Senha mínima: 6 caracteres' })

  try {
    const bcrypt = require('bcryptjs')
    const user = await getUserById(decoded.id)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    if (user.password && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Senha atual incorreta' })
    }
    user.password = bcrypt.hashSync(newPassword, 10)
    await saveUser(user)
    res.status(200).json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
