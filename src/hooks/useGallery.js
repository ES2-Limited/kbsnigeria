// Hook for reading gallery images from Supabase.
//
// Supports three modes:
// - `{ pageSize }` — paged "load more" mode accumulating appended pages
// - `{ limit }`    — single bounded fetch (used for teasers)
// - no args        — legacy unbounded fetch (kept for compatibility)

import { useEffect, useState } from 'react'
import { fetchWithCache } from '../lib/queryCache'
import { supabase } from '../lib/supabase'

const GALLERY_COLUMNS = 'id, url, caption, uploaded_at'

function buildGalleryQuery({ limit, pageSize, pageIndex = 0 }) {
  let query = supabase
    .from('gallery_images')
    .select(GALLERY_COLUMNS)
    .order('uploaded_at', { ascending: false })

  if (typeof pageSize === 'number') {
    query = query.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
  } else if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  return query
}

export function useGallery({ limit = 6, pageSize } = {}) {
  const isPaged = typeof pageSize === 'number'
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagesLoaded, setPagesLoaded] = useState(1)
  const [lastPageCount, setLastPageCount] = useState(null)

  useEffect(() => {
    let mounted = true
    let cancelled = false

    setLoading(true)
    setError(null)

    const loadPages = async () => {
      const pageIndices = Array.from({ length: pagesLoaded }, (_, index) => index)

      const results = await Promise.all(
        pageIndices.map(async (pageIndex) => {
          const cacheKey = isPaged
            ? `gallery:page:${pageIndex}:size:${pageSize}`
            : `gallery:${typeof limit === 'number' ? limit : 'all'}`

          return fetchWithCache(cacheKey, async () => {
            const { data, error: requestError } = await buildGalleryQuery({
              limit,
              pageIndex,
              pageSize: isPaged ? pageSize : undefined,
            })
            return { data: data ?? [], error: requestError }
          })
        }),
      )

      if (cancelled || !mounted) {
        return
      }

      const firstError = results.find((result) => result.error)?.error ?? null

      if (firstError) {
        setError(firstError)
        setImages([])
        setLastPageCount(null)
      } else {
        // Dedupe by id in case range windows ever overlap between pages.
        const seen = new Set()
        const combined = results.flatMap((result) => result.data).filter((image) => {
          if (seen.has(image.id)) {
            return false
          }
          seen.add(image.id)
          return true
        })
        setImages(combined)
        setLastPageCount(results[results.length - 1].data.length)
      }

      setLoading(false)
    }

    loadPages().catch(() => {
      if (!cancelled && mounted) {
        setImages([])
        setLastPageCount(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      cancelled = true
    }
  }, [isPaged, limit, pageSize, pagesLoaded])

  return {
    images,
    loading,
    error,
    isEmpty: !loading && images.length === 0,
    hasMore: isPaged && !error && lastPageCount === pageSize,
    isLoadingMore: loading && images.length > 0,
    loadMore: () => {
      if (isPaged) {
        setPagesLoaded((current) => current + 1)
      }
    },
  }
}
