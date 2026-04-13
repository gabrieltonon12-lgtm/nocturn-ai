import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers, saveUsers, generateId, ensureAdmin } from '../../../lib/db'

const PIXEL_ID = 'D7END4RC77U8N8PUBHCG'
const ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899'

// Fire TikTok CompletePayment event server-side — this makes the pixel
// show "Subscribe" and "CompletePayment" events in TikTok Ads Manager
// so the campaign can optimize for purchases
async function fireTikTokPurchaseEvent(email: string, value: number, plan: string, ip: string, userAgent: string) {
  try {
    const { createHash } = await import('crypto')
    const payload = {
      pixel_code: PIXEL_ID,
      event: 'CompletePayment',
      event_id: `purchase_${Date.now()}`,
      timestamp: new Date().toISOString(),
      context: {
        page: { url: 'https://nocturn-ai.vercel.app/dashboard' },
        ip,
        user_agent: userAgent,
        user: {
          email: createHash('sha256').update(email.toLowerCase().trim()).digest('hex'),
        },
      },
      properties: {
        currency: 'BRL',
        value,
        content_id: plan,
        content_type: 'product',
        content_name: `NOCTURN.AI ${plan}`,
      },
    }
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: { 'Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [payload] }),
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
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b10;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-flex;align-items:center;gap:10px;background:#0e1219;border:1px solid #1e2840;border-radius:12px;padding:12px 24px">
        <div style="width:32px;height:32px;background:linear-gradient(135deg,#ff3c5c,#ff6b35);border-radius:8px;display:inline-block;text-align:center;line-height:32px">
          <span style="color:#fff;font-size:12px;font-weight:800">DC</span>
        </div>
        <span style="color:#f0f2f8;font-size:18px;font-weight:800;letter-spacing:.5px">NOCTURN.AI</span>
      </div>
    </div>
    <div style="background:#0e1219;border:1px solid #1e2840;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,rgba(255,60,92,.15),rgba(124,58,237,.1));padding:28px 32px;border-bottom:1px solid #1e2840">
        <h1 style="color:#f0f2f8;font-size:22px;font-weight:800;margin:0 0 6px">Seu acesso está pronto! 🎉</h1>
        <p style="color:#8892a4;font-size:14px;margin:0">Olá <strong style="color:#f0f2f8">${name}</strong>, bem-vindo ao NOCTURN.AI!</p>
      </div>
      <div style="padding:28px 32px">
        <div style="background:#141920;border:1px solid rgba(255,60,92,.15);border-radius:10px;padding:18px;margin-bottom:20px;text-align:center">
          <div style="font-size:10px;color:#4a5568;letter-spacing:2px;text-transform:uppercase;font-family:monospace;margin-bottom:10px">Plano Ativado</div>
          <div style="font-size:18px;font-weight:800;color:#ff3c5c;margin-bottom:4px">${planNames[plan]||plan}</div>
          <div style="font-size:28px;font-weight:800;color:#f0f2f8">${planCredits[plan]||20}</div>
          <div style="font-size:12px;color:#8892a4">créditos/mês — 1 crédito = 1 vídeo completo</div>
        </div>
        <div style="background:#141920;border:1px solid #1e2840;border-radius:10px;padding:18px;margin-bottom:24px">
          <div style="font-size:10px;color:#4a5568;letter-spacing:2px;text-transform:uppercase;font-family:monospace;margin-bottom:14px">Dados de Acesso</div>
          <div style="margin-bottom:10px"><span style="color:#8892a4;font-size:13px">📧 Email: </span><span style="color:#f0f2f8;font-size:13px;font-weight:600">${email}</span></div>
          <div><span style="color:#8892a4;font-size:13px">🔑 Senha: </span><span style="background:rgba(255,60,92,.1);border:1px solid rgba(255,60,92,.2);color:#ff3c5c;font-size:13px;font-weight:700;font-family:monospace;padding:4px 10px;border-radius:6px">${password}</span></div>
          <div style="margin-top:12px;padding:10px;background:rgba(255,176,32,.05);border:1px solid rgba(255,176,32,.15);border-radius:8px">
            <p style="color:#ffb020;font-size:11px;margin:0">⚠️ Guarde sua senha. Recomendamos alterar após o primeiro acesso.</p>
          </div>
        </div>
        <a href="https://nocturn-ai.vercel.app/login" style="display:block;text-align:center;background:linear-gradient(135deg,#ff3c5c,#ff6b35);color:#fff;text-decoration:none;padding:16px 32px;border-radius:10px;font-weight:700;font-size:16px;margin-bottom:20px">
          Acessar meu dashboard →
        </a>
        <div style="border-top:1px solid #1e2840;padding-top:16px">
          <p style="color:#4a5568;font-size:12px;margin:0;line-height:1.8">
            🎬 Gere seu primeiro dark channel agora<br>
            📱 Publique no YouTube, TikTok e Instagram<br>
            💬 Dúvidas? Responda este email
          </p>
        </div>
      </div>
    </div>
    <p style="color:#4a5568;font-size:11px;text-align:center;margin-top:20px">© 2025 NOCTURN.AI · <a href="https://nocturn-ai.vercel.app" style="color:#ff3c5c;text-decoration:none">nocturn-ai.vercel.app</a></p>
  </div>
</body>
</html>`

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
    const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || ''
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
        if (!users[idx].password || users[idx].password === '') {
          users[idx].password = bcrypt.hashSync(tempPassword, 10)
        }
      }
      saveUsers(users)

      // Fire TikTok CompletePayment — creates the event in Ads Manager
      if (email) {
        await fireTikTokPurchaseEvent(email, planPrices[plan] || 47, plan, ip, userAgent)
      }

      await sendWelcomeEmail(email, name, plan, isNew ? tempPassword : '(use sua senha cadastrada)')
      console.log('Activated:', email, plan)
    }

    if (event.includes('cancel') || event.includes('refund') || event.includes('chargeback')) {
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