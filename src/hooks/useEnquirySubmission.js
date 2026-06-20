// Hook for admissions enquiry submissions.

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useEnquirySubmission() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submitEnquiry = async (payload) => {
    if (payload.website?.trim()) {
      setSuccess('Your enquiry has been sent successfully. Our admissions team will contact you shortly.')
      return true
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: requestError } = await supabase.functions.invoke('send-enquiry', {
        body: payload,
      })

      if (requestError) {
        setError('We could not send your enquiry right now. Please try again.')
        return false
      }

      setSuccess('Your enquiry has been sent successfully. Our admissions team will contact you shortly.')
      return true
    } catch {
      setError('We could not send your enquiry right now. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    submitEnquiry,
    loading,
    error,
    success,
  }
}
