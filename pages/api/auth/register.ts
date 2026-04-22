import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Redis } from '@upstash/redis'
import { getUsers, saveUser, generateId, ensureAdmin } from '../../../lib/db'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function sendVerificationEmail(email: string, name: string, token: string) {
  const resendKey = process.env.RESEND_API_KEY || ''
  if (!resendKey) return
  const link = `${process.env.NEXT_PUBLIC_APP_URL || 'https://nocturn-ai.vercel.app'}/api/auth/verify?token=${token}`
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
      to: email,
      subject: 'Confirme seu email — NOCTURN.AI',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#05080F;color:#ECF2FA;padding:32px;border-radius:12px">
        <div style="font-size:22px;font-weight:800;margin-bottom:8px">NOCTURN.AI</div>
        <p>Olá, ${name}!</p>
        <p>Clique no botão abaixo para confirmar seu email e ativar sua conta:</p>
        <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;margin:16px 0">
          Confirmar Email
        </a>
        <p style="color:#6E8099;font-size:12px">O link expira em 24 horas. Se você não criou uma conta, ignore este email.</p>
      </div>`,
    }),
  }).catch(e => console.error('Verify email error:', e))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await ensureAdmin()
    const { name, email, password, plan = 'starter', ref } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha obrigatórios' })
    if (password.length < 6) return res.status(400).json({ error: 'Senha mínimo 6 caracteres' })

    const users = await getUsers()
    if (users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const userId = generateId()
    const referralCode = userId.substring(0, 8).toUpperCase()
    const user = {
      id: userId, name, email,
      password: hashed,
      plan: 'free', credits: 1,  // 1 vídeo grátis para ativar o usuário
      role: 'user', active: true,
      verified: false,
      videoCount: 0,
      referralCode,
      referredBy: ref || null,
      createdAt: new Date().toISOString(),
    }
    await saveUser(user)

    // Reward referrer +5 credits
    if (ref) {
      const referrerIdx = users.findIndex((u: any) => u.referralCode === ref)
      if (referrerIdx !== -1) {
        users[referrerIdx].credits = (users[referrerIdx].credits ?? 0) + 5
        await saveUser(users[referrerIdx])
      }
    }

    // Send verification email (async, don't block registration)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    await redis.set(`verify:${verifyToken}`, email, { ex: 86400 }) // 24h TTL
    sendVerificationEmail(email, name, verifyToken).catch(() => {})

    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan: user.plan }, secret, { expiresIn: '30d' })

    res.status(201).json({ token, user: { id:user.id, name:user.name, email:user.email, plan:user.plan, credits:user.credits, role:user.role, verified:false } })
  } catch (e: any) {
    console.error('Register error:', e)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
}