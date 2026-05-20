// Hook for newsletter subscription requests.

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useNewsletterSubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const subscribe = async ({ email, name }) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: requestError } = await supabase.functions.invoke('send-confirmation', {
        body: { name, email },
      })

      if (requestError) {
        setError('We could not submit your subscription right now. Please try again.')
        return false
      }

      setSuccess('Subscription received. Please check your email to confirm.')
      return true
    } catch {
      setError('We could not submit your subscription right now. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    subscribe,
    loading,
    error,
    success,
  }
}
