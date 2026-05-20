import { handleCors } from '../_shared/cors.ts'
import { json } from '../_shared/http.ts'
import { sendEmail } from '../_shared/resend.ts'
import { createAdminClient } from '../_shared/supabase.ts'
import { getClientIp, isEmail, isNonEmptyString, sanitizeString } from '../_shared/validation.ts'

const adminEmail = Deno.env.get('ADMIN_EMAIL')

if (!adminEmail) {
  throw new Error('Missing ADMIN_EMAIL environment variable.')
}

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

  const { parentName, childName, classLevel, phone, email, message } = payload

  if (
    !isNonEmptyString(parentName, 120) ||
    !isNonEmptyString(childName, 120) ||
    !isNonEmptyString(classLevel, 120) ||
    !isNonEmptyString(phone, 40) ||
    !isEmail(email) ||
    !isNonEmptyString(message, 3000)
  ) {
    return json(request, 422, { error: 'Please provide valid enquiry details.' })
  }

  const adminClient = createAdminClient()
  const clientIp = getClientIp(request)
  const { data: rateLimitAllowed, error: rateLimitError } = await adminClient.rpc('take_rate_limit', {
    p_rate_key: `send-enquiry:${clientIp}`,
    p_window_seconds: 60,
  })

  if (rateLimitError) {
    return json(request, 500, { error: 'Rate limit check failed.' })
  }

  if (!rateLimitAllowed) {
    return json(request, 429, { error: 'Too many requests. Please wait before trying again.' })
  }

  const cleanParentName = sanitizeString(parentName)
  const cleanChildName = sanitizeString(childName)
  const cleanClassLevel = sanitizeString(classLevel)
  const cleanPhone = sanitizeString(phone)
  const cleanEmail = sanitizeString(email)
  const cleanMessage = sanitizeString(message)

  try {
    await sendEmail({
      to: adminEmail,
      subject: `New admissions enquiry from ${cleanParentName}`,
      html: `
        <h2>New Admissions Enquiry</h2>
        <p><strong>Parent Name:</strong> ${cleanParentName}</p>
        <p><strong>Child Name:</strong> ${cleanChildName}</p>
        <p><strong>Class Level:</strong> ${cleanClassLevel}</p>
        <p><strong>Phone:</strong> ${cleanPhone}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      `,
    })

    await sendEmail({
      to: cleanEmail,
      subject: 'We received your KBS Nigeria enquiry',
      html: `
        <p>Hello ${cleanParentName},</p>
        <p>Thank you for contacting KBS Nigeria. Our admissions team has received your enquiry and will get back to you shortly.</p>
        <p><strong>Child:</strong> ${cleanChildName}</p>
        <p><strong>Requested Class Level:</strong> ${cleanClassLevel}</p>
        <p>Warm regards,<br />KBS Nigeria Admissions</p>
      `,
    })
  } catch (error) {
    return json(request, 502, { error: error instanceof Error ? error.message : 'Email delivery failed.' })
  }

  return json(request, 200, { success: true, message: 'Enquiry sent successfully.' })
})
