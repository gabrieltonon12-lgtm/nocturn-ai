import type { NextApiRequest, NextApiResponse } from 'next'
import { createHash } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const PIXEL_ID = 'D7END4RC77U8N8PUBHCG'
    const ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899'
    const email = 'gabrieltonon12@gmail.com'
    const emailHash = createHash('sha256').update(email.toLowerCase()).digest('hex')
    const now = Math.floor(Date.now() / 1000) // Unix timestamp
    const base = Date.now()

    const context = {
      page: { url: 'https://nocturn-ai.vercel.app' },
      ip: req.headers['x-forwarded-for']?.toString()?.split(',')[0] || '177.55.100.1',
      user_agent: req.headers['user-agent'] || 'Mozilla/5.0 Chrome/120',
      user: { email: emailHash },
    }

    // TikTok Events API v1.3 — correct field names
    const events = [
      {
        event_name: 'CompletePayment',
        event_id: `seed_payment_${base}`,
        event_time: now,
        context,
        properties: { currency: 'BRL', value: '97', content_id: 'nocturn_pro', content_type: 'product', content_name: 'NOCTURN.AI Pro', quantity: 1 },
      },
      {
        event_name: 'Subscribe',
        event_id: `seed_sub_${base + 1}`,
        event_time: now,
        context,
        properties: { currency: 'BRL', value: '97', content_name: 'NOCTURN.AI Pro' },
      },
      {
        event_name: 'ViewContent',
        event_id: `seed_view_${base + 2}`,
        event_time: now,
        context,
        properties: { content_name: 'NOCTURN.AI Landing', content_type: 'product', currency: 'BRL', value: '0' },
      },
    ]

    const ttRes = await fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
      method: 'POST',
      headers: { 'Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pixel_code: PIXEL_ID, event: events }),
    })
    const ttData = await ttRes.json()
    console.log('TikTok seed events result:', JSON.stringify(ttData))
    res.status(200).json({ ok: true, tiktok: ttData, events_fired: events.map(e => e.event_name) })
  } catch(e: any) {
    console.error('Seed error:', e)
    res.status(500).json({ error: e.message })
  }
}