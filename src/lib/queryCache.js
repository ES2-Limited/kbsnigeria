// In-memory request deduplication and short-lived cache for Supabase reads.

const cache = new Map()
const inflight = new Map()

const DEFAULT_TTL_MS = 30_000

export function fetchWithCache(key, fetcher, { ttl = DEFAULT_TTL_MS } = {}) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.at < ttl) {
    return Promise.resolve(cached.value)
  }

  if (inflight.has(key)) {
    return inflight.get(key)
  }

  const promise = Promise.resolve()
    .then(fetcher)
    .then((value) => {
      cache.set(key, { value, at: Date.now() })
      inflight.delete(key)
      return value
    })
    .catch((error) => {
      inflight.delete(key)
      throw error
    })

  inflight.set(key, promise)
  return promise
}

export function invalidateQueryCache(keyOrPrefix) {
  for (const key of cache.keys()) {
    if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
      cache.delete(key)
    }
  }

  for (const key of inflight.keys()) {
    if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
      inflight.delete(key)
    }
  }
}
