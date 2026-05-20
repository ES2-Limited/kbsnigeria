// Hook for reading gallery images from Supabase.

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useGallery({ limit = 6 } = {}) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadImages = async () => {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('gallery_images')
        .select('id, url, caption, uploaded_at')
        .order('uploaded_at', { ascending: false })

      if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      const { data, error: requestError } = await query

      if (!mounted) {
        return
      }

      if (requestError) {
        // Treat errors as empty state for homepage teaser
        setError(null)
        setImages([])
      } else {
        setImages(data ?? [])
      }

      setLoading(false)
    }

    loadImages()

    return () => {
      mounted = false
    }
  }, [limit])

  return {
    images,
    loading,
    error,
    isEmpty: !loading && images.length === 0,
  }
}
