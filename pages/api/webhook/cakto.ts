import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers, saveUsers, generateId } from '../../../lib/db'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const p = req.body
    const event = p.event || p.type || ''
    const email = p.customer?.email || p.buyer?.email || p.email || ''
    const productName = (p.product?.name || p.offer?.name || '').toLowerCase()
    let plan = 'starter'
    if (productName.includes('pro')) plan = 'pro'
    else if (productName.includes('enterprise')) plan = 'enterprise'
    const credits: Record<string,number> = { starter: 20, pro: 100, enterprise: 99999 }
    const users = getUsers()
    const idx = users.findIndex((u: any) => u.email === email)
    if (event.includes('approved') || event.includes('paid') || event.includes('active')) {
      if (idx === -1) users.push({ id: generateId(), name: email.split('@')[0], email, password: '', plan, credits: credits[plan], role: 'user', active: true, videoCount: 0, createdAt: new Date().toISOString() })
      else { users[idx].active = true; users[idx].plan = plan; users[idx].credits = credits[plan] }
      saveUsers(users)
    }
    if (event.includes('cancel') || event.includes('refund')) {
      if (idx !== -1) { users[idx].active = false; users[idx].credits = 0; saveUsers(users) }
    }
    if (event.includes('renew')) {
      if (idx !== -1) { users[idx].credits = credits[users[idx].plan] || 20; users[idx].active = true; saveUsers(users) }
    }
    res.status(200).json({ ok: true })
  } catch(e: any) { res.status(500).json({ error: e.message }) }
}