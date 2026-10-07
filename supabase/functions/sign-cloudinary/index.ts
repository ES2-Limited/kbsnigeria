import { getCorsHeaders, handleCors } from '../_shared/cors.ts'
import { createAuthedClient } from '../_shared/supabase.ts'

declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
  serve(handler: (req: Request) => Promise<Response> | Response): void
}

interface SignRequest {
  folder?: string
  bucket?: string
  eager?: string
  publicId?: string
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req)
  if (corsResponse) {
    return corsResponse
  }

  const corsHeaders = getCorsHeaders(req)

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify user session
    const supabase = createAuthedClient(authHeader)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
    const rootFolder = Deno.env.get('CLOUDINARY_FOLDER') || 'kbsnigeria'

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({
          error: 'Cloudinary credentials not configured in Supabase Edge Function secrets.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const body: SignRequest = await req.json().catch(() => ({}))
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = body.folder || (body.bucket ? `${rootFolder}/${body.bucket}` : rootFolder)

    // Build parameter string for Cloudinary signature (sorted alphabetically)
    const paramsToSign: Record<string, string> = {
      folder,
      timestamp: String(timestamp),
    }

    if (body.publicId) {
      paramsToSign.public_id = body.publicId
    }

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&')

    const stringToSign = `${sortedParams}${apiSecret}`

    // Compute SHA-1 digest
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(stringToSign))
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return new Response(
      JSON.stringify({
        apiKey,
        cloudName,
        folder,
        signature,
        timestamp,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Signing failed'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
