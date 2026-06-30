// Supabase client initialisation.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (import.meta.env.DEV) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '[KBS] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local. Restart `npm run dev` after saving.',
    )
  } else if (
    !supabaseAnonKey.startsWith('eyJ') &&
    !supabaseAnonKey.startsWith('sb_publishable_')
  ) {
    console.warn(
      '[KBS] Supabase key should be the legacy anon JWT (eyJ...) or new publishable key (sb_publishable_...). Copy from Dashboard → Settings → API Keys.',
    )
  }
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
