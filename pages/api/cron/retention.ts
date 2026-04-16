import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers } from '../../../lib/db'

// Call this endpoint daily via a cron (e.g. Vercel cron or external ping)
// Protected by CRON_SECRET env var

const EMAILS: Record<number, { subject: string; body: (name: string) => string }> = {
  1: {
    subject: 'Seu primeiro vídeo está esperando 🎬',
    body: (name) => `Olá, ${name}!\n\nVocê se cadastrou no NOCTURN.AI ontem mas ainda não gerou nenhum vídeo.\n\nVocê tem 1 crédito grátis esperando por você. Leva menos de 2 minutos para criar seu primeiro vídeo com IA.\n\nAcesse: https://nocturn-ai.vercel.app/dashboard\n\nAbraços,\nEquipe NOCTURN.AI`,
  },
  3: {
    subject: 'Dica: como escrever prompts que geram vídeos virais 🚀',
    body: (name) => `Olá, ${name}!\n\nDica rápida para turbinar seus vídeos:\n\n✅ Seja específico: "A história real do maior golpe financeiro do Brasil" converte muito mais que "fraudes financeiras"\n✅ Use gatilhos de curiosidade: "O que a mídia tentou esconder sobre..."\n✅ Adicione urgência: "O segredo que os ricos não querem que você saiba"\n\nTeste agora: https://nocturn-ai.vercel.app/dashboard\n\nAbraços,\nEquipe NOCTURN.AI`,
  },
  7: {
    subject: 'Como está indo? Aqui estão seus próximos passos 💡',
    body: (name) => `Olá, ${name}!\n\nJá faz uma semana desde que você entrou para o NOCTURN.AI!\n\nCriadores que fazem upload consistente (3-4 vídeos/semana) crescem em média 400% mais rápido no YouTube.\n\nSe você ainda está no plano gratuito, considere fazer upgrade para ter mais créditos:\n👉 Starter (20 vídeos/mês) — R$47\n👉 Pro (100 vídeos/mês) — R$97\n\nAcesse: https://nocturn-ai.vercel.app/dashboard\n\nAbraços,\nEquipe NOCTURN.AI`,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret
  const secret = req.headers['x-cron-secret'] || req.query.secret
  const cronSecret = process.env.CRON_SECRET || 'nocturnai_cron_2025'
  if (secret !== cronSecret) return res.status(401).json({ error: 'Unauthorized' })

  const resendKey = process.env.RESEND_API_KEY || ''
  if (!resendKey) return res.status(200).json({ skipped: 'no resend key' })

  const users = await getUsers()
  const now = Date.now()
  const sent: string[] = []

  for (const user of users) {
    if (!user.email || !user.createdAt) continue
    const daysSince = Math.floor((now - new Date(user.createdAt).getTime()) / 86400000)

    const emailConfig = EMAILS[daysSince]
    if (!emailConfig) continue

    // Don't email users who already have videos (active users don't need nudging)
    if (daysSince === 1 && (user.videoCount || 0) > 0) continue

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
          to: user.email,
          subject: emailConfig.subject,
          text: emailConfig.body(user.name || 'criador'),
        }),
      })
      if (r.ok) sent.push(user.email)
    } catch (e) { console.error('Retention email error:', e) }
  }

  res.status(200).json({ sent: sent.length, emails: sent })
}
