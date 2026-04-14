import type { NextApiRequest, NextApiResponse } from 'next'
import { createHash } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const PIXEL_ID = 'D7END4RC77U8N8PUBHCG'
    const ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899'
    const TEST_EVENT_CODE = 'TEST34811'

    const email = 'gabrieltonon12@gmail.com'
    const emailHash = createHash('sha256').update(email.toLowerCase()).digest('hex')
    const ts = new Date().toISOString()
    const base = Date.now()

    const context = {
      page: { url: 'https://nocturn-ai.vercel.app' },
      ip: '177.55.100.10',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      user: { email: emailHash },
    }

    // Exact structure for /v1.3/pixel/track/ endpoint
    const data = [
      {
        type: 'track',
        event: 'CompletePayment',
        event_id: `pay_${base}`,
        timestamp: ts,
        context,
        properties: {
          currency: 'BRL',
          value: '97',
          content_id: 'nocturn_pro',
          content_type: 'product',
          content_name: 'NOCTURN.AI Pro',
          quantity: 1,
        },
      },
      {
        type: 'track',
        event: 'Subscribe',
        event_id: `sub_${base + 1}`,
        timestamp: ts,
        context,
        properties: {
          currency: 'BRL',
          value: '97',
          content_name: 'NOCTURN.AI Pro',
        },
      },
    ]

    const ttRes = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: { 'Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pixel_code: PIXEL_ID, test_event_code: TEST_EVENT_CODE, data }),
    })
    const ttData = await ttRes.json()
    console.log('TikTok result:', JSON.stringify(ttData))
    res.status(200).json({ ok: true, code: ttData.code, msg: ttData.message, detail: ttData })
  } catch(e: any) {
    res.status(500).json({ error: e.message })
  }
}