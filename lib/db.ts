import fs from 'fs'
import path from 'path'

const DB_PATH = '/tmp/nocturn_db.json'

interface DB {
  users: any[]
  videos: any[]
}

function readDB(): DB {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    }
  } catch {}
  return { users: [], videos: [] }
}

function writeDB(db: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  } catch (e) {
    console.error('writeDB error:', e)
  }
}

export function getUsers(): any[] {
  return readDB().users
}

export function saveUsers(users: any[]) {
  const db = readDB()
  db.users = users
  writeDB(db)
}

export function getVideos(userId?: string): any[] {
  const videos = readDB().videos
  if (userId) return videos.filter((v: any) => v.userId === userId)
  return videos
}

export function saveVideo(video: any) {
  const db = readDB()
  db.videos = [video, ...(db.videos || [])]
  writeDB(db)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Seed admin user if no users exist
export function ensureAdmin() {
  const users = getUsers()
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
    saveUsers(users)
    console.log('Admin seeded:', adminEmail)
  }
}