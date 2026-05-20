// Hook for reading published news posts from Supabase.

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let mounted = true

    const loadNews = async () => {
      setLoading(true)
      setError(null)

      const query = buildNewsQuery({ limit, publishedOnly })
      const { data, error: requestError } = await query

      if (!mounted) {
        return
      }

      if (requestError) {
        // Treat errors as empty state for homepage teaser
        setError(null)
        setNews([])
      } else {
        setNews(data ?? [])
      }

      setLoading(false)
    }

    loadNews()

    return () => {
      mounted = false
    }
  }, [limit, publishedOnly])

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

  useEffect(() => {
    let mounted = true

    const loadPost = async () => {
      if (!slug) {
        setPost(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const { data, error: requestError } = await buildNewsQuery({ publishedOnly, slug })

      if (!mounted) {
        return
      }

      if (requestError) {
        setError(requestError)
        setPost(null)
      } else {
        setPost(data ?? null)
      }

      setLoading(false)
    }

    loadPost()

    return () => {
      mounted = false
    }
  }, [publishedOnly, slug])

  return {
    post,
    loading,
    error,
    notFound: !loading && !post && !error,
  }
}
