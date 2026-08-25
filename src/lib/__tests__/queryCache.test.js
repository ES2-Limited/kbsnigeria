// Regression tests for the in-memory query cache.

import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchWithCache, invalidateQueryCache } from '../queryCache'

describe('fetchWithCache', () => {
  afterEach(() => {
    invalidateQueryCache('k')
    invalidateQueryCache('d')
    invalidateQueryCache('ttl')
    vi.useRealTimers()
  })

  it('dedupes concurrent identical requests into one fetcher call', async () => {
    const fetcher = vi.fn(() => Promise.resolve('x'))

    const first = fetchWithCache('d', fetcher)
    const second = fetchWithCache('d', fetcher)

    expect(second).toBe(first)
    await first
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('serves repeat reads from cache within the TTL', async () => {
    vi.useFakeTimers()
    const fetcher = vi.fn(() => Promise.resolve(1))

    await fetchWithCache('ttl', fetcher)
    vi.advanceTimersByTime(10_000)
    await fetchWithCache('ttl', fetcher)
    expect(fetcher).toHaveBeenCalledTimes(1)

    // Past the 30s default TTL a fresh fetch happens.
    vi.advanceTimersByTime(25_000)
    await fetchWithCache('ttl', fetcher)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('a stale response cannot overwrite a newer fetch started after invalidation', async () => {
    let resolveSlow
    const slowFetch = () =>
      new Promise((resolve) => {
        resolveSlow = resolve
      })

    const slowPromise = fetchWithCache('k', slowFetch)

    // Invalidate mid-flight and start a fresh fetch that resolves immediately.
    invalidateQueryCache('k')
    await fetchWithCache('k', () => Promise.resolve('fresh'))

    // The original slow request finally lands — it must not clobber "fresh".
    resolveSlow('stale')
    await slowPromise

    const value = await fetchWithCache('k', () => Promise.resolve('third'))
    expect(value).toBe('fresh')
  })

  it('invalidateQueryCache evicts exact keys and keys sharing a prefix', async () => {
    const fetcher = vi.fn(() => Promise.resolve('value'))

    await fetchWithCache('k:list', fetcher)
    await fetchWithCache('k:item:1', fetcher)

    invalidateQueryCache('k')

    await fetchWithCache('k:list', fetcher)
    expect(fetcher).toHaveBeenCalledTimes(3)
  })
})
