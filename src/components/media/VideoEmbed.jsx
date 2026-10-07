// Lazy-loaded video embed for YouTube, Vimeo, or direct MP4 sources.

import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { trackVideoPlay } from '../../lib/analytics'
import { cn } from '../../lib/cn'

function parseVideoUrl(url) {
  if (!url) {
    return null
  }

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      let videoId = parsed.searchParams.get('v')

      if (!videoId && parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '')
      }

      if (!videoId && parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0]
      }

      if (videoId) {
        return { provider: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}` }
      }
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const segments = parsed.pathname.split('/').filter(Boolean)
      const videoId = segments[0]

      if (videoId) {
        return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${videoId}` }
      }
    }

    if (/\.(mp4|webm|ogg)(\?|$)/i.test(parsed.pathname)) {
      return { provider: 'file', embedUrl: url }
    }
  } catch {
    return null
  }

  return null
}

function VideoEmbed({
  url,
  poster,
  caption,
  title = 'Video',
  className,
  aspectClassName = 'aspect-video',
  analyticsLocation = 'video_embed',
}) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const parsed = parseVideoUrl(url)

  useEffect(() => {
    const node = containerRef.current

    if (!node || prefersReducedMotion) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  if (!parsed) {
    if (poster) {
      return (
        <figure className={cn('space-y-3', className)} ref={containerRef}>
          <div className={cn('relative overflow-hidden rounded-3xl bg-bg-light shadow-lg', aspectClassName)}>
            <img
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              src={poster}
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent p-6">
              <p className="font-body text-sm leading-7 text-white">
                {caption || 'School tour video coming soon.'}
              </p>
            </div>
          </div>
          {caption ? (
            <figcaption className="text-center font-body text-sm text-text-secondary">{caption}</figcaption>
          ) : null}
        </figure>
      )
    }

    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-3xl border-2 border-dashed border-brand-gray/40 bg-bg-light',
          aspectClassName,
          className,
        )}
        ref={containerRef}
      >
        <p className="px-6 text-center font-body text-sm text-text-secondary">
          {caption || 'School tour video coming soon.'}
        </p>
      </div>
    )
  }

  const showPoster = poster && !isPlaying && parsed.provider !== 'file'

  const handlePlay = () => {
    trackVideoPlay(analyticsLocation)
    setIsPlaying(true)
  }

  return (
    <figure className={cn('space-y-3', className)} ref={containerRef}>
      <div className={cn('relative overflow-hidden rounded-3xl bg-black shadow-lg', aspectClassName)}>
        {showPoster ? (
          <button
            className="group absolute inset-0 z-10 flex items-center justify-center"
            onClick={handlePlay}
            type="button"
            aria-label={`Play ${title}`}
          >
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              src={poster}
            />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-primary shadow-lg transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-current" />
            </span>
          </button>
        ) : null}

        {isVisible && (isPlaying || !showPoster) ? (
          parsed.provider === 'file' ? (
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              poster={poster || undefined}
              preload="metadata"
              src={parsed.embedUrl}
              title={title}
            >
              <track kind="captions" />
            </video>
          ) : (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              src={`${parsed.embedUrl}${isPlaying || !poster ? '?autoplay=1' : ''}`}
              title={title}
            />
          )
        ) : null}
      </div>
      {caption ? (
        <figcaption className="text-center font-body text-sm text-text-secondary">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

export default VideoEmbed
