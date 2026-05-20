// News post page implementation following PRD US-05.

import DOMPurify from 'dompurify'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Copy, MessageCircle, Newspaper } from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../components/ui/Button'
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
  const { post, loading, notFound } = useNewsPost(slug)
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
    <div className="bg-surface-white pb-20 sm:pb-24">
      <Helmet>
        <title>{post ? `${post.title} | KBS Nigeria` : 'News Post | KBS Nigeria'}</title>
        <meta
          content={post?.excerpt ?? 'Read the latest school news and announcements from KBS Nigeria.'}
          name="description"
        />
      </Helmet>

      {loading ? (
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="h-96 animate-pulse rounded-3xl bg-surface-grey" />
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            <div className="h-12 animate-pulse rounded-2xl bg-surface-grey" />
            <div className="h-6 w-40 animate-pulse rounded-full bg-surface-grey" />
            <div className="h-56 animate-pulse rounded-3xl bg-surface-grey" />
          </div>
        </div>
      ) : null}

      {!loading && post ? (
        <>
          <div className="w-full bg-surface-grey">
            {post.cover_url ? (
              <img alt={post.title} className="max-h-96 w-full object-cover" src={post.cover_url} />
            ) : (
              <div className="flex max-h-96 min-h-72 w-full items-center justify-center text-kbs-lavender">
                <Newspaper className="h-20 w-20" />
              </div>
            )}
          </div>

          <motion.article className="mx-auto max-w-3xl px-6 pt-12 sm:px-8 lg:px-0" {...fadeUpMotion(prefersReducedMotion)}>
            <div className="mb-8 space-y-4">
              <Link className="font-body text-sm font-semibold text-kbs-cyan hover:text-kbs-purple" to="/news">
                Back to news
              </Link>
              <p className="font-calligraphy text-xl italic text-kbs-purple">School Announcement</p>
              <h1 className="font-display text-4xl leading-tight text-kbs-navy sm:text-5xl">{post.title}</h1>
              <p className="font-body text-sm text-text-medium">Published {formatDate(post.published_at ?? post.created_at)}</p>
            </div>

            <div
              className="prose prose-lg max-w-prose prose-headings:font-display prose-headings:text-kbs-navy prose-p:text-text-medium prose-a:text-kbs-cyan prose-strong:text-text-dark"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-surface-grey pt-6">
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
              {copyState ? <p className="font-body text-sm text-text-medium">{copyState}</p> : null}
            </div>
          </motion.article>
        </>
      ) : null}
    </div>
  )
}

export default NewsPost
