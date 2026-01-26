interface RateLimitRecord {
  count: number
  resetTime: number
}

const requestCounts = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000,
): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function cleanupExpiredRecords(): void {
  const now = Date.now()
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip)
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000)
}
