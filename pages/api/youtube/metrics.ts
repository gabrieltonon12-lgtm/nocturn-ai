import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUser } from '../../../lib/db'

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.access_token || null
  } catch { return null }
}

async function ytFetch(url: string, accessToken: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!res.ok) throw new Error(`YT API ${res.status}: ${await res.text()}`)
  return res.json()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatorio' })
    const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
    let decoded: any
    try { decoded = jwt.verify(auth.split(' ')[1], secret) }
    catch { return res.status(401).json({ error: 'Token invalido' }) }

    const users = await getUsers()
    const idx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (idx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' })
    const user = users[idx]

    if (!user.youtube?.accessToken) {
      return res.status(200).json({ connected: false })
    }

    // Refresh token if expired
    let accessToken = user.youtube.accessToken
    if (user.youtube.expiresAt && Date.now() > user.youtube.expiresAt - 60000) {
      const newToken = await refreshAccessToken(user.youtube.refreshToken)
      if (newToken) {
        accessToken = newToken
        users[idx].youtube.accessToken = newToken
        users[idx].youtube.expiresAt = Date.now() + 3600 * 1000
        await saveUser(users[idx])
      }
    }

    const channelId = user.youtube.channelId

    // Channel stats
    const channelData = await ytFetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}`,
      accessToken
    )
    const channel = channelData.items?.[0]

    // Recent videos (last 10)
    const searchData = await ytFetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10`,
      accessToken
    )
    const videoIds = (searchData.items || []).map((v: any) => v.id.videoId).filter(Boolean)

    let videos: any[] = []
    if (videoIds.length > 0) {
      const videosData = await ytFetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}`,
        accessToken
      )
      videos = (videosData.items || []).map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails?.medium?.url || '',
        publishedAt: v.snippet.publishedAt,
        views: parseInt(v.statistics?.viewCount || '0'),
        likes: parseInt(v.statistics?.likeCount || '0'),
        comments: parseInt(v.statistics?.commentCount || '0'),
      }))
    }

    // Analytics: subscriber gain last 28 days (YouTube Analytics API)
    let analytics: any[] = []
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0]
      const analyticsData = await ytFetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=views,subscribersGained,estimatedMinutesWatched&dimensions=day&sort=day`,
        accessToken
      )
      analytics = (analyticsData.rows || []).map((row: any[]) => ({
        date: row[0],
        views: row[1] || 0,
        subscribersGained: row[2] || 0,
        watchMinutes: row[3] || 0,
      }))
    } catch (e) { console.error('Analytics error (non-fatal):', e) }

    res.status(200).json({
      connected: true,
      channel: {
        id: channelId,
        title: channel?.snippet?.title || user.youtube.channelTitle,
        description: channel?.snippet?.description || '',
        thumbnail: channel?.snippet?.thumbnails?.medium?.url || user.youtube.channelThumb,
        customUrl: channel?.snippet?.customUrl || '',
        publishedAt: channel?.snippet?.publishedAt || '',
        subscribers: parseInt(channel?.statistics?.subscriberCount || user.youtube.subscribers || '0'),
        totalViews: parseInt(channel?.statistics?.viewCount || user.youtube.totalViews || '0'),
        videoCount: parseInt(channel?.statistics?.videoCount || user.youtube.videoCount || '0'),
        banner: channel?.brandingSettings?.image?.bannerExternalUrl || '',
      },
      videos,
      analytics,
    })
  } catch (e: any) {
    console.error('YouTube metrics error:', e)
    res.status(500).json({ error: e.message })
  }
}
