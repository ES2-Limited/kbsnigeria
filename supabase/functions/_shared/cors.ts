export function getCorsHeaders(request: Request) {
  const requestOrigin = request.headers.get('origin') ?? ''
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGIN') ?? 'http://localhost:5173,https://kbsnigeria.com,https://www.kbsnigeria.com')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-confirmation-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function handleCors(request: Request) {
  if (request.method !== 'OPTIONS') {
    return null
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  })
}
