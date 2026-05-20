// Shared helpers for admin pages.

export function formatAdminDate(value) {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function getPublicStoragePath(fileUrl, bucket) {
  try {
    const url = new URL(fileUrl)
    const marker = `/storage/v1/object/public/${bucket}/`
    const index = url.pathname.indexOf(marker)

    if (index === -1) {
      return null
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length))
  } catch {
    return null
  }
}
