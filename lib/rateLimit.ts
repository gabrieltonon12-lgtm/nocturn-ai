import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Sliding window rate limiter
// Returns { ok: true } if allowed, { ok: false, retryAfter } if blocked
export async function rateLimit(
  identifier: string,
  max: number,
  windowSec: number
): Promise<{ ok: boolean; remaining: number; retryAfter?: number }> {
  const key = `rl:${identifier}`
  const now = Date.now()
  const windowStart = now - windowSec * 1000

  try {
    const pipe = redis.pipeline()
    pipe.zremrangebyscore(key, 0, windowStart)
    pipe.zadd(key, { score: now, member: `${now}:${Math.random()}` })
    pipe.zcard(key)
    pipe.expire(key, windowSec + 1)
    const results = await pipe.exec() as any[]
    const count = results[2] as number
    const remaining = Math.max(0, max - count)
    if (count > max) {
      return { ok: false, remaining: 0, retryAfter: windowSec }
    }
    return { ok: true, remaining }
  } catch {
    // If Redis fails, allow the request
    return { ok: true, remaining: max }
  }
}
