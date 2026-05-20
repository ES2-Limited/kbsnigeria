const resendApiKey = Deno.env.get('RESEND_API_KEY')
const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL')

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing Resend environment variables for Edge Functions.')
}

type ResendRecipient = string | string[]

type SendEmailInput = {
  to: ResendRecipient
  subject: string
  html: string
  text?: string
}

export async function sendEmail(input: SendEmailInput) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      ...input,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend email failed: ${errorText}`)
  }

  return response.json()
}

export async function sendBatchEmails(emails: Array<SendEmailInput>) {
  const response = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emails.map((email) => ({ from: resendFromEmail, ...email }))),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend batch send failed: ${errorText}`)
  }

  return response.json()
}
