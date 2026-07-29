// News post page implementation following PRD US-05.

import DOMPurify from 'dompurify'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Copy, MessageCircle, Newspaper } from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import FallbackImage from '../components/ui/FallbackImage'
import PageSeo from '../components/seo/PageSeo'
import { useNewsPost } from '../hooks/useNews'
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

function NewsPost() {
  const prefersReducedMotion = useReducedMotion()
  const { slug } = useParams()
  const { post, loading, error, notFound } = useNewsPost(slug)
  const [copyState, setCopyState] = useState('')

  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://kbsnigeria.com/news/${slug}`
  const sanitizedBody = useMemo(() => DOMPurify.sanitize(post?.body ?? ''), [post?.body])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopyState('Link copied')
      window.setTimeout(() => setCopyState(''), 2000)
    } catch {
      setCopyState('Could not copy link')
      window.setTimeout(() => setCopyState(''), 2000)
    }
  }

  if (!loading && notFound) {
    return <Navigate replace to="/news" />
  }

  return (
    <div className="bg-bg-light pb-20 sm:pb-24">
      <PageSeo
        canonicalPath={`/news/${slug}`}
        description={post?.excerpt ?? 'Read the latest school news and announcements from KBS Nigeria.'}
        image={post?.cover_url}
        title={post ? `${post.title} | KBS Nigeria` : 'News Post | KBS Nigeria'}
        type="article"
      />

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
          <Skeleton className="h-56 w-full rounded-3xl sm:h-80" />
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-auto max-w-3xl px-6 pt-12 sm:px-8 lg:px-0">
          <p className="font-body text-sm text-error">Unable to load this news post right now.</p>
        </div>
      ) : null}

      {!loading && !error && post ? (
        <>
          <div className="w-full bg-bg-light">
            {post.cover_url ? (
              <FallbackImage
                alt={post.title}
                className="max-h-96 w-full object-cover"
                fallbackSrc="/kbs-logo.png"
                height="960"
                loading="lazy"
                src={post.cover_url}
                width="1600"
              />
            ) : (
              <div className="flex max-h-96 min-h-72 w-full items-center justify-center text-brand-gray">
                <Newspaper className="h-20 w-20" />
              </div>
            )}
          </div>

          <motion.article className="mx-auto max-w-3xl px-6 pt-12 sm:px-8 lg:px-0" {...fadeUpMotion(prefersReducedMotion)}>
            <div className="mb-8 space-y-4">
              <Link className="inline-flex min-h-11 items-center font-body text-sm font-semibold text-brand-primary hover:text-brand-purple" to="/news">
                Back to news
              </Link>
              <p className="font-calligraphy text-xl italic text-brand-purple">School Announcement</p>
              <h1 className="font-display text-4xl leading-tight text-text-primary sm:text-5xl">{post.title}</h1>
              <p className="font-body text-sm text-text-secondary">Published {formatDate(post.published_at ?? post.created_at)}</p>
            </div>

            <div
              className="prose prose-lg max-w-prose prose-headings:font-display prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-brand-primary prose-strong:text-text-primary"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-brand-gray/30 pt-6">
              <Button
                as="a"
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`}
                rel="noreferrer"
                target="_blank"
                variant="secondary"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Share on WhatsApp</span>
              </Button>
              <Button onClick={handleCopyLink} variant="ghost">
                <Copy className="h-4 w-4" />
                <span>Copy link</span>
              </Button>
              {copyState ? <p className="font-body text-sm text-text-secondary">{copyState}</p> : null}
            </div>
          </motion.article>
        </>
      ) : null}
    </div>
  )
}

export default NewsPost
