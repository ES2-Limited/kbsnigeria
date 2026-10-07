// Hook for reading school events from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

function buildEventsQuery({ publishedOnly = true, featured, upcoming, limit } = {}) {
  let query = supabase
    .from('events')
    .select('id, title, slug, type, event_date, description, cta_label, cta_url, featured, status, created_at')
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (publishedOnly) {
    query = query.eq('status', 'published')
  }

  if (featured) {
    query = query.eq('featured', true)
  }

  if (upcoming) {
    query = query.gte('event_date', new Date().toISOString())
  }

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  return query
}

export function useEvents({ publishedOnly = true, featured = false, upcoming = false, limit } = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `events:${publishedOnly}:${featured}:${upcoming}:${limit ?? 'all'}`

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await buildEventsQuery({ publishedOnly, featured, upcoming, limit })
      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(null)
          setEvents([])
        } else {
          setEvents(data)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setEvents([])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, featured, limit, publishedOnly, upcoming])

  return {
    events,
    loading,
    error,
    isEmpty: !loading && events.length === 0,
  }
}
