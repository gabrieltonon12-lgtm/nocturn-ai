import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import { getUsers } from '../../../lib/db'

export const config = { maxDuration: 60 }

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nocturn-ai.vercel.app'

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>', to, subject, html }),
  }).catch(e => console.error('Email error:', e))
}

function firstName(name: string) {
  return (name || 'criador').split(' ')[0]
}

function d1Email(user: any) {
  const nome = firstName(user.name)
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Figtree',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding-bottom:24px;text-align:center;">
  <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#C5183A,#8B0A22);border-radius:8px;color:#fff;font-weight:800;font-size:15px;text-align:center;line-height:32px;">N</span>
  <span style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;margin-left:8px;vertical-align:middle;">NOCTURN.AI</span>
</td></tr>
<tr><td style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:40px 36px;">
  <div style="font-size:48px;text-align:center;margin-bottom:20px;">🎁</div>
  <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;text-align:center;line-height:1.2;">
    ${nome}, seu crédito grátis<br>está esperando por você
  </h1>
  <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 24px;text-align:center;">
    Você criou sua conta ontem mas ainda não gerou nenhum vídeo.<br>
    <strong style="color:#0F172A;">Esse crédito só dura 7 dias.</strong>
  </p>
  <div style="background:rgba(197,24,58,.06);border:1px solid rgba(197,24,58,.2);border-radius:14px;padding:20px;margin-bottom:24px;">
    <div style="font-size:11px;font-family:monospace;color:#94A3B8;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">💡 Temas que viralizaram esta semana</div>
    ${['Os segredos da maçonaria que ninguém conta', 'O caso real que chocou o Brasil em 2024', 'Como ficar rico sem trabalhar para os outros'].map(t =>
      `<div style="padding:8px 12px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:6px;font-size:13px;color:#0F172A;">▶ ${t}</div>`
    ).join('')}
  </div>
  <a href="${APP_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-bottom:12px;">
    Usar meu crédito grátis agora →
  </a>
  <p style="font-size:11px;color:#94A3B8;text-align:center;margin:0;">Leva menos de 3 minutos · Sem cartão</p>
</td></tr>
<tr><td style="padding-top:20px;text-align:center;">
  <p style="font-size:11px;color:#94A3B8;">NOCTURN.AI · <a href="${APP_URL}" style="color:#94A3B8;">nocturn-ai.vercel.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`
}

function d3Email(user: any) {
  const nome = firstName(user.name)
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Figtree',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding-bottom:24px;text-align:center;">
  <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#C5183A,#8B0A22);border-radius:8px;color:#fff;font-weight:800;font-size:15px;text-align:center;line-height:32px;">N</span>
  <span style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;margin-left:8px;vertical-align:middle;">NOCTURN.AI</span>
</td></tr>
<tr><td style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:40px 36px;">
  <div style="font-size:48px;text-align:center;margin-bottom:20px;">🔥</div>
  <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;text-align:center;line-height:1.2;">
    3 nichos explosivos<br>no YouTube esta semana
  </h1>
  <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 24px;text-align:center;">
    ${nome}, canais faceless nesses nichos estão crescendo 40–200k inscritos por mês.
  </p>
  ${[
    { icon: '💀', nicho: 'True Crime BR', desc: 'Casos reais brasileiros geram 3–5x mais views que qualquer outro nicho', views: '+2.3M views/semana' },
    { icon: '✝️', nicho: 'Religioso motivacional', desc: 'Fé + desenvolvimento pessoal. Canal novo → 10k inscritos em 3 semanas', views: '+890K views/semana' },
    { icon: '💰', nicho: 'Dark Finance', desc: 'Segredos financeiros que os ricos não querem que você saiba', views: '+1.1M views/semana' },
  ].map(n => `
  <div style="padding:16px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;margin-bottom:12px;display:flex;gap:12px;align-items:flex-start;">
    <span style="font-size:24px;line-height:1;flex-shrink:0;">${n.icon}</span>
    <div>
      <div style="font-weight:700;font-size:14px;color:#0F172A;margin-bottom:4px;">${n.nicho}</div>
      <div style="font-size:12px;color:#64748B;line-height:1.6;margin-bottom:6px;">${n.desc}</div>
      <div style="font-size:10px;font-family:monospace;color:#C5183A;font-weight:600;">${n.views}</div>
    </div>
  </div>`).join('')}
  <a href="${APP_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-top:20px;margin-bottom:12px;">
    Criar meu canal neste nicho →
  </a>
  <p style="font-size:11px;color:#94A3B8;text-align:center;margin:0;">Seu crédito grátis ainda está disponível</p>
</td></tr>
<tr><td style="padding-top:20px;text-align:center;">
  <p style="font-size:11px;color:#94A3B8;">NOCTURN.AI · <a href="${APP_URL}" style="color:#94A3B8;">nocturn-ai.vercel.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`
}

function d7Email(user: any) {
  const nome = firstName(user.name)
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Figtree',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding-bottom:24px;text-align:center;">
  <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#C5183A,#8B0A22);border-radius:8px;color:#fff;font-weight:800;font-size:15px;text-align:center;line-height:32px;">N</span>
  <span style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;margin-left:8px;vertical-align:middle;">NOCTURN.AI</span>
</td></tr>
<tr><td style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:40px 36px;">
  <div style="font-size:48px;text-align:center;margin-bottom:20px;">⏰</div>
  <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;text-align:center;line-height:1.2;">
    ${nome}, este é o último aviso
  </h1>
  <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 20px;text-align:center;">
    Sua conta completa <strong style="color:#0F172A;">7 dias amanhã</strong>.<br>
    Depois disso seu crédito grátis expira e você perde a chance de testar.
  </p>
  <div style="background:rgba(197,24,58,.06);border:1px solid rgba(197,24,58,.2);border-radius:14px;padding:20px;margin-bottom:24px;text-align:center;">
    <div style="font-size:32px;font-weight:800;color:#C5183A;letter-spacing:-0.04em;margin-bottom:4px;">R$0,00</div>
    <div style="font-size:13px;color:#64748B;">para gerar seu primeiro vídeo completo agora</div>
    <div style="font-size:11px;font-family:monospace;color:#94A3B8;margin-top:8px;">Roteiro + narração + vídeo Runway ML · MP4 completo</div>
  </div>
  <a href="${APP_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-bottom:12px;">
    Gerar meu vídeo antes que expire →
  </a>
  <p style="font-size:11px;color:#94A3B8;text-align:center;margin:0;">Leva 3 minutos · Sem cartão de crédito</p>
</td></tr>
<tr><td style="padding-top:20px;text-align:center;">
  <p style="font-size:11px;color:#94A3B8;">NOCTURN.AI · <a href="${APP_URL}" style="color:#94A3B8;">nocturn-ai.vercel.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel cron sends Authorization: Bearer $CRON_SECRET
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${cronSecret}`) return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const users = await getUsers()
    const now = Date.now()
    let sent = 0

    for (const user of users) {
      if (!user.email || !user.active) continue
      const videos = user.videoCount ?? 0
      const createdAt = user.createdAt ? new Date(user.createdAt).getTime() : now
      const hours = (now - createdAt) / (1000 * 60 * 60)

      const sequences: Array<{ minH: number; maxH: number; key: string; subject: string; html: () => string }> = [
        { minH: 20, maxH: 52, key: 'd1', subject: `${firstName(user.name)}, seu crédito grátis está esperando 🎁`, html: () => d1Email(user) },
        { minH: 68, maxH: 100, key: 'd3', subject: '3 nichos que estão viralizando esta semana no YouTube 🔥', html: () => d3Email(user) },
        { minH: 164, maxH: 196, key: 'd7', subject: `Último aviso — seu crédito grátis expira amanhã ⏰`, html: () => d7Email(user) },
      ]

      for (const seq of sequences) {
        if (videos > 0) break
        if (hours < seq.minH || hours >= seq.maxH) continue
        const redisKey = `activation_email:${user.id}:${seq.key}`
        const alreadySent = await redis.get(redisKey)
        if (alreadySent) continue
        await sendEmail(user.email, seq.subject, seq.html())
        await redis.set(redisKey, '1', { ex: 60 * 60 * 24 * 60 }) // 60 days TTL
        sent++
        console.log(`[activation-email] ${seq.key} → ${user.email}`)
      }
    }

    res.status(200).json({ ok: true, processed: users.length, sent })
  } catch (e: any) {
    console.error('[activation-emails] error:', e)
    res.status(500).json({ error: e.message })
  }
}
