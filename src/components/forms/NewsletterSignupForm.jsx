// Shared newsletter signup form — honeypot protected, feedback announced to
// assistive tech via role="status". Supports light (default) and dark tones
// so it can live on any background.

import { useState } from 'react'
import { useNewsletterSubscription } from '../../hooks/useNewsletterSubscription'
import Button from '../ui/Button'
import HoneypotField from '../ui/HoneypotField'
import Input from '../ui/Input'

const darkInputClass =
  'rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20'

function NewsletterSignupForm({ tone = 'light' }) {
  const isDark = tone === 'dark'
  const { error, loading, subscribe, success } = useNewsletterSubscription()
  const [formData, setFormData] = useState({ email: '', name: '', website: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const didSubscribe = await subscribe(formData)
    if (didSubscribe) {
      setFormData({ email: '', name: '', website: '' })
    }
  }

  return (
    <form className={isDark ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-5 sm:grid-cols-2'} onSubmit={handleSubmit}>
      <HoneypotField onChange={handleChange} value={formData.website} />
      <Input
        className={isDark ? darkInputClass : undefined}
        label="Name"
        labelClassName={isDark ? 'sr-only sm:not-sr-only text-white' : 'sr-only sm:not-sr-only'}
        name="name"
        onChange={handleChange}
        placeholder="Your name"
        required
        value={formData.name}
      />
      <Input
        className={isDark ? darkInputClass : undefined}
        label="Email"
        labelClassName={isDark ? 'sr-only sm:not-sr-only text-white' : 'sr-only sm:not-sr-only'}
        name="email"
        onChange={handleChange}
        placeholder="your@email.com"
        required
        type="email"
        value={formData.email}
      />
      <div className={`flex flex-col items-center gap-4 sm:col-span-2 ${isDark ? '' : ''}`}>
        <Button fullWidth loading={loading} loadingText="Subscribing..." size="lg" type="submit" variant="primary">
          Subscribe
        </Button>
        {success ? (
          <p className={`text-center font-body text-sm ${isDark ? 'text-white/85' : 'text-success'}`} role="status">
            {success}
          </p>
        ) : null}
        {error ? (
          <p className={`text-center font-body text-sm ${isDark ? 'text-red-400' : 'text-error'}`} role="alert">
            {error}
          </p>
        ) : null}
        {!isDark ? (
          <p className="text-center font-body text-sm text-text-secondary">
            Join families already subscribed to KBS updates.
          </p>
        ) : null}
      </div>
    </form>
  )
}

export default NewsletterSignupForm
