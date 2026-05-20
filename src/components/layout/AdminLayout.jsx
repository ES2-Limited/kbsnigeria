// Admin layout with desktop sidebar and mobile top tabs.

import { FolderOpen, Image, Newspaper, Send } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../../lib/cn'

const adminItems = [
  { label: 'Dashboard', to: '/admin', end: true, icon: null },
  { label: 'Gallery', to: '/admin/gallery', icon: Image },
  { label: 'News', to: '/admin/news', icon: Newspaper },
  { label: 'Resources', to: '/admin/resources', icon: FolderOpen },
  { label: 'Newsletter', to: '/admin/newsletter', icon: Send },
]

function AdminNavLink({ item }) {
  const Icon = item.icon

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm transition-colors duration-200',
          isActive ? 'bg-kbs-cyan text-white' : 'text-text-medium hover:bg-white hover:text-kbs-navy',
        )
      }
      end={item.end}
      to={item.to}
    >
      {Icon ? <Icon className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full bg-current" />}
      <span>{item.label}</span>
    </NavLink>
  )
}

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-text-dark">
      <div className="border-b border-surface-grey bg-white px-4 py-4 sm:px-6 lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-kbs-navy">KBS Admin</p>
            <p className="font-body text-sm text-text-medium">Content management panel</p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto pb-1">
          {adminItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-full px-4 py-2 font-body text-sm transition-colors duration-200',
                  isActive ? 'bg-kbs-cyan text-white' : 'bg-surface-grey text-text-medium hover:text-kbs-navy',
                )
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[16rem_1fr] lg:gap-8 lg:px-6 xl:px-8">
        <aside className="hidden bg-surface-grey lg:block lg:min-h-screen lg:rounded-r-3xl lg:px-5 lg:py-8">
          <div className="mb-8 px-3">
            <p className="font-display text-3xl text-kbs-navy">KBS Admin</p>
            <p className="mt-2 font-body text-sm text-text-medium">Manage news, resources, gallery, and newsletters.</p>
          </div>
          <nav aria-label="Admin sidebar navigation" className="space-y-2">
            {adminItems.map((item) => (
              <AdminNavLink item={item} key={item.to} />
            ))}
          </nav>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-0 lg:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
