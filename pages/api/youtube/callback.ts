import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state: token, error } = req.query

  if (error) {
    return res.redirect('/dashboard?youtube_error=' + encodeURIComponent(String(error)))
  }
  if (!code || !token) {
    return res.redirect('/dashboard?youtube_error=missing_params')
  }

  try {
    // Verify JWT to find the user
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    let decoded: any
    try { decoded = jwt.verify(String(token), secret) }
    catch { return res.redirect('/dashboard?youtube_error=invalid_token') }

    const clientId = process.env.GOOGLE_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    const redirectUri = process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/youtube/callback`
      : 'https://nocturn-ai.vercel.app/api/youtube/callback'

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenRes.ok) {
      const e = await tokenRes.text()
      console.error('Google token exchange error:', e)
      return res.redirect('/dashboard?youtube_error=token_exchange')
    }
    const tokens = await tokenRes.json()

    // Fetch channel info
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    )
    const channelData = await channelRes.json()
    const channel = channelData.items?.[0]

    // Save to user record
    const users = await getUsers()
    const idx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (idx === -1) return res.redirect('/dashboard?youtube_error=user_not_found')

    users[idx].youtube = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
      channelId: channel?.id || '',
      channelTitle: channel?.snippet?.title || '',
      channelThumb: channel?.snippet?.thumbnails?.default?.url || '',
      subscribers: channel?.statistics?.subscriberCount || '0',
      totalViews: channel?.statistics?.viewCount || '0',
      videoCount: channel?.statistics?.videoCount || '0',
      connectedAt: new Date().toISOString(),
    }
    await saveUsers(users)

    res.redirect('/dashboard?view=canal&youtube_connected=1')
  } catch (e: any) {
    console.error('YouTube callback error:', e)
    res.redirect('/dashboard?youtube_error=' + encodeURIComponent(e.message))
  }
}
