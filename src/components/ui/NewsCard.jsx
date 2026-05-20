// News preview card for home and news listing pages.

import { ChevronRight, Newspaper } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import Card from './Card'

function NewsCard({ category = 'News', coverImage, date, excerpt, slug, title }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-grey">
        {coverImage ? (
          <img alt={title} className="h-full w-full object-cover" loading="lazy" src={coverImage} />
        ) : (
          <div className="flex h-full items-center justify-center text-kbs-lavender">
            <Newspaper className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="cyan">{category}</Badge>
          <span className="font-body text-sm text-text-medium">{date}</span>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-2xl leading-tight text-kbs-navy">{title}</h3>
          <p className="font-body text-base leading-7 text-text-medium">{excerpt}</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 font-body text-sm font-semibold text-kbs-cyan transition-colors duration-200 hover:text-kbs-purple"
          to={`/news/${slug}`}
        >
          <span>Read more</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  )
}

export default NewsCard
