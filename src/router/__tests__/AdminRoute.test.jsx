// Tests for the auth guard behaviour of AdminRoute.

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { authState } = vi.hoisted(() => ({
  authState: { isAuthenticated: false, loading: false },
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => authState,
}))

import AdminRoute from '../AdminRoute'

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/admin/dashboard']}>
      <Routes>
        <Route path="/admin" element={<div>LOGIN PAGE</div>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<div>SECRET DASHBOARD</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  beforeEach(() => {
    authState.isAuthenticated = false
    authState.loading = false
  })

  it('shows the page loader while the session is being resolved', () => {
    authState.loading = true
    renderGuard()

    expect(screen.getByText('Loading page')).toBeInTheDocument()
    expect(screen.queryByText('SECRET DASHBOARD')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated visitors to /admin', () => {
    renderGuard()

    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument()
    expect(screen.queryByText('SECRET DASHBOARD')).not.toBeInTheDocument()
  })

  it('renders the protected outlet when authenticated', () => {
    authState.isAuthenticated = true
    renderGuard()

    expect(screen.getByText('SECRET DASHBOARD')).toBeInTheDocument()
  })
})
