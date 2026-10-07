// Hook for reading achievements from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

function buildAchievementsQuery({ featured, limit } = {}) {
  let query = supabase
    .from('achievements')
    .select('id, title, category, year, description, image_url, featured, sort_order, created_at')
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

export function useAchievements({ featured = false, limit } = {}) {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `achievements:${featured}:${limit ?? 'all'}`

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await buildAchievementsQuery({ featured, limit })
      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(null)
          setAchievements([])
        } else {
          setAchievements(data)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setAchievements([])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, featured, limit])

  return {
    achievements,
    loading,
    error,
    isEmpty: !loading && achievements.length === 0,
  }
}
