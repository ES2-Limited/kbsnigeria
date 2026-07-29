// Hook for reading published news posts from Supabase.

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

function buildNewsQuery({ limit, publishedOnly, slug } = {}) {
  let query = supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, body, cover_url, published_at, created_at, updated_at, status')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (publishedOnly) {
    query = query.eq('status', 'published')
  }

  if (slug) {
    query = query.eq('slug', slug).maybeSingle()
  }

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  return query
}

export function useNews({ limit, publishedOnly = true } = {}) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `news:list:${publishedOnly}:${limit ?? 'all'}`

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await buildNewsQuery({ limit, publishedOnly })
      return { data: data ?? [], error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(null)
          setNews([])
        } else {
          setNews(data)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setNews([])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, limit, publishedOnly])

  return {
    news,
    loading,
    error,
    isEmpty: !loading && news.length === 0,
  }
}

export function useNewsPost(slug, { publishedOnly = true } = {}) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cacheKey = `news:post:${publishedOnly}:${slug ?? ''}`

  useEffect(() => {
    let mounted = true

    if (!slug) {
      setPost(null)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(null)

    fetchWithCache(cacheKey, async () => {
      const { data, error: requestError } = await buildNewsQuery({ publishedOnly, slug })
      return { data: data ?? null, error: requestError }
    })
      .then(({ data, error: requestError }) => {
        if (!mounted) {
          return
        }

        if (requestError) {
          setError(requestError)
          setPost(null)
        } else {
          setPost(data)
        }

        setLoading(false)
      })
      .catch((requestError) => {
        if (!mounted) {
          return
        }

        setError(requestError)
        setPost(null)
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cacheKey, publishedOnly, slug])

  return {
    post,
    loading,
    error,
    notFound: !loading && !post && !error,
  }
}
