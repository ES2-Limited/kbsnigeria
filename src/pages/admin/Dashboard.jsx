// Admin dashboard page.

import { FolderOpen, Image, Mail, Newspaper, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { StatCardSkeleton } from '../../components/ui/Skeleton'
import { fetchWithCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'

const summaryItems = [
  { key: 'news_posts', label: 'News Posts', icon: Newspaper },
  { key: 'gallery_images', label: 'Gallery Images', icon: Image },
  { key: 'resources', label: 'Resources', icon: FolderOpen },
  { key: 'newsletter_subscribers', label: 'Subscribers', icon: Users },
]

const DASHBOARD_CACHE_KEY = 'admin:dashboard-counts'

function Dashboard() {
  const [counts, setCounts] = useState({
    gallery_images: 0,
    newsletter_subscribers: 0,
    news_posts: 0,
    resources: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    setLoading(true)

    fetchWithCache(DASHBOARD_CACHE_KEY, async () => {
      const [newsResult, galleryResult, resourcesResult, subscribersResult] = await Promise.all([
        supabase.from('news_posts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ])

      return {
        gallery_images: galleryResult.count ?? 0,
        newsletter_subscribers: subscribersResult.count ?? 0,
        news_posts: newsResult.count ?? 0,
        resources: resourcesResult.count ?? 0,
      }
    })
      .then((nextCounts) => {
        if (mounted) {
          setCounts(nextCounts)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Dashboard</p>
          <h1 className="font-display text-h1 text-text-primary">Admin Overview</h1>
        </div>
        <div className="flex w-full flex-col gap-3 xs:flex-row sm:w-auto">
          <Button as="link" fullWidth size="md" to="/admin/news/new" variant="primary">
            Create News Post
          </Button>
          <Button as="link" fullWidth size="md" to="/admin/newsletter" variant="secondary">
            <Mail className="h-4 w-4" />
            <span>Newsletter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {loading
          ? summaryItems.map(({ key }) => <StatCardSkeleton key={key} />)
          : summaryItems.map(({ icon: Icon, key, label }) => (
              <Card className="space-y-4" key={key}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-body text-sm font-medium text-text-secondary">{label}</p>
                  <div className="rounded-xl bg-bg-light p-3 text-text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="font-display text-4xl text-text-primary sm:text-5xl">{counts[key]}</p>
              </Card>
            ))}
      </div>

      <Card className="space-y-5">
        <h2 className="font-display text-h2 text-text-primary">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link className="min-h-11 rounded-xl bg-bg-light px-4 py-3 font-body text-sm text-text-secondary transition-colors duration-200 hover:bg-brand-accent/10 hover:text-brand-primary" to="/admin/gallery">
            Manage Gallery
          </Link>
          <Link className="min-h-11 rounded-xl bg-bg-light px-4 py-3 font-body text-sm text-text-secondary transition-colors duration-200 hover:bg-brand-accent/10 hover:text-brand-primary" to="/admin/news">
            Manage News
          </Link>
          <Link className="min-h-11 rounded-xl bg-bg-light px-4 py-3 font-body text-sm text-text-secondary transition-colors duration-200 hover:bg-brand-accent/10 hover:text-brand-primary" to="/admin/resources">
            Manage Resources
          </Link>
          <Link className="min-h-11 rounded-xl bg-bg-light px-4 py-3 font-body text-sm text-text-secondary transition-colors duration-200 hover:bg-brand-accent/10 hover:text-brand-primary" to="/admin/newsletter">
            Newsletter & Subscribers
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
