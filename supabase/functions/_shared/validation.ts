const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isNonEmptyString(value: unknown, maxLength = 1000): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && emailPattern.test(value.trim())
}

export function sanitizeString(value: string) {
  return value.trim()
}

export function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip') ?? 'unknown'
}
