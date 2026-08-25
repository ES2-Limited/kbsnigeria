// Shared auth state — one Supabase listener for the whole app.
// Consumers use the `useAuth` hook; this provider must wrap the router.

import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { supabase } from '../lib/supabase'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data.session ?? null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    async function signOut() {
      await supabase.auth.signOut()
    }

    return {
      session,
      user: session?.user ?? null,
      loading,
      isAuthenticated: Boolean(session),
      signOut,
    }
  }, [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
