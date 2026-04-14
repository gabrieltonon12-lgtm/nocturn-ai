import type { NextApiRequest, NextApiResponse } from 'next'
import { createHash } from 'crypto'

const PIXEL_ID = 'D7END4RC77U8N8PUBHCG'
const ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Internal test endpoint — fires seed events so TikTok Ads unlocks optimization events
  // Safe to call multiple times — uses unique event_ids
  try {
    const email = 'gabrieltonon12@gmail.com'
    const emailHash = createHash('sha256').update(email.toLowerCase()).digest('hex')
    const now = new Date().toISOString()
    const base = Date.now()

    const context = {
      page: { url: 'https://nocturn-ai.vercel.app' },
      ip: req.headers['x-forwarded-for']?.toString() || '177.55.100.1',
      user_agent: req.headers['user-agent'] || 'Mozilla/5.0 Chrome/120',
      user: { email: emailHash },
    }

    const events = [
      {
        event: 'CompletePayment',
        event_id: `seed_payment_${base}`,
        timestamp: now,
        context,
        properties: { currency: 'BRL', value: 97, content_id: 'pro', content_type: 'product', content_name: 'NOCTURN.AI Pro', quantity: 1 },
      },
      {
        event: 'Subscribe',
        event_id: `seed_subscribe_${base + 1}`,
        timestamp: now,
        context,
        properties: { currency: 'BRL', value: 97, content_name: 'NOCTURN.AI Pro' },
      },
      {
        event: 'ViewContent',
        event_id: `seed_view_${base + 2}`,
        timestamp: now,
        context,
        properties: { content_name: 'NOCTURN.AI Landing Page', content_type: 'product' },
      },
      {
        event: 'AddToWishlist',
        event_id: `seed_wish_${base + 3}`,
        timestamp: now,
        context,
        properties: { content_name: 'NOCTURN.AI Pro', currency: 'BRL', value: 97 },
      },
    ]

    const ttRes = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: { 'Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pixel_code: PIXEL_ID, data: events }),
    })
    const ttData = await ttRes.json()
    console.log('TikTok seed events:', JSON.stringify(ttData))
    res.status(200).json({ ok: true, tiktok: ttData, events_fired: events.map(e => e.event) })
  } catch(e: any) {
    console.error('Seed error:', e)
    res.status(500).json({ error: e.message })
  }
}