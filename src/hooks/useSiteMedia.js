// Hook for reading site media entries (e.g. hero tour video) from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

export function useSiteMedia(key) {
  const [media, setMedia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `site_media:${key ?? ''}`

  useEffect(() => {
    let mounted = true

    if (!key) {
      setMedia(null)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await supabase
        .from('site_media')
        .select('id, key, type, embed_url, poster_url, caption, updated_at')
        .eq('key', key)
        .maybeSingle()

      return { data: data ?? null, error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(requestError)
          setMedia(null)
        } else {
          setMedia(data)
        }

        setLoading(false)
      })
      .catch((requestError) => {
        if (!mounted) {
          return
        }

        setError(requestError)
        setMedia(null)
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, key])

  return {
    media,
    loading,
    error,
    isEmpty: !loading && !media,
  }
}
