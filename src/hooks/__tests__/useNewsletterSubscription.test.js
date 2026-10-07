// Tests for the newsletter subscription hook — especially the honeypot path.

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }))

vi.mock('../../lib/supabase', () => ({
  supabase: { functions: { invoke } },
}))

import { useNewsletterSubscription } from '../useNewsletterSubscription'

describe('useNewsletterSubscription', () => {
  beforeEach(() => {
    invoke.mockReset()
  })

  it('pretends success for honeypot submissions without touching the backend', async () => {
    const { result } = renderHook(() => useNewsletterSubscription())

    let accepted
    await act(async () => {
      accepted = await result.current.subscribe({
        email: 'bot@example.com',
        name: '',
        website: 'https://spam.example',
      })
    })

    expect(accepted).toBe(true)
    expect(invoke).not.toHaveBeenCalled()
    expect(result.current.success).toContain('check your email')
    expect(result.current.error).toBe('')
  })

  it('invokes the edge function with name and email on a normal submit', async () => {
    invoke.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useNewsletterSubscription())

    let accepted
    await act(async () => {
      accepted = await result.current.subscribe({ email: 'parent@example.com', name: 'Ada' })
    })

    expect(accepted).toBe(true)
    expect(invoke).toHaveBeenCalledWith('send-confirmation', {
      body: { name: 'Ada', email: 'parent@example.com' },
    })
    expect(result.current.error).toBe('')
  })

  it('surfaces an error and returns false when the request fails', async () => {
    invoke.mockResolvedValue({ error: { message: 'boom' } })
    const { result } = renderHook(() => useNewsletterSubscription())

    let accepted
    await act(async () => {
      accepted = await result.current.subscribe({ email: 'parent@example.com' })
    })

    expect(accepted).toBe(false)
    expect(result.current.error).toContain('could not submit')
  })
})
