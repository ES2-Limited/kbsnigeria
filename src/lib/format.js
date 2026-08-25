// Shared date formatting helpers — single source for public and admin pages.

const longDateFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** "12 June 2026" — falls back to "Coming soon" for empty values. */
export function formatDate(value) {
  if (!value) {
    return 'Coming soon'
  }

  return longDateFormatter.format(new Date(value))
}

/** "12 Jun 2026" — falls back to "Not set" for empty values (admin tables). */
export function formatAdminDate(value) {
  if (!value) {
    return 'Not set'
  }

  return shortDateFormatter.format(new Date(value))
}
