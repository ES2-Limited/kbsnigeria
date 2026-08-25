// Homepage gallery teaser — owns its own data fetching; falls back to an
// animated placeholder mosaic while the gallery is empty.

import FallbackImage from '../ui/FallbackImage'
import Button from '../ui/Button'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import { GalleryGridSkeleton } from '../ui/Skeleton'
import { useGallery } from '../../hooks/useGallery'
import { useReducedMotion } from 'framer-motion'
import GalleryPlaceholderGrid from './GalleryPlaceholderGrid'

function GalleryTeaser() {
  const prefersReducedMotion = useReducedMotion()
  const { error, images, isEmpty, loading } = useGallery({ limit: 6 })

  return (
    <section className="bg-bg-light py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <ScrollReveal direction="up">
            <SectionHeader
              align="left"
              heading="A Glimpse Into School Life"
              overline="Gallery"
              subtext="Moments from classrooms, events, and the everyday experiences that make KBS feel vibrant and welcoming."
            />
          </ScrollReveal>
          <Button as="link" to="/gallery" variant="secondary">
            View Full Gallery
          </Button>
        </div>

        {loading ? <GalleryGridSkeleton count={6} /> : null}

        {/* No images: animated placeholder mosaic grid */}
        {!loading && (error || isEmpty) ? (
          <GalleryPlaceholderGrid prefersReducedMotion={prefersReducedMotion} />
        ) : null}

        {/* Real images */}
        {!loading && !error && !isEmpty ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((image, index) => (
              <div className="mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm" key={image.id}>
                <FallbackImage
                  alt={image.caption || `KBS gallery image ${index + 1}`}
                  className="h-auto w-full object-cover"
                  fallbackSrc="/kbs-logo.png"
                  height="900"
                  loading="lazy"
                  src={image.url}
                  width="1200"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default GalleryTeaser
