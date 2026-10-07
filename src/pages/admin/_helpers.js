// Shared helpers for admin pages.

export { formatAdminDate } from '../../lib/format'

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
