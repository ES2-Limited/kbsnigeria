// Gallery page implementation following PRD US-07.

import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import EmptyState from '../components/ui/EmptyState'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import Modal from '../components/ui/Modal'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useGallery } from '../hooks/useGallery'
import { fadeUpMotion } from '../lib/motion'

function GallerySkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div className="mb-4 animate-pulse break-inside-avoid rounded-3xl bg-surface-grey" key={item}>
          <div className={item % 3 === 0 ? 'h-80' : item % 2 === 0 ? 'h-56' : 'h-72'} />
        </div>
      ))}
    </div>
  )
}

function Gallery() {
  const prefersReducedMotion = useReducedMotion()
  const { images, loading, error, isEmpty } = useGallery({ limit: undefined })
  const [activeIndex, setActiveIndex] = useState(null)
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)

  const activeImage = activeIndex !== null ? images[activeIndex] : null
  const imageCountLabel = activeImage ? `${activeIndex + 1} of ${images.length}` : ''

  useEffect(() => {
    if (activeIndex === null) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, images.length])

  useEffect(() => {
    if (activeIndex !== null) {
      prevButtonRef.current?.focus()
    }
  }, [activeIndex])

  const modalTitle = useMemo(() => (activeImage?.caption ? activeImage.caption : `Gallery image ${imageCountLabel}`), [activeImage, imageCountLabel])

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/gallery"
        description="View moments from school life, facilities, events, and classroom experiences at KBS Nigeria."
        title="Gallery | KBS Nigeria"
      />

      <section className="overflow-hidden bg-hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">Gallery</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              A Visual Glimpse Into School Life
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Explore everyday moments, learning spaces, and memorable activities from across the KBS community.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-surface-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          {loading ? <GallerySkeleton /> : null}
          {!loading && error ? <p className="font-body text-sm text-error">Unable to load gallery images right now.</p> : null}

          {!loading && !error && !isEmpty ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {images.map((image, index) => (
                <button
                  className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20"
                  key={image.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <img
                    alt={image.caption || `KBS gallery image ${index + 1}`}
                    className="h-auto w-full object-cover"
                    height="900"
                    loading="lazy"
                    src={image.url}
                    width="1200"
                  />
                </button>
              ))}
            </div>
          ) : null}

          {!loading && !error && isEmpty ? (
            <EmptyState
              description="School photos will appear here once gallery uploads are available."
              illustration={<IllustrationPlaceholder className="min-h-[180px] bg-surface-grey" label="Empty gallery placeholder" />}
              title="No gallery images yet"
            />
          ) : null}
        </div>
      </motion.section>

      <Modal
        className="max-w-6xl bg-kbs-navy p-4 sm:p-6"
        closeButtonClassName="text-white hover:bg-white/10"
        onClose={() => setActiveIndex(null)}
        open={activeIndex !== null}
        title={modalTitle}
        titleClassName="text-white"
      >
        {activeImage ? (
          <div className="space-y-4 text-white">
            <div className="overflow-hidden rounded-3xl bg-kbs-navy/80">
              <img alt={activeImage.caption || modalTitle} className="max-h-[75vh] w-full object-contain" height="900" loading="lazy" src={activeImage.url} width="1200" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-body text-sm text-white/80">{imageCountLabel}</p>
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20"
                  onClick={() => setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))}
                  ref={prevButtonRef}
                  type="button"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous image</span>
                </button>
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20"
                  onClick={() => setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))}
                  ref={nextButtonRef}
                  type="button"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next image</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default Gallery
