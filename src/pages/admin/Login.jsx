// Admin login page.

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!authLoading && isAuthenticated) {
    return <Navigate replace to="/admin/dashboard" />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) {
      setError(signInError.message || 'Unable to sign in with the provided credentials.')
      setLoading(false)
      return
    }

    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-brand-gray/30 bg-white p-8 shadow-sm">
        <div className="mb-8 space-y-3 text-center">
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">KBS Nigeria Admin</p>
          <h1 className="font-display text-4xl text-text-primary">Sign In</h1>
          <p className="font-body text-sm text-text-secondary">Use your administrator email and password to access the content panel.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input label="Email Address" name="email" onChange={handleChange} required type="email" value={formData.email} />
          <Input label="Password" name="password" onChange={handleChange} required type="password" value={formData.password} />
          {error ? <p className="font-body text-sm text-error">{error}</p> : null}
          <Button className="w-full" loading={loading} size="lg" type="submit" variant="primary">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
