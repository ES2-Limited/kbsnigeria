// Homepage latest-news teaser — owns its own data fetching.

import { Newspaper, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../ui/EmptyState'
import NewsCard from '../ui/NewsCard'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import { NewsGridSkeleton } from '../ui/Skeleton'
import { useNews } from '../../hooks/useNews'
import { formatDate } from '../../lib/format'

function NewsSection() {
  const { error, isEmpty, loading, news } = useNews({ limit: 3 })

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <ScrollReveal direction="up">
            <SectionHeader
              align="left"
              heading="Latest News & Announcements"
              overline="Latest News"
              subtext="Stay up to date with school events, term updates, and important announcements for parents and pupils."
            />
          </ScrollReveal>
          <Link
            className="inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-brand-primary transition-colors hover:text-brand-purple"
            to="/news"
          >
            <span>View all news</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? <NewsGridSkeleton count={3} /> : null}
        {!loading && (error || isEmpty) ? (
          <EmptyState
            description="School updates will appear here as they are added."
            illustration={<Newspaper className="h-12 w-12" />}
            title="No news published yet"
          />
        ) : null}
        {!loading && !error && !isEmpty ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item, i) => (
              <ScrollReveal key={item.id} direction="up" delay={i * 0.1}>
                <NewsCard
                  category="News"
                  coverImage={item.cover_url}
                  date={formatDate(item.published_at ?? item.created_at)}
                  excerpt={item.excerpt ?? 'Read the latest update from Knowledgebased Basic Science Schools.'}
                  slug={item.slug}
                  title={item.title}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default NewsSection
