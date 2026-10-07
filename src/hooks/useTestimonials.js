// Hook for reading testimonials from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

function buildTestimonialsQuery({ featured, limit } = {}) {
  let query = supabase
    .from('testimonials')
    .select('id, name, role, quote, video_url, photo_url, tier, featured, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (featured) {
    query = query.eq('featured', true)
  }

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  return query
}

export function useTestimonials({ featured = false, limit } = {}) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `testimonials:${featured}:${limit ?? 'all'}`

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await buildTestimonialsQuery({ featured, limit })
      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(null)
          setTestimonials([])
        } else {
          setTestimonials(data)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setTestimonials([])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, featured, limit])

  return {
    testimonials,
    loading,
    error,
    isEmpty: !loading && testimonials.length === 0,
  }
}
