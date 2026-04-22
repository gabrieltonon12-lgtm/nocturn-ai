import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers } from '../../../lib/db'

const BASE_URL = 'https://nocturn-ai.vercel.app'

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOCTURN.AI</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Logo -->
        <tr><td style="padding-bottom:28px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#C5183A,#8B0A22);border-radius:8px;color:#fff;font-weight:800;font-size:15px;text-align:center;line-height:32px;font-family:'Space Grotesk',sans-serif;">N</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;">NOCTURN.AI</span>
          </div>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:20px;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,.06);">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="font-size:11px;color:#94A3B8;font-family:'JetBrains Mono',monospace;line-height:1.8;">
            NOCTURN.AI · Você recebeu este email pois criou uma conta.<br>
            <a href="${BASE_URL}" style="color:#94A3B8;">Acessar plataforma</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

const EMAILS: Record<number, { subject: string; html: (name: string) => string; text: (name: string) => string }> = {
  1: {
    subject: '🎬 Seu primeiro vídeo grátis está esperando por você',
    text: (name) => `Olá, ${name}! Você tem 1 crédito grátis no NOCTURN.AI esperando. Leva menos de 3 minutos. Acesse: ${BASE_URL}/dashboard`,
    html: (name) => emailWrapper(`
      <h1 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;line-height:1.15;">
        Olá, ${name}! Seu vídeo grátis<br>está <span style="color:#C5183A;">esperando por você</span>
      </h1>
      <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 28px;">
        Você criou sua conta ontem mas ainda não gerou nenhum vídeo. Seu <strong style="color:#0F172A;">crédito grátis</strong> está lá esperando — e leva menos de 3 minutos para criar seu primeiro vídeo com IA.
      </p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:20px 24px;margin-bottom:28px;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 14px;">Como funciona</p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${['1 · Digite o tema do seu vídeo (ex: "O maior crime financeiro do Brasil")', '2 · A IA escreve o roteiro, narra com voz realista e monta tudo', '3 · Baixe e publique no YouTube ou TikTok'].map((s,i)=>`
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <span style="font-size:13px;line-height:1.6;color:#0F172A;">${s}</span>
          </div>`).join('')}
        </div>
      </div>
      <a href="${BASE_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-bottom:16px;">
        Gerar meu primeiro vídeo grátis →
      </a>
      <p style="text-align:center;font-size:12px;color:#94A3B8;margin:0;">Sem cartão de crédito · 3 minutos · Resultado garantido</p>
    `),
  },
  3: {
    subject: '🚀 3 prompts que geram vídeos virais (testados por criadores reais)',
    text: (name) => `Olá, ${name}! Dica: seja específico nos prompts. "A história real do maior golpe financeiro do Brasil" converte muito mais que "fraudes financeiras". Acesse: ${BASE_URL}/dashboard`,
    html: (name) => emailWrapper(`
      <h1 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;line-height:1.15;">
        3 prompts que geram<br><span style="color:#C5183A;">vídeos virais</span> no YouTube
      </h1>
      <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 24px;">
        Olá, ${name}! Canais que usam esses formatos de prompt têm em média <strong style="color:#0F172A;">3× mais views</strong> nos primeiros 30 dias. Copie e use agora:
      </p>
      ${[
        { label: 'True Crime', prompt: '"O caso real mais perturbador que a mídia tentou esconder no Brasil"', views: '40k–80k views médios' },
        { label: 'Conspirações', prompt: '"O segredo que os mais ricos do mundo não querem que você saiba sobre [tema]"', views: '25k–60k views médios' },
        { label: 'Religioso', prompt: '"O milagre que mudou a vida de milhares de pessoas e a ciência não consegue explicar"', views: '30k–70k views médios' },
      ].map(t => `
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin-bottom:12px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#C5183A;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:8px;">${t.label}</div>
          <div style="font-size:13px;color:#0F172A;font-weight:600;margin-bottom:6px;font-style:italic;">${t.prompt}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#059669;font-weight:600;">📈 ${t.views}</div>
        </div>
      `).join('')}
      <a href="${BASE_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#C5183A,#8B0A22);color:#fff;text-align:center;padding:16px 28px;border-radius:12px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;letter-spacing:-0.02em;text-decoration:none;box-shadow:0 6px 24px rgba(197,24,58,.35);margin-top:24px;margin-bottom:16px;">
        Usar esses prompts agora →
      </a>
    `),
  },
  7: {
    subject: '💡 Criadores que fizeram isso no 1º mês faturaram R$2.000+ no 3º',
    text: (name) => `Olá, ${name}! Uma semana no NOCTURN.AI. Criadores consistentes (3-4 vídeos/semana) crescem 400% mais rápido. Considere o upgrade: Pro (100 vídeos) = R$97. Acesse: ${BASE_URL}/dashboard`,
    html: (name) => emailWrapper(`
      <h1 style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.04em;color:#0F172A;margin:0 0 12px;line-height:1.15;">
        O que separa canais que<br><span style="color:#C5183A;">monetizam em 90 dias</span><br>dos que desistem
      </h1>
      <p style="font-size:14px;color:#64748B;line-height:1.8;margin:0 0 24px;">
        Olá, ${name}! Já faz 7 dias desde que você entrou. Analisamos os dados de criadores que monetizaram em 90 dias e encontramos um padrão claro:
      </p>
      <div style="background:linear-gradient(135deg,rgba(197,24,58,.06),rgba(124,58,237,.04));border:1px solid rgba(197,24,58,.2);border-radius:14px;padding:24px;margin-bottom:24px;">
        <p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:800;color:#0F172A;margin:0 0 8px;letter-spacing:-0.03em;">
          3–4 vídeos por semana = monetização em ~90 dias
        </p>
        <p style="font-size:13px;color:#64748B;margin:0;line-height:1.7;">
          Canais que publicam consistentemente crescem <strong style="color:#0F172A;">400% mais rápido</strong> no algoritmo. Com o plano Starter (20 vídeos/mês), isso é totalmente possível por menos de R$2,35 por vídeo.
        </p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        ${[
          { name:'Starter', price:'R$47', credits:'20 vídeos/mês', color:'#059669', url: 'https://pay.cakto.com.br/8euvzxd', per: 'R$2,35/vídeo' },
          { name:'Pro', price:'R$97', credits:'100 vídeos/mês', color:'#C5183A', url: 'https://pay.cakto.com.br/37beu86', per: 'R$0,97/vídeo', hot: true },
        ].map(p=>`
          <div style="border:2px solid ${p.hot ? '#C5183A' : '#E2E8F0'};border-radius:14px;padding:18px 16px;position:relative;background:${p.hot ? 'rgba(197,24,58,.04)' : '#fff'};">
            ${p.hot ? '<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#C5183A;color:#fff;font-size:9px;font-weight:700;padding:3px 12px;border-radius:20px;white-space:nowrap;font-family:JetBrains Mono,monospace;letter-spacing:0.08em;">MAIS POPULAR</div>' : ''}
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:${p.color};text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:8px;">${p.name}</div>
            <div style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:800;color:#0F172A;letter-spacing:-0.04em;margin-bottom:4px;">${p.price}<span style="font-size:11px;color:#94A3B8;font-weight:400;">/mês</span></div>
            <div style="font-size:11px;color:#64748B;margin-bottom:12px;">${p.credits}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${p.color};font-weight:600;margin-bottom:14px;">${p.per}</div>
            <a href="${p.url}" style="display:block;background:${p.hot ? 'linear-gradient(135deg,#C5183A,#8B0A22)' : 'transparent'};border:1px solid ${p.hot ? 'transparent' : p.color};color:${p.hot ? '#fff' : p.color};text-align:center;padding:9px;border-radius:8px;font-size:12px;font-weight:700;font-family:'Space Grotesk',sans-serif;text-decoration:none;">
              Assinar ${p.name} →
            </a>
          </div>
        `).join('')}
      </div>
      <p style="text-align:center;font-size:12px;color:#94A3B8;margin:0;">Garantia de 7 dias · Cancele quando quiser · Reembolso sem perguntas</p>
    `),
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    if (daysSince === 1 && (user.videoCount || 0) > 0) continue

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>',
          to: user.email,
          subject: emailConfig.subject,
          html: emailConfig.html(user.name || 'criador'),
          text: emailConfig.text(user.name || 'criador'),
        }),
      })
      if (r.ok) sent.push(user.email)
    } catch (e) { console.error('Retention email error:', e) }
  }

  res.status(200).json({ sent: sent.length, emails: sent })
}
