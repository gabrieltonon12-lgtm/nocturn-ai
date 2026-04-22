import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// ─── Key schema ──────────────────────────────────────────────────────────────
// user:{id}           → user object
// email_idx           → Redis hash  { email → userId }
// uid_idx             → Redis hash  { userId → "1" }  (all known IDs)
// user_vids:{userId}  → array of video objects for that user (newest first)
// video:{id}          → individual video object (for /v/[id] shared links)
// ─────────────────────────────────────────────────────────────────────────────

// Run once: move old flat arrays to per-user/per-video keys
let migrated = false
async function migrateIfNeeded(): Promise<void> {
  if (migrated) return
  migrated = true

  const oldUsers = await redis.get<any[]>('users')
  if (!oldUsers || oldUsers.length === 0) return

  const pipeline = redis.pipeline()
  for (const u of oldUsers) {
    if (!u.id || !u.email) continue
    pipeline.set(`user:${u.id}`, u)
    pipeline.hset('email_idx', { [u.email.toLowerCase()]: u.id })
    pipeline.hset('uid_idx', { [u.id]: '1' })
  }

  const oldVideos = await redis.get<any[]>('videos')
  if (oldVideos && oldVideos.length > 0) {
    // Group by userId
    const byUser: Record<string, any[]> = {}
    for (const v of oldVideos) {
      if (!v.userId) continue
      ;(byUser[v.userId] ||= []).push(v)
    }
    for (const [uid, vids] of Object.entries(byUser)) {
      // Already newest-first from old store; keep at most 200
      pipeline.set(`user_vids:${uid}`, vids.slice(0, 200))
    }
    for (const v of oldVideos) {
      if (v.id) pipeline.set(`video:${v.id}`, v)
    }
  }

  await pipeline.exec()
  // Remove old flat keys
  await redis.del('users')
  await redis.del('videos')
  console.log('[db] migrated to per-user keys')
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<any[]> {
  await migrateIfNeeded()
  const idx = await redis.hgetall('uid_idx') as Record<string, string> | null
  if (!idx || Object.keys(idx).length === 0) return []
  const ids = Object.keys(idx)
  const pipeline = redis.pipeline()
  for (const id of ids) pipeline.get(`user:${id}`)
  const results = await pipeline.exec()
  return (results as any[]).filter(Boolean)
}

export async function getUserById(id: string): Promise<any | null> {
  await migrateIfNeeded()
  return redis.get(`user:${id}`)
}

export async function getUserByEmail(email: string): Promise<any | null> {
  await migrateIfNeeded()
  const uid = await redis.hget<string>('email_idx', email.toLowerCase())
  if (!uid) return null
  return redis.get(`user:${uid}`)
}

// Save a single user — preferred over saveUsers for single-user mutations
export async function saveUser(user: any): Promise<void> {
  await migrateIfNeeded()
  const pipeline = redis.pipeline()
  pipeline.set(`user:${user.id}`, user)
  pipeline.hset('email_idx', { [user.email.toLowerCase()]: user.id })
  pipeline.hset('uid_idx', { [user.id]: '1' })
  await pipeline.exec()
}

// Bulk save — used by routes that modify and re-save the full array.
// Rebuilds indexes from scratch to handle deletions cleanly.
export async function saveUsers(users: any[]): Promise<void> {
  await migrateIfNeeded()
  const pipeline = redis.pipeline()

  // Rebuild both indexes
  pipeline.del('email_idx')
  pipeline.del('uid_idx')

  const emailMap: Record<string, string> = {}
  const uidMap: Record<string, string> = {}

  for (const u of users) {
    if (!u.id || !u.email) continue
    pipeline.set(`user:${u.id}`, u)
    emailMap[u.email.toLowerCase()] = u.id
    uidMap[u.id] = '1'
  }

  if (Object.keys(emailMap).length > 0) pipeline.hset('email_idx', emailMap)
  if (Object.keys(uidMap).length > 0) pipeline.hset('uid_idx', uidMap)

  await pipeline.exec()
}

// Delete a single user and remove from indexes
export async function deleteUser(userId: string, email: string): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.del(`user:${userId}`)
  pipeline.del(`user_vids:${userId}`)
  pipeline.hdel('email_idx', email.toLowerCase())
  pipeline.hdel('uid_idx', userId)
  await pipeline.exec()
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(userId?: string): Promise<any[]> {
  await migrateIfNeeded()

  if (userId) {
    const vids = await redis.get<any[]>(`user_vids:${userId}`)
    return vids || []
  }

  // Admin: fetch all users' videos
  const idx = await redis.hgetall('uid_idx') as Record<string, string> | null
  if (!idx || Object.keys(idx).length === 0) return []
  const ids = Object.keys(idx)
  const pipeline = redis.pipeline()
  for (const id of ids) pipeline.get(`user_vids:${id}`)
  const results = await pipeline.exec() as any[][]
  return results.flat().filter(Boolean)
}

export async function getVideoById(id: string): Promise<any | null> {
  await migrateIfNeeded()
  return redis.get(`video:${id}`)
}

export async function saveVideo(video: any): Promise<void> {
  await migrateIfNeeded()
  const key = `user_vids:${video.userId}`
  const existing = await redis.get<any[]>(key) || []
  const pipeline = redis.pipeline()
  pipeline.set(key, [video, ...existing].slice(0, 200))
  pipeline.set(`video:${video.id}`, video)
  await pipeline.exec()
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function ensureAdmin(): Promise<void> {
  await migrateIfNeeded()
  const adminEmail = (process.env.ADMIN_EMAIL || 'gabrieltonon12@gmail.com').toLowerCase()
  const existing = await getUserByEmail(adminEmail)
  if (existing) return

  const bcrypt = require('bcryptjs')
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Nocturn2025'
  const admin = {
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
  }
  await saveUser(admin)
  console.log('Admin seeded:', adminEmail)
}
