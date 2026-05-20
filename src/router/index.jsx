// Application route definitions.

import { createBrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import About from '../pages/About'
import Academics from '../pages/Academics'
import Admissions from '../pages/Admissions'
import Contact from '../pages/Contact'
import Gallery from '../pages/Gallery'
import Home from '../pages/Home'
import News from '../pages/News'
import NewsPost from '../pages/NewsPost'
import Resources from '../pages/Resources'
import Unsubscribe from '../pages/Unsubscribe'
import AdminGallery from '../pages/admin/AdminGallery'
import AdminNews from '../pages/admin/AdminNews'
import AdminNewsletter from '../pages/admin/AdminNewsletter'
import AdminResources from '../pages/admin/AdminResources'
import Dashboard from '../pages/admin/Dashboard'
import Login from '../pages/admin/Login'
import AdminRoute from './AdminRoute'

function AdminEntry() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return isAuthenticated ? <Dashboard /> : <Login />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/academics',
    element: <Academics />,
  },
  {
    path: '/admissions',
    element: <Admissions />,
  },
  {
    path: '/news',
    element: <News />,
  },
  {
    path: '/news/:slug',
    element: <NewsPost />,
  },
  {
    path: '/gallery',
    element: <Gallery />,
  },
  {
    path: '/resources',
    element: <Resources />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/unsubscribe',
    element: <Unsubscribe />,
  },
  {
    path: '/admin',
    element: <AdminEntry />,
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        path: 'gallery',
        element: <AdminGallery />,
      },
      {
        path: 'news',
        element: <AdminNews />,
      },
      {
        path: 'news/new',
        element: <AdminNews />,
      },
      {
        path: 'news/:id/edit',
        element: <AdminNews />,
      },
      {
        path: 'resources',
        element: <AdminResources />,
      },
      {
        path: 'newsletter',
        element: <AdminNewsletter />,
      },
    ],
  },
])

export default router
