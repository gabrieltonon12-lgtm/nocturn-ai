import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getUsers(): Promise<any[]> {
  const users = await redis.get<any[]>('users')
  return users || []
}

export async function saveUsers(users: any[]): Promise<void> {
  await redis.set('users', users)
}

export async function getVideos(userId?: string): Promise<any[]> {
  const videos = await redis.get<any[]>('videos')
  const all = videos || []
  if (userId) return all.filter((v: any) => v.userId === userId)
  return all
}

export async function saveVideo(video: any): Promise<void> {
  const videos = await getVideos()
  await redis.set('videos', [video, ...videos])
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function ensureAdmin(): Promise<void> {
  const users = await getUsers()
  if (users.length === 0) {
    const bcrypt = require('bcryptjs')
    const adminEmail = process.env.ADMIN_EMAIL || 'gabrieltonon12@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Nocturn2025'
    users.push({
      id: generateId(),
      name: 'Admin',
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      plan: 'enterprise',
      credits: 99999,
      role: 'admin',
      active: true,
      videoCount: 0,
      createdAt: new Date().toISOString(),
    })
    await saveUsers(users)
    console.log('Admin seeded:', adminEmail)
  }
}
