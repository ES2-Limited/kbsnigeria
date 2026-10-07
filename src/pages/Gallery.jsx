// Gallery page implementation following PRD US-07.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FallbackImage from '../components/ui/FallbackImage'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import Modal from '../components/ui/Modal'
import PageSeo from '../components/seo/PageSeo'
import WaveDivider from '../components/ui/WaveDivider'
import { GalleryGridSkeleton } from '../components/ui/Skeleton'
import { useGallery } from '../hooks/useGallery'
import { fadeUpMotion } from '../lib/motion'

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
}

function Gallery() {
  const prefersReducedMotion = useReducedMotion()
  const { error, hasMore, images, isEmpty, isLoadingMore, loadMore, loading } = useGallery({ pageSize: 12 })
  const [activeIndex, setActiveIndex] = useState(null)
  const [direction, setDirection] = useState(1)
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)

  const activeImage = activeIndex !== null ? images[activeIndex] : null
  const imageCountLabel = activeImage ? `${activeIndex + 1} / ${images.length}` : ''

  const goTo = useCallback((next) => {
    setDirection(next > (activeIndex ?? 0) ? 1 : -1)
    setActiveIndex(next)
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
      }
      if (event.key === 'ArrowRight') {
        goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, images.length, goTo])

  useEffect(() => {
    if (activeIndex !== null) {
      prevButtonRef.current?.focus()
    }
  }, [activeIndex])

  const modalTitle = useMemo(() => (activeImage?.caption ? activeImage.caption : `Gallery image ${imageCountLabel}`), [activeImage, imageCountLabel])

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/gallery"
        description="View moments from school life, facilities, events, and classroom experiences at KBS Nigeria."
        title="Gallery | KBS Nigeria"
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">Gallery</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              A Visual Glimpse Into School Life
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Explore everyday moments, learning spaces, and memorable activities from across the KBS community.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {loading ? <GalleryGridSkeleton count={9} /> : null}
          {!loading && error ? <p className="font-body text-sm text-error">Unable to load gallery images right now.</p> : null}

          {!loading && !error && !isEmpty ? (
            <>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {images.map((image, index) => (
                  <button
                    className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                    key={image.id}
                    onClick={() => goTo(index)}
                    type="button"
                  >
                    <FallbackImage
                      alt={image.caption || `KBS gallery image ${index + 1}`}
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fallbackSrc="/kbs-logo.png"
                      height="900"
                      loading="lazy"
                      src={image.url}
                      width="1200"
                    />
                    {image.caption ? (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-primary/90 to-transparent px-4 pb-4 pt-10 font-body text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {image.caption}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {hasMore ? (
                <div className="mt-8 flex justify-center">
                  <Button loading={isLoadingMore} loadingText="Loading..." onClick={loadMore} variant="secondary">
                    Load More Photos
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}

          {!loading && !error && isEmpty ? (
            <EmptyState
              description="School photos will appear here once gallery uploads are available."
              illustration={<IllustrationPlaceholder className="min-h-[180px] bg-bg-light" label="Empty gallery placeholder" />}
              title="No gallery images yet"
            />
          ) : null}
        </div>
      </motion.section>

      <Modal
        className="max-w-6xl bg-brand-primary p-4 sm:p-6"
        closeButtonClassName="text-white hover:bg-white/10"
        onClose={() => setActiveIndex(null)}
        open={activeIndex !== null}
        title={modalTitle}
        titleClassName="text-white"
      >
        {activeImage ? (
          <div className="space-y-4 text-white">
            <div className="overflow-hidden rounded-3xl bg-brand-primary/80">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activeImage.id}
                  custom={direction}
                  variants={prefersReducedMotion ? undefined : slideVariants}
                  initial={prefersReducedMotion ? false : 'enter'}
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <FallbackImage
                    alt={activeImage.caption || modalTitle}
                    className="max-h-[75vh] w-full object-contain"
                    fallbackSrc="/kbs-logo.png"
                    height="900"
                    loading="lazy"
                    src={activeImage.url}
                    width="1200"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-body text-xs font-medium tracking-wide text-white/90">
                {imageCountLabel}
              </span>
              <div className="flex items-center gap-3">
                <motion.button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                  onClick={() => goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
                  ref={prevButtonRef}
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous image</span>
                </motion.button>
                <motion.button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                  onClick={() => goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
                  ref={nextButtonRef}
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next image</span>
                </motion.button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default Gallery
