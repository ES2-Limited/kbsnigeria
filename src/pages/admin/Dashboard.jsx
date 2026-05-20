// Admin dashboard page.

import { FolderOpen, Image, Mail, Newspaper, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

const summaryItems = [
  { key: 'news_posts', label: 'News Posts', icon: Newspaper },
  { key: 'gallery_images', label: 'Gallery Images', icon: Image },
  { key: 'resources', label: 'Resources', icon: FolderOpen },
  { key: 'newsletter_subscribers', label: 'Subscribers', icon: Users },
]

function Dashboard() {
  const [counts, setCounts] = useState({
    gallery_images: 0,
    newsletter_subscribers: 0,
    news_posts: 0,
    resources: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      setLoading(true)

      const [newsResult, galleryResult, resourcesResult, subscribersResult] = await Promise.all([
        supabase.from('news_posts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ])

      setCounts({
        gallery_images: galleryResult.count ?? 0,
        newsletter_subscribers: subscribersResult.count ?? 0,
        news_posts: newsResult.count ?? 0,
        resources: resourcesResult.count ?? 0,
      })
      setLoading(false)
    }

    loadCounts()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-kbs-cyan">Dashboard</p>
          <h1 className="font-display text-4xl text-kbs-navy">Admin Overview</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as="link" to="/admin/news/new" variant="primary">Create News Post</Button>
          <Button as="link" to="/admin/newsletter" variant="secondary">
            <Mail className="h-4 w-4" />
            <span>Send Newsletter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map(({ icon: Icon, key, label }) => (
          <Card className="space-y-4" key={key}>
            <div className="flex items-center justify-between">
              <p className="font-body text-sm font-medium text-text-medium">{label}</p>
              <div className="rounded-full bg-surface-grey p-3 text-kbs-navy">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-5xl text-kbs-navy">{loading ? '...' : counts[key]}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-5">
        <h2 className="font-display text-3xl text-kbs-navy">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full bg-surface-grey px-4 py-3 font-body text-sm text-text-medium transition-colors duration-200 hover:text-kbs-navy" to="/admin/gallery">Manage Gallery</Link>
          <Link className="rounded-full bg-surface-grey px-4 py-3 font-body text-sm text-text-medium transition-colors duration-200 hover:text-kbs-navy" to="/admin/news">Manage News</Link>
          <Link className="rounded-full bg-surface-grey px-4 py-3 font-body text-sm text-text-medium transition-colors duration-200 hover:text-kbs-navy" to="/admin/resources">Manage Resources</Link>
          <Link className="rounded-full bg-surface-grey px-4 py-3 font-body text-sm text-text-medium transition-colors duration-200 hover:text-kbs-navy" to="/admin/newsletter">Newsletter & Subscribers</Link>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
