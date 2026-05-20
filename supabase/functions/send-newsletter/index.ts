import { handleCors } from '../_shared/cors.ts'
import { json } from '../_shared/http.ts'
import { sendBatchEmails } from '../_shared/resend.ts'
import { createAdminClient, createAuthedClient } from '../_shared/supabase.ts'
import { createToken, isNonEmptyString, sanitizeString } from '../_shared/validation.ts'

const siteUrl = Deno.env.get('SITE_URL') ?? 'https://kbsnigeria.com'

Deno.serve(async (request) => {
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }

  if (request.method !== 'POST') {
    return json(request, 405, { error: 'Method not allowed.' })
  }

  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return json(request, 401, { error: 'Missing authorization header.' })
  }

  const authedClient = createAuthedClient(authHeader)
  const {
    data: { user },
    error: authError,
  } = await authedClient.auth.getUser()

  if (authError || !user) {
    return json(request, 401, { error: 'Unauthorized request.' })
  }

  let payload: Record<string, unknown>

  try {
    payload = await request.json()
  } catch {
    return json(request, 400, { error: 'Invalid JSON payload.' })
  }

  const { subject, body, bannerUrl } = payload

  if (!isNonEmptyString(subject, 200) || !isNonEmptyString(body, 20000)) {
    return json(request, 422, { error: 'A valid subject and newsletter body are required.' })
  }

  if (bannerUrl !== null && bannerUrl !== undefined && !isNonEmptyString(bannerUrl, 2000)) {
    return json(request, 422, { error: 'Banner URL must be a valid string or null.' })
  }

  const cleanSubject = sanitizeString(subject)
  const cleanBody = sanitizeString(body)
  const cleanBannerUrl = typeof bannerUrl === 'string' ? sanitizeString(bannerUrl) : null
  const adminClient = createAdminClient()

  const { data: subscribers, error: subscribersError } = await adminClient
    .from('newsletter_subscribers')
    .select('id, name, email, token')
    .eq('confirmed', true)
    .is('unsubscribed_at', null)

  if (subscribersError) {
    return json(request, 500, { error: 'Failed to load newsletter subscribers.' })
  }

  if (!subscribers || subscribers.length === 0) {
    return json(request, 200, { success: true, message: 'No confirmed subscribers available.', recipientCount: 0 })
  }

  const preparedSubscribers = []

  for (const subscriber of subscribers) {
    let token = subscriber.token

    if (!token) {
      token = createToken()
      const { error: tokenError } = await adminClient
        .from('newsletter_subscribers')
        .update({ token })
        .eq('id', subscriber.id)

      if (tokenError) {
        return json(request, 500, { error: 'Failed to prepare unsubscribe tokens.' })
      }
    }

    preparedSubscribers.push({ ...subscriber, token })
  }

  const emails = preparedSubscribers.map((subscriber) => ({
    to: subscriber.email,
    subject: cleanSubject,
    html: `
      ${cleanBannerUrl ? `<p><img src="${cleanBannerUrl}" alt="Newsletter banner" style="max-width:100%;height:auto;" /></p>` : ''}
      <p>Hello ${subscriber.name ?? 'Subscriber'},</p>
      ${cleanBody}
      <p style="margin-top:24px;">To unsubscribe, click <a href="${siteUrl}/unsubscribe?token=${subscriber.token}">here</a>.</p>
    `,
  }))

  try {
    await sendBatchEmails(emails)
  } catch (error) {
    await adminClient.from('newsletter_sends').insert({
      subject: cleanSubject,
      body: cleanBody,
      banner_url: cleanBannerUrl,
      recipient_count: preparedSubscribers.length,
      failed_count: preparedSubscribers.length,
    })

    return json(request, 502, { error: error instanceof Error ? error.message : 'Newsletter send failed.' })
  }

  const { error: insertError } = await adminClient.from('newsletter_sends').insert({
    subject: cleanSubject,
    body: cleanBody,
    banner_url: cleanBannerUrl,
    recipient_count: preparedSubscribers.length,
    failed_count: 0,
  })

  if (insertError) {
    return json(request, 500, { error: 'Newsletter sent but logging failed.' })
  }

  return json(request, 200, {
    success: true,
    message: 'Newsletter sent successfully.',
    recipientCount: preparedSubscribers.length,
  })
})
