// News index page implementation following PRD US-05.

import { motion, useReducedMotion } from 'framer-motion'
import EmptyState from '../components/ui/EmptyState'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import NewsCard from '../components/ui/NewsCard'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useNews } from '../hooks/useNews'
import { fadeUpMotion } from '../lib/motion'

function formatDate(value) {
  if (!value) {
    return 'Coming soon'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function NewsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div className="overflow-hidden rounded-2xl border border-surface-grey bg-white shadow-sm" key={item}>
          <div className="aspect-[16/10] animate-pulse bg-surface-grey" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-24 animate-pulse rounded-full bg-surface-grey" />
            <div className="h-8 animate-pulse rounded-xl bg-surface-grey" />
            <div className="h-20 animate-pulse rounded-2xl bg-surface-grey" />
          </div>
        </div>
      ))}
    </div>
  )
}

function News() {
  const prefersReducedMotion = useReducedMotion()
  const { news, loading, error, isEmpty } = useNews({ publishedOnly: true })

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/news"
        description="Read the latest news, school updates, and announcements from Knowledgebased Basic Science Schools, FHA Lugbe, Abuja."
        title="News & Announcements | KBS Nigeria"
      />

      <section className="overflow-hidden bg-[var(--gradient-hero)] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">News & Announcements</p>
            <h1 className="font-display text-5xl leading-[1.15] text-white sm:text-[3.25rem] lg:text-[3.5rem]">
              School Updates for Parents and Families
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Follow school activities, term reminders, events, and important notices from across the KBS community.
            </p>
          </motion.div>
        </div>
        <WaveDivider color="white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          {loading ? <NewsSkeleton /> : null}
          {!loading && error ? <p className="font-body text-sm text-error">Unable to load news posts right now.</p> : null}

          {!loading && !error && !isEmpty ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {news.map((item) => (
                <NewsCard
                  category="News"
                  coverImage={item.cover_url}
                  date={formatDate(item.published_at ?? item.created_at)}
                  excerpt={item.excerpt ?? 'Read the latest update from Knowledgebased Basic Science Schools.'}
                  key={item.id}
                  slug={item.slug}
                  title={item.title}
                />
              ))}
            </div>
          ) : null}

          {!loading && !error && isEmpty ? (
            <EmptyState
              description="Published school announcements will appear here once they are available from the admin panel."
              illustration={<IllustrationPlaceholder className="min-h-[180px] bg-surface-grey" label="News placeholder" />}
              title="No news published yet"
            />
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}

export default News
