// Entry point for /admin — shows the login form or redirects to the dashboard.

import { Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { PageLoader } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'

const Login = lazy(() => import('../pages/admin/Login'))

function AdminEntry() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  return isAuthenticated ? (
    <Navigate replace to="/admin/dashboard" />
  ) : (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  )
}

export default AdminEntry
