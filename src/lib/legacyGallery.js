// Static fallback gallery sourced from legacy kbsnigeria.com WordPress uploads.
// Used when Supabase gallery_images is empty or still has placeholder URLs.

import manifest from '../data/legacyGalleryManifest.json'

const PLACEHOLDER_HOST = 'example.supabase.co'

export const LEGACY_GALLERY_IMAGES = manifest.images.map((image, index) => ({
  id: `legacy-${index + 1}`,
  url: image.file,
  caption: image.caption,
  category: image.category,
  uploaded_at: '2019-05-01T00:00:00.000Z',
  isLegacy: true,
}))

export function isPlaceholderGalleryUrl(url) {
  return typeof url === 'string' && url.includes(PLACEHOLDER_HOST)
}

export function getLegacyGalleryImages({ limit } = {}) {
  if (typeof limit === 'number') {
    return LEGACY_GALLERY_IMAGES.slice(0, limit)
  }

  return LEGACY_GALLERY_IMAGES
}

function galleryUrlKey(url) {
  if (!url) {
    return ''
  }

  try {
    const path = url.startsWith('http') ? new URL(url).pathname : url
    return path.split('/').pop()?.toLowerCase() ?? ''
  } catch {
    return url.split('/').pop()?.toLowerCase() ?? ''
  }
}

export function mergeGalleryWithLegacy(dbImages, { limit } = {}) {
  const legacy = getLegacyGalleryImages()
  const seen = new Set(dbImages.map((image) => galleryUrlKey(image.url)))

  const merged = [
    ...dbImages,
    ...legacy.filter((image) => !seen.has(galleryUrlKey(image.url))),
  ]

  if (typeof limit === 'number') {
    return merged.slice(0, limit)
  }

  return merged
}

export const LEGACY_STAFF_PHOTOS = {
  principal: '/assets/legacy-gallery/head-teacher-and-pupils.jpg',
  staff: [
    '/assets/legacy-gallery/head-teacher-and-pupils.jpg',
    '/assets/legacy-gallery/teachers-classroom.jpg',
  ],
  socialProfile: '/assets/social/facebook-profile.jpg',
}
