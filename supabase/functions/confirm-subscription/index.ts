import { handleCors } from '../_shared/cors.ts'
import { json } from '../_shared/http.ts'
import { createAdminClient } from '../_shared/supabase.ts'
import { isNonEmptyString } from '../_shared/validation.ts'

Deno.serve(async (request) => {
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  if (request.method !== 'GET') {
    return json(request, 405, { error: 'Method not allowed.' })
  }

  const token = new URL(request.url).searchParams.get('token')

  if (!isNonEmptyString(token, 128)) {
    return json(request, 422, { error: 'A valid confirmation token is required.' })
  }

  const adminClient = createAdminClient()
  const { data: subscriber, error: fetchError } = await adminClient
    .from('newsletter_subscribers')
    .select('id, confirmed')
    .eq('token', token)
    .maybeSingle()

  if (fetchError) {
    return json(request, 500, { error: 'Failed to confirm subscription.' })
  }

  if (!subscriber) {
    return json(request, 404, { error: 'Subscription token not found or already used.' })
  }

  if (!subscriber.confirmed) {
    const { error: updateError } = await adminClient
      .from('newsletter_subscribers')
      .update({ confirmed: true, token: null })
      .eq('id', subscriber.id)

    if (updateError) {
      return json(request, 500, { error: 'Failed to activate subscription.' })
    }
  }

  return json(request, 200, { success: true, message: 'Subscription confirmed successfully.' })
})
