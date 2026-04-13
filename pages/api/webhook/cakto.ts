import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers, saveUsers, generateId } from '../../../lib/db'

async function sendWelcomeEmail(email: string, name: string, plan: string, tempPassword: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) { console.log('No RESEND_API_KEY, skipping email'); return }

  const planNames: Record<string,string> = { starter:'Starter (20 vídeos/mês)', pro:'Pro (100 vídeos/mês)', enterprise:'Enterprise (Ilimitado)' }
  const planCredits: Record<string,number> = { starter:20, pro:100, enterprise:999 }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b10;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-block;background:linear-gradient(135deg,#ff3c5c,#ff6b35);border-radius:12px;padding:12px 24px">
        <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:1px">NOCTURN.AI</span>
      </div>
    </div>
    <div style="background:#0e1219;border:1px solid #1e2840;border-radius:16px;padding:36px">
      <h1 style="color:#f0f2f8;font-size:24px;font-weight:800;margin:0 0 8px">Bem-vindo ao NOCTURN.AI! 🎉</h1>
      <p style="color:#8892a4;font-size:15px;margin:0 0 24px;line-height:1.6">Olá <strong style="color:#f0f2f8">${name}</strong>, sua assinatura do plano <strong style="color:#ff3c5c">${planNames[plan]||plan}</strong> foi ativada com sucesso!</p>
      
      <div style="background:#141920;border:1px solid #1e2840;border-radius:10px;padding:20px;margin-bottom:24px">
        <div style="color:#4a5568;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;font-family:monospace">Seus Créditos Mensais</div>
        <div style="font-size:36px;font-weight:800;color:#ff3c5c">${planCredits[plan]||20}</div>
        <div style="color:#8892a4;font-size:12px;margin-top:4px">créditos = vídeos completos por mês</div>
        <div style="color:#4a5568;font-size:11px;margin-top:4px;font-family:monospace">1 crédito = 1 vídeo (roteiro + voz IA + edição)</div>
      </div>

      <div style="background:#141920;border:1px solid #1e2840;border-radius:10px;padding:20px;margin-bottom:28px">
        <div style="color:#4a5568;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;font-family:monospace">Seus Dados de Acesso</div>
        <div style="margin-bottom:8px"><span style="color:#8892a4;font-size:13px">Email: </span><span style="color:#f0f2f8;font-size:13px;font-weight:600">${email}</span></div>
        <div><span style="color:#8892a4;font-size:13px">Senha temporária: </span><span style="color:#ff3c5c;font-size:13px;font-weight:700;font-family:monospace">${tempPassword}</span></div>
        <div style="color:#4a5568;font-size:11px;margin-top:8px">⚠️ Altere sua senha após o primeiro acesso</div>
      </div>

      <a href="https://nocturn-ai.vercel.app/login" style="display:block;text-align:center;background:linear-gradient(135deg,#ff3c5c,#ff6b35);color:#fff;text-decoration:none;padding:16px;border-radius:10px;font-weight:700;font-size:16px;margin-bottom:20px">
        Acessar NOCTURN.AI →
      </a>

      <div style="border-top:1px solid #1e2840;padding-top:20px">
        <p style="color:#4a5568;font-size:12px;margin:0;line-height:1.7">
          🎬 Gere seu primeiro dark channel agora mesmo<br>
          📊 Acompanhe suas views e créditos no dashboard<br>
          💬 Dúvidas? Responda este email
        </p>
      </div>
    </div>
    <p style="color:#4a5568;font-size:11px;text-align:center;margin-top:20px">© 2025 NOCTURN.AI · Você recebeu este email pois comprou o plano ${plan}</p>
  </div>
</body>
</html>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
        to: [email],
        subject: '🎉 Bem-vindo ao NOCTURN.AI — Seus dados de acesso',
        html,
      })
    })
    console.log('Welcome email sent to', email)
  } catch(e) { console.error('Email error:', e) }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const p = req.body
    const event = p.event || p.type || ''
    const email = p.customer?.email || p.buyer?.email || p.email || ''
    const name = p.customer?.name || p.buyer?.name || email.split('@')[0] || 'Usuário'
    const productName = (p.product?.name || p.offer?.name || '').toLowerCase()
    
    let plan = 'starter'
    if (productName.includes('pro')) plan = 'pro'
    else if (productName.includes('enterprise')) plan = 'enterprise'
    
    const credits: Record<string,number> = { starter:20, pro:100, enterprise:99999 }
    const users = getUsers()
    const idx = users.findIndex((u: any) => u.email === email)
    
    if (event.includes('approved') || event.includes('paid') || event.includes('active') || event.includes('complete')) {
      const tempPassword = Math.random().toString(36).substring(2,10).toUpperCase()
      const bcrypt = require('bcryptjs')
      
      if (idx === -1) {
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
      
      // Send welcome email with access credentials
      await sendWelcomeEmail(email, name, plan, idx === -1 ? tempPassword : '(use sua senha cadastrada)')
      console.log('User activated:', email, plan)
    }
    
    if (event.includes('cancel') || event.includes('refund') || event.includes('chargeback')) {
      if (idx !== -1) { users[idx].active = false; users[idx].credits = 0; saveUsers(users) }
    }
    
    if (event.includes('renew') || event.includes('rebill')) {
      if (idx !== -1) {
        users[idx].credits = credits[users[idx].plan] || 20
        users[idx].active = true
        saveUsers(users)
      }
    }
    
    res.status(200).json({ ok: true })
  } catch(e: any) {
    console.error('Webhook error:', e)
    res.status(500).json({ error: e.message })
  }
}