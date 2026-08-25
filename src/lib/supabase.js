// Supabase client initialisation.
//
// Never throws at import time: if configuration is missing or still set to the
// placeholder values from .env.example, we fall back to inert credentials so
// the app can mount and pages can render their error/empty states instead of
// white-screening the whole application.

import { createClient } from '@supabase/supabase-js'

const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_ANON_KEY = 'placeholder-anon-key'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isPlaceholder = (value) => !value || value.toLowerCase().includes('placeholder')

export const isSupabaseConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error(
    '[KBS] Supabase is not configured. Copy .env.example to .env.local, fill in VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY from Dashboard → Settings → API Keys, then restart `npm run dev`. ' +
      'Pages will show empty/error states until real credentials are provided.',
  )
} else if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_publishable_')) {
  console.warn(
    '[KBS] Supabase key should be the legacy anon JWT (eyJ...) or new publishable key (sb_publishable_...). Copy from Dashboard → Settings → API Keys.',
  )
}

export const supabase = createClient(supabaseUrl || FALLBACK_URL, supabaseAnonKey || FALLBACK_ANON_KEY)
