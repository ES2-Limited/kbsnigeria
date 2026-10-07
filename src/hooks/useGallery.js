// Hook for reading gallery images from Supabase.

import { useEffect, useState } from 'react'
import {
  getLegacyGalleryImages,
  isPlaceholderGalleryUrl,
  mergeGalleryWithLegacy,
} from '../lib/legacyGallery'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

function resolveGalleryImages(data, { limit } = {}) {
  const usable = (data ?? []).filter((image) => image.url && !isPlaceholderGalleryUrl(image.url))

  if (usable.length === 0) {
    return getLegacyGalleryImages({ limit: limit === 'all' ? undefined : limit })
  }

  return mergeGalleryWithLegacy(usable, { limit: limit === 'all' ? undefined : limit })
}

export function useGallery({ limit = 6 } = {}) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `gallery:v3:${limit === 'all' ? 'all' : limit}`

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      let query = supabase
        .from('gallery_images')
        .select('id, url, caption, uploaded_at')
        .order('uploaded_at', { ascending: false })

      if (typeof limit === 'number') {
        query = query.limit(Math.max(limit, 24))
      }

      const { data, error: requestError } = await query
      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(null)
          setImages(getLegacyGalleryImages({ limit: limit === 'all' ? undefined : limit }))
        } else {
          setImages(resolveGalleryImages(data, { limit }))
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setImages(getLegacyGalleryImages({ limit: limit === 'all' ? undefined : limit }))
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, limit])

  return {
    images,
    loading,
    error,
    isEmpty: !loading && images.length === 0,
  }
}
