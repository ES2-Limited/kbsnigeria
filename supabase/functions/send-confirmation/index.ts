import { handleCors } from '../_shared/cors.ts'
import { json } from '../_shared/http.ts'
import { sendEmail } from '../_shared/resend.ts'
import { createAdminClient, supabaseUrl } from '../_shared/supabase.ts'
import { createToken, isEmail, isNonEmptyString, sanitizeString } from '../_shared/validation.ts'

Deno.serve(async (request) => {
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  if (request.method !== 'POST') {
    return json(request, 405, { error: 'Method not allowed.' })
  }

  let payload: Record<string, unknown>

  try {
    payload = await request.json()
  } catch {
    return json(request, 400, { error: 'Invalid JSON payload.' })
  }

  const { name, email } = payload

  if ((!name || !isNonEmptyString(name, 120)) || !isEmail(email)) {
    return json(request, 422, { error: 'Please provide a valid name and email address.' })
  }

  const cleanName = sanitizeString(name)
  const cleanEmail = sanitizeString(email)
  const token = createToken()
  const confirmUrl = `${supabaseUrl}/functions/v1/confirm-subscription?token=${token}`
  const adminClient = createAdminClient()

  const { data: existingSubscriber, error: existingError } = await adminClient
    .from('newsletter_subscribers')
    .select('id, confirmed, unsubscribed_at')
    .eq('email', cleanEmail)
    .maybeSingle()

  if (existingError) {
    return json(request, 500, { error: 'Failed to check existing subscriber.' })
  }

  if (existingSubscriber?.confirmed && !existingSubscriber.unsubscribed_at) {
    return json(request, 200, { success: true, message: 'This email address is already subscribed.' })
  }

  const { error: upsertError } = await adminClient.from('newsletter_subscribers').upsert(
    {
      name: cleanName,
      email: cleanEmail,
      confirmed: false,
      token,
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    },
    { onConflict: 'email' },
  )

  if (upsertError) {
    return json(request, 500, { error: 'Failed to save newsletter subscription.' })
  }

  try {
    await sendEmail({
      to: cleanEmail,
      subject: 'Confirm your KBS Nigeria newsletter subscription',
      html: `
        <p>Hello ${cleanName},</p>
        <p>Thank you for subscribing to KBS Nigeria updates.</p>
        <p>Please confirm your subscription by clicking the link below:</p>
        <p><a href="${confirmUrl}">Confirm subscription</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    })
  } catch (error) {
    return json(request, 502, { error: error instanceof Error ? error.message : 'Confirmation email failed.' })
  }

  return json(request, 200, { success: true, message: 'Confirmation email sent.' })
})
