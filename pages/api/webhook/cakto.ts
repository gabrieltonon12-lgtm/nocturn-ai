import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers, saveUsers, generateId, ensureAdmin } from '../../../lib/db'

const FB_PIXEL_ID = '1253914883109476'
const FB_ACCESS_TOKEN = 'EAASpHpI4sXABRLt0ZBKS6oKZB0btCx9f0zcSZAM1yV1FmYYMtIjBNf8Y7ZCEJDYTS5JQJnzZAUtvt5YKU5obJZCwOOwq0RZA5IEtkyffgEpzPyZAVYWUiWlzoQWtPU8tD1JaAeUEriQajaYqpKUAFCQcBzUWdAubNZCieFIWZCZAljLzZAC1PNeR59zNzQ8Jx6n9ZAQZDZD'
const TIKTOK_PIXEL_ID = 'D7END4RC77U8N8PUBHCG'
const TIKTOK_ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899'

async function fireFacebookPurchase(email: string, value: number, plan: string) {
  try {
    const { createHash } = await import('crypto')
    const emailHash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: { em: [emailHash] },
        custom_data: {
          currency: 'BRL',
          value,
          content_name: `NOCTURN.AI ${plan}`,
          content_type: 'product',
        }
      }]
    }
    const res = await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    console.log('Facebook Purchase fired:', data?.events_received, data?.error?.message || 'ok')
  } catch(e) { console.error('Facebook pixel error:', e) }
}

async function fireTikTokPurchase(email: string, value: number, plan: string, ip: string, userAgent: string) {
  try {
    const { createHash } = await import('crypto')
    const emailHash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      data: [{
        type: 'track',
        event: 'CompletePayment',
        event_id: `purchase_${Date.now()}`,
        timestamp: new Date().toISOString(),
        context: {
          page: { url: 'https://nocturn-ai.vercel.app/dashboard' },
          ip, user_agent: userAgent,
          user: { email: emailHash },
        },
        properties: {
          currency: 'BRL', value,
          content_id: plan, content_type: 'product',
          content_name: `NOCTURN.AI ${plan}`,
        }
      }]
    }
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: { 'Access-Token': TIKTOK_ACCESS_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    console.log('TikTok CompletePayment fired:', data?.code, data?.message)
  } catch(e) { console.error('TikTok pixel error:', e) }
}

async function sendWelcomeEmail(email: string, name: string, plan: string, password: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) { console.log('No RESEND_API_KEY'); return }
  const planNames: Record<string,string> = {
    starter: 'Starter — 20 vídeos/mês',
    pro: 'Pro — 100 vídeos/mês',
    enterprise: 'Enterprise — Ilimitado',
  }
  const planCredits: Record<string,number> = { starter:20, pro:100, enterprise:999 }
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b10;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:28px">
      <div style="display:inline-block;background:linear-gradient(135deg,#ff3c5c,#ff6b35);border-radius:10px;padding:12px 24px">
        <span style="color:#fff;font-size:18px;font-weight:800">NOCTURN.AI</span>
      </div>
    </div>
    <div style="background:#0e1219;border:1px solid #1e2840;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg,rgba(255,60,92,.15),rgba(124,58,237,.1));padding:24px 28px;border-bottom:1px solid #1e2840">
        <h1 style="color:#f0f2f8;font-size:20px;font-weight:800;margin:0 0 6px">Seu acesso está pronto! 🎉</h1>
        <p style="color:#8892a4;font-size:14px;margin:0">Olá <strong style="color:#f0f2f8">${name}</strong>, bem-vindo!</p>
      </div>
      <div style="padding:24px 28px">
        <div style="background:#141920;border:1px solid rgba(255,60,92,.15);border-radius:10px;padding:16px;margin-bottom:18px;text-align:center">
          <div style="font-size:12px;color:#4a5568;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Plano Ativado</div>
          <div style="font-size:16px;font-weight:800;color:#ff3c5c">${planNames[plan]||plan}</div>
          <div style="font-size:28px;font-weight:800;color:#f0f2f8;margin-top:4px">${planCredits[plan]||20}</div>
          <div style="font-size:12px;color:#8892a4">créditos/mês</div>
        </div>
        <div style="background:#141920;border:1px solid #1e2840;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="font-size:12px;color:#4a5568;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Dados de Acesso</div>
          <div style="margin-bottom:8px"><span style="color:#8892a4;font-size:13px">Email: </span><span style="color:#f0f2f8;font-size:13px;font-weight:600">${email}</span></div>
          <div><span style="color:#8892a4;font-size:13px">Senha: </span><span style="background:rgba(255,60,92,.1);color:#ff3c5c;font-size:13px;font-weight:700;padding:3px 8px;border-radius:5px">${password}</span></div>
        </div>
        <a href="https://nocturn-ai.vercel.app/login" style="display:block;text-align:center;background:linear-gradient(135deg,#ff3c5c,#ff6b35);color:#fff;text-decoration:none;padding:14px 28px;border-radius:9px;font-weight:700;font-size:15px;margin-bottom:16px">
          Acessar meu dashboard →
        </a>
        <p style="color:#4a5568;font-size:12px;line-height:1.7;margin:0">
          Dúvidas? Responda este email · suporte@sonorem.com
        </p>
      </div>
    </div>
  </div>
</body></html>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NOCTURN.AI <noreply@sonorem.com>',
        reply_to: 'suporte@sonorem.com',
        to: [email],
        subject: '🎉 Seu acesso ao NOCTURN.AI está pronto!',
        html,
      })
    })
    console.log('Welcome email sent to', email)
  } catch(e) { console.error('Email error:', e) }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    ensureAdmin()
    const p = req.body
    const event = (p.event || p.type || p.status || '').toLowerCase()
    const email = p.customer?.email || p.buyer?.email || p.email || ''
    const name = p.customer?.name || p.buyer?.name || email.split('@')[0] || 'Usuário'
    const productName = (p.product?.name || p.offer?.name || p.plan || '').toLowerCase()
    const ip = req.headers['x-forwarded-for']?.toString()?.split(',')[0] || req.socket.remoteAddress || ''
    const userAgent = req.headers['user-agent'] || ''

    let plan = 'starter'
    if (productName.includes('pro')) plan = 'pro'
    else if (productName.includes('enterprise')) plan = 'enterprise'

    const planPrices: Record<string,number> = { starter:47, pro:97, enterprise:297 }
    const credits: Record<string,number> = { starter:20, pro:100, enterprise:99999 }
    const users = getUsers()
    const idx = users.findIndex((u: any) => u.email === email)

    if (event.includes('approved') || event.includes('paid') || event.includes('active') || event.includes('complete')) {
      const bcrypt = require('bcryptjs')
      const isNew = idx === -1
      const tempPassword = Math.random().toString(36).substring(2,8).toUpperCase() + Math.floor(Math.random()*100)

      if (isNew) {
        users.push({
          id: generateId(), name, email,
          password: bcrypt.hashSync(tempPassword, 10),
          plan, credits: credits[plan], role: 'user',
          active: true, videoCount: 0,
          createdAt: new Date().toISOString(),
        })
      } else {
        users[idx].active = true
        users[idx].plan = plan
        users[idx].credits = credits[plan]
      }
      saveUsers(users)

      // Fire pixels
      if (email) {
        await Promise.all([
          fireFacebookPurchase(email, planPrices[plan] || 47, plan),
          fireTikTokPurchase(email, planPrices[plan] || 47, plan, ip, userAgent),
        ])
      }

      await sendWelcomeEmail(email, name, plan, isNew ? tempPassword : '(use sua senha cadastrada)')
      console.log('Activated:', email, plan)
    }

    if (event.includes('cancel') || event.includes('refund')) {
      if (idx !== -1) { users[idx].active = false; users[idx].credits = 0; saveUsers(users) }
    }

    if (event.includes('renew') || event.includes('rebill')) {
      if (idx !== -1) { users[idx].credits = credits[users[idx].plan] || 20; users[idx].active = true; saveUsers(users) }
    }

    res.status(200).json({ ok: true })
  } catch(e: any) {
    console.error('Webhook error:', e)
    res.status(500).json({ error: e.message })
  }
}