// Auth guard for protected admin routes.

import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'

function AdminRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default AdminRoute
