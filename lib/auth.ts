import jwt from 'jsonwebtoken'

function getSecret(): string {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET env var is required but not set')
  return s
}

export const JWT_SECRET = { get value() { return getSecret() } }

export function signToken(payload: object, expiresIn = '30d'): string {
  return jwt.sign(payload, getSecret(), { expiresIn } as any)
}

export function verifyToken(token: string): any {
  return jwt.verify(token, getSecret())
}

export const FROM_EMAIL = 'NOCTURN.AI <noreply@nocturn-ai.vercel.app>'
export const REPLY_TO   = 'suporte@nocturn-ai.vercel.app'
export const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL || 'https://nocturn-ai.vercel.app'
