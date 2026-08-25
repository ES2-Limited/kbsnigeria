// Tests for the supabase client bootstrap — it must never throw at import time.

import { afterEach, describe, expect, it, vi } from 'vitest'

describe('supabase client bootstrap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('falls back to inert credentials and reports unconfigured when env is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    vi.resetModules()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const module = await import('../supabase')

    expect(module.isSupabaseConfigured).toBe(false)
    expect(module.supabase).toBeTruthy()
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('[KBS] Supabase is not configured'))
  })

  it('is configured with real credentials and skips the warning', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_real-key')
    vi.resetModules()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const module = await import('../supabase')

    expect(module.isSupabaseConfigured).toBe(true)
    expect(consoleError).not.toHaveBeenCalled()
    expect(consoleWarn).not.toHaveBeenCalled()
  })
})
