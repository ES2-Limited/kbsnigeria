// News index page implementation following PRD US-05.

import { motion, useReducedMotion } from 'framer-motion'
import EmptyState from '../components/ui/EmptyState'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import NewsCard from '../components/ui/NewsCard'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { NewsGridSkeleton } from '../components/ui/Skeleton'
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

function News() {
  const prefersReducedMotion = useReducedMotion()
  const { news, loading, error, isEmpty } = useNews({ publishedOnly: true })

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/news"
        description="Read the latest news, school updates, and announcements from Knowledgebased Basic Science Schools, FHA Lugbe, Abuja."
        title="News & Announcements | KBS Nigeria"
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">News & Announcements</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              School Updates for Parents and Families
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Follow school activities, term reminders, events, and important notices from across the KBS community.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {loading ? <NewsGridSkeleton count={6} /> : null}
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
              illustration={<IllustrationPlaceholder className="min-h-[180px] bg-bg-light" label="News placeholder" />}
              title="No news published yet"
            />
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}

export default News
