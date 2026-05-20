// Hook for reading resources from Supabase.

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadResources = async () => {
      setLoading(true)
      setError(null)

      const { data, error: requestError } = await supabase
        .from('resources')
        .select('id, title, category, file_url, file_name, uploaded_at')
        .order('uploaded_at', { ascending: false })

      if (!mounted) {
        return
      }

      if (requestError) {
        setError(requestError)
        setResources([])
      } else {
        setResources(data ?? [])
      }

      setLoading(false)
    }

    loadResources()

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
