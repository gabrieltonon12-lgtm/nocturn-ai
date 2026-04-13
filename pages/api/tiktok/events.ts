import type { NextApiRequest, NextApiResponse } from 'next'

const PIXEL_ID = 'D7END4RC77U8N8PUBHCG';
const ACCESS_TOKEN = '2417bf01ceeb0d33507135be36acfe37cc3e7899';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { event, email, value, currency = 'BRL', url } = req.body;
  if (!event) return res.status(400).json({ error: 'event required' });

  try {
    const payload = {
      pixel_code: PIXEL_ID,
      test_event_code: '',
      timestamp: new Date().toISOString(),
      context: {
        page: { url: url || 'https://nocturn-ai.vercel.app' },
        ip: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '',
        user_agent: req.headers['user-agent'] || '',
      },
      properties: {
        currency,
        value: value || 0,
      },
      event,
      event_id: Date.now().toString(),
    };

    if (email) {
      const { createHash } = await import('crypto');
      (payload as any).context.user = {
        email: createHash('sha256').update(email.toLowerCase().trim()).digest('hex'),
      };
    }

    const tiktokRes = await fetch(
      `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`,
      {
        method: 'POST',
        headers: {
          'Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [payload] }),
      }
    );
    const data = await tiktokRes.json();
    res.status(200).json({ ok: true, tiktok: data });
  } catch (e: any) {
    console.error('TikTok Events API error:', e);
    res.status(500).json({ error: e.message });
  }
}