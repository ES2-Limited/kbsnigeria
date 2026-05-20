// Application route definitions.

import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import MainLayout from '../components/layout/MainLayout'
import { useAuth } from '../hooks/useAuth'
import AdminRoute from './AdminRoute'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Academics = lazy(() => import('../pages/Academics'))
const Admissions = lazy(() => import('../pages/Admissions'))
const News = lazy(() => import('../pages/News'))
const NewsPost = lazy(() => import('../pages/NewsPost'))
const Gallery = lazy(() => import('../pages/Gallery'))
const Resources = lazy(() => import('../pages/Resources'))
const Contact = lazy(() => import('../pages/Contact'))
const Unsubscribe = lazy(() => import('../pages/Unsubscribe'))
const Login = lazy(() => import('../pages/admin/Login'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminGallery = lazy(() => import('../pages/admin/AdminGallery'))
const AdminNews = lazy(() => import('../pages/admin/AdminNews'))
const AdminResources = lazy(() => import('../pages/admin/AdminResources'))
const AdminNewsletter = lazy(() => import('../pages/admin/AdminNewsletter'))
const ComponentShowcase = lazy(() => import('../pages/dev/ComponentShowcase'))

function RouteFallback() {
  return <div className="min-h-[40vh] animate-pulse bg-surface-white" />
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

function AdminEntry() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return isAuthenticated ? <Navigate replace to="/admin/dashboard" /> : withSuspense(Login)
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: 'about',
        element: withSuspense(About),
      },
      {
        path: 'academics',
        element: withSuspense(Academics),
      },
      {
        path: 'admissions',
        element: withSuspense(Admissions),
      },
      {
        path: 'news',
        element: withSuspense(News),
      },
      {
        path: 'news/:slug',
        element: withSuspense(NewsPost),
      },
      {
        path: 'gallery',
        element: withSuspense(Gallery),
      },
      {
        path: 'resources',
        element: withSuspense(Resources),
      },
      {
        path: 'contact',
        element: withSuspense(Contact),
      },
      {
        path: 'unsubscribe',
        element: withSuspense(Unsubscribe),
      },
    ],
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: '/dev/components',
          element: withSuspense(ComponentShowcase),
        },
      ]
    : []),
  {
    path: '/admin',
    element: <AdminEntry />,
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: withSuspense(Dashboard),
          },
          {
            path: 'gallery',
            element: withSuspense(AdminGallery),
          },
          {
            path: 'news',
            element: withSuspense(AdminNews),
          },
          {
            path: 'news/new',
            element: withSuspense(AdminNews),
          },
          {
            path: 'news/:id/edit',
            element: withSuspense(AdminNews),
          },
          {
            path: 'resources',
            element: withSuspense(AdminResources),
          },
          {
            path: 'newsletter',
            element: withSuspense(AdminNewsletter),
          },
        ],
      },
    ],
  },
])

export default router
