import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for Edge Functions.')
}

export function createAdminClient() {
  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export function createAuthedClient(authHeader: string) {
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authHeader } },
  })
}

export { supabaseUrl }
