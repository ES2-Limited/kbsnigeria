// Hook for reading resources from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

const CACHE_KEY = 'resources:all'

export function useResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(CACHE_KEY, async () => {
      const { data, error: requestError } = await supabase
        .from('resources')
        .select('id, title, category, file_url, file_name, uploaded_at')
        .order('uploaded_at', { ascending: false })

      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(requestError)
          setResources([])
        } else {
          setResources(data)
        }

        setLoading(false)
      })
      .catch((requestError) => {
        if (!mounted) {
          return
        }

        setError(requestError)
        setResources([])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return {
    resources,
    loading,
    error,
    isEmpty: !loading && resources.length === 0,
  }
}
