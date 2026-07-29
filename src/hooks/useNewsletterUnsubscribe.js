// Hook for token-based newsletter unsubscribe via Supabase RLS.

import { createClient } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function useNewsletterUnsubscribe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const unsubscribe = useCallback(async (token) => {
    if (!token?.trim()) {
      setError('This unsubscribe link is missing a valid token.')
      return false
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            'x-confirmation-token': token.trim(),
          },
        },
      })

      const { data, error: updateError } = await client
        .from('newsletter_subscribers')
        .update({
          unsubscribed_at: new Date().toISOString(),
          token: null,
        })
        .eq('token', token.trim())
        .select('id')
        .maybeSingle()

      if (updateError) {
        setError('We could not process your unsubscribe request. Please contact the school.')
        return false
      }

      if (!data) {
        setError('This unsubscribe link is invalid or has already been used.')
        return false
      }

      setSuccess('You have been unsubscribed from KBS Nigeria updates.')
      return true
    } catch {
      setError('We could not process your unsubscribe request. Please try again later.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    unsubscribe,
    loading,
    error,
    success,
  }
}
