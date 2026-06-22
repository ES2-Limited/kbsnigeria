// Hook for reading gallery images from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

export function useGallery({ limit = 6 } = {}) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `gallery:${typeof limit === 'number' ? limit : 'all'}`

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
        query = query.limit(limit)
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
          setImages([])
        } else {
          setImages(data)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setImages([])
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
