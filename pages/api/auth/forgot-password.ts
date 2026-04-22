import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { getUsers } from '../../../lib/db'
import { rateLimit } from '../../../lib/rateLimit'
import crypto from 'crypto'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown'
  const rl = await rateLimit(`forgot:${ip}`, 3, 300) // 3 per 5 min
  if (!rl.ok) return res.status(429).json({ error: 'Muitas tentativas. Aguarde 5 minutos.' })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email obrigatório' })

  try {
    const users = await getUsers()
    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())

    // Always return success to avoid email enumeration
    if (!user) return res.status(200).json({ ok: true })

    const token = crypto.randomBytes(32).toString('hex')
    await redis.set(`reset:${token}`, user.email, { ex: 3600 }) // 1h TTL

    const appUrl = process.env.NEXTAUTH_URL || 'https://nocturn-ai.vercel.app'
    const resetLink = `${appUrl}/reset-password?token=${token}`

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
          reply_to: 'suporte@nocturn-ai.vercel.app',
          to: [user.email],
          subject: '🔑 Redefinir senha — NOCTURN.AI',
          html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b10;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:28px">
      <div style="display:inline-block;background:linear-gradient(135deg,#ff3c5c,#ff6b35);border-radius:10px;padding:12px 24px">
        <span style="color:#fff;font-size:18px;font-weight:800">NOCTURN.AI</span>
      </div>
    </div>
    <div style="background:#0e1219;border:1px solid #1e2840;border-radius:14px;padding:32px">
      <h1 style="color:#f0f2f8;font-size:20px;font-weight:800;margin:0 0 12px">Redefinir sua senha</h1>
      <p style="color:#8892a4;font-size:14px;line-height:1.7;margin:0 0 24px">
        Olá <strong style="color:#f0f2f8">${user.name || 'usuário'}</strong>,<br>
        recebemos uma solicitação para redefinir a senha da sua conta.
      </p>
      <a href="${resetLink}" style="display:block;text-align:center;background:linear-gradient(135deg,#ff3c5c,#ff6b35);color:#fff;text-decoration:none;padding:14px 28px;border-radius:9px;font-weight:700;font-size:15px;margin-bottom:20px">
        Redefinir minha senha →
      </a>
      <p style="color:#4a5568;font-size:12px;line-height:1.7;margin:0">
        Este link expira em <strong>1 hora</strong>.<br>
        Se você não solicitou a redefinição, ignore este email.
      </p>
    </div>
  </div>
</body></html>`,
        })
      })
    }

    res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('Forgot password error:', e)
    res.status(500).json({ error: 'Erro ao processar solicitação' })
  }
}
