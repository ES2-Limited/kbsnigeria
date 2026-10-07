// Homepage — fully animated per motion spec.

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Newspaper,
  School,
  Sparkles,
  Target,
  TreeDeciduous,
  User,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import NewsCard from '../components/ui/NewsCard'
import { GalleryGridSkeleton, NewsGridSkeleton } from '../components/ui/Skeleton'
import PageSeo from '../components/seo/PageSeo'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import Badge from '../components/ui/Badge'
import BrandIllustration from '../components/ui/BrandIllustration'
import VideoEmbed from '../components/media/VideoEmbed'
import { DEFAULT_TOUR_POSTER, TOUR_VIDEO_FALLBACK_CAPTION } from '../lib/illustrations'
import FallbackImage from '../components/ui/FallbackImage'
import { useAchievements } from '../hooks/useAchievements'
import { useEvents } from '../hooks/useEvents'
import { useGallery } from '../hooks/useGallery'
import { useNews } from '../hooks/useNews'
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription'
import { useSiteMedia } from '../hooks/useSiteMedia'
import { useTestimonials } from '../hooks/useTestimonials'
import { trackApplyClick, trackScheduleVisitClick } from '../lib/analytics'
import { cn } from '../lib/cn'
import {
  cta,
  ctaLinks,
  hero,
  homeHighlights,
  seo,
  stats as messagingStats,
  tiers,
} from '../lib/messaging'

// ─── Data ────────────────────────────────────────────────────────────────────

const academics = [
  {
    title: tiers.nursery.name,
    ages: tiers.nursery.ages,
    description: tiers.nursery.tagline,
    variant: 'cyan',
    icon: TreeDeciduous,
  },
  {
    title: tiers.primary.name,
    ages: tiers.primary.ages,
    description: tiers.primary.tagline,
    variant: 'purple',
    icon: BookOpen,
  },
  {
    title: tiers.jss.name,
    ages: tiers.jss.ages,
    description: tiers.jss.tagline,
    variant: 'navy',
    icon: Target,
  },
]

const tileGradients = [
  'from-brand-gray/40 to-brand-accent/20',
  'from-brand-primary/10 to-brand-purple/20',
  'from-brand-accent/20 to-brand-gray/30',
  'from-brand-purple/20 to-brand-primary/10',
  'from-brand-gray/30 to-brand-accent/30',
  'from-brand-accent/10 to-brand-gray/40',
]

const tileHeights = ['h-56', 'h-40', 'h-48', 'h-40', 'h-56', 'h-44']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return 'Coming soon'
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(value))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlaceholderIllustration({ className, icon: Icon, label }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-3xl border-2 border-dashed border-white/30 bg-white/10 px-6 py-10 text-center font-body text-sm text-white/50',
        className,
      )}
    >
      {Icon ? (
        <>
          <Icon aria-hidden="true" className="h-16 w-16 text-white/60" />
          <span className="sr-only">{label}</span>
        </>
      ) : (
        label
      )}
    </div>
  )
}

function Counter({ label, value }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return undefined
    if (prefersReducedMotion) { setCount(value); return undefined }

    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setCount(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-6 text-center text-white" ref={ref}>
      <div className="font-display font-bold text-4xl leading-none sm:text-5xl">{count}+</div>
      <p className="mt-3 font-body text-sm font-semibold uppercase tracking-wide text-white/90">{label}</p>
    </div>
  )
}

function GalleryPlaceholderGrid({ prefersReducedMotion }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tileGradients.map((gradient, i) => (
        <motion.div
          key={i}
          className={cn(
            'group relative overflow-hidden rounded-2xl bg-gradient-to-br cursor-pointer',
            gradient,
            tileHeights[i],
          )}
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
        >
          <div className="flex h-full items-center justify-center text-brand-gray">
            <ImageIcon className="h-8 w-8 opacity-60" />
          </div>
          {/* CSS overlay on hover */}
          <div className="absolute inset-0 bg-brand-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function Home() {
  const prefersReducedMotion = useReducedMotion()
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  const { news, loading: newsLoading, error: newsError, isEmpty: newsEmpty } = useNews({ limit: 3 })
  const { images, loading: galleryLoading, error: galleryError, isEmpty: galleryEmpty } = useGallery({ limit: 6 })
  const { media: tourVideo, loading: tourLoading } = useSiteMedia('hero_tour_video')
  const { achievements, loading: achievementsLoading, isEmpty: achievementsEmpty } = useAchievements({ featured: true, limit: 6 })
  const { testimonials, loading: testimonialsLoading, isEmpty: testimonialsEmpty } = useTestimonials({ featured: true, limit: 3 })
  const { events, loading: eventsLoading, isEmpty: eventsEmpty } = useEvents({ featured: true, upcoming: true, limit: 3 })
  const newsletter = useNewsletterSubscription()
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleNewsletterChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    const didSubscribe = await newsletter.subscribe(formData)
    if (didSubscribe) setFormData({ name: '', email: '' })
  }

  const scrollToStats = () => {
    document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Word-by-word heading variants
  const headingContainerVariants = prefersReducedMotion ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
  }
  const wordVariants = prefersReducedMotion ? {} : {
    hidden:   { opacity: 0, y: 40 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  // Stat card stagger variants
  const statContainerVariants = prefersReducedMotion ? {} : {
    hidden:   {},
    visible:  { transition: { staggerChildren: 0.15 } },
  }
  const statCardVariants = prefersReducedMotion ? {} : {
    hidden:   { opacity: 0, scale: 0.8 },
    visible:  { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
  }

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/"
        description={seo.home.description}
        title={seo.home.title}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white">
        {/* Background gradient fade-in */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-accent via-brand-secondary to-brand-primary"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 sm:px-8 sm:pb-28 lg:grid-cols-2 lg:items-center lg:px-10 lg:pt-24">

          {/* Left: text stack */}
          <div className="space-y-8">
            {/* Overline — delay 0.2s */}
            <motion.p
              className="font-calligraphy text-lg italic text-brand-gray sm:text-xl"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
              {hero.overline}
            </motion.p>

            {/* Heading — word by word, stagger from delay 0.4s */}
            <motion.h1
              className="font-display text-h1 text-white sm:text-display"
              variants={headingContainerVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              {hero.headlineWords.map((word) => (
                <motion.span
                  key={word}
                  className="mr-3 inline-block"
                  variants={wordVariants}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Body — delay 0.9s */}
            <motion.p
              className="max-w-lg font-body text-body-lg text-white/80"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
            >
              {hero.subhead}
            </motion.p>

            {/* Buttons — spring pop, stagger from delay 1.1s */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <motion.div
                className="w-full sm:w-auto"
                initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.1 }}
              >
                <Button
                  as="link"
                  fullWidth
                  className="sm:w-auto"
                  onClick={() => trackScheduleVisitClick('home_hero')}
                  size="lg"
                  to={ctaLinks.scheduleVisit}
                  variant="primary"
                >
                  {cta.scheduleVisit}
                </Button>
              </motion.div>
              <motion.div
                className="w-full sm:w-auto"
                initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.2 }}
              >
                <Button
                  as="link"
                  fullWidth
                  onClick={() => trackApplyClick('home_hero')}
                  size="lg"
                  to={ctaLinks.applyNow}
                  variant="inverse"
                  className="sm:w-auto"
                >
                  {cta.applyNow}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right: illustration + decorative blobs */}
          <div className="relative flex items-center justify-center">
            {/* Floating blobs — pointer-events-none */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute bottom-4 -left-6 h-20 w-20 rounded-full bg-brand-primary/20 blur-lg pointer-events-none"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute top-1/3 -right-4 h-24 w-24 rounded-full bg-brand-gray/20 blur-xl pointer-events-none"
                  animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </>
            )}

            {/* Illustration: slides in from right, then floats */}
            <motion.div
              className="w-full"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BrandIllustration
                  alt="Children studying with a teacher at KBS school"
                  className="h-80 sm:h-[420px]"
                  name="hero"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.button
            onClick={scrollToStats}
            className="flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Scroll to stats"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.button>
        </div>

        <WaveDivider className="text-brand-primary" />
      </section>

      {/* ── 2. STATS BAR ────────────────────────────────────────────────────── */}
      <section id="stats" className="relative overflow-hidden bg-brand-primary py-16 sm:py-20" ref={statsRef}>
        {/* Shimmer sweep — plays once when section enters view */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={statsInView ? { x: '200%' } : { x: '-100%' }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          className="relative mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10"
          variants={statContainerVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={statsInView ? 'visible' : 'hidden'}
        >
          {messagingStats.map((stat) => (
            <motion.div key={stat.label} variants={statCardVariants}>
              <Counter label={stat.label} value={stat.value} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <WaveDivider className="text-white" />

      {/* ── 2b. SCHOOL TOUR VIDEO ───────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-10">
          <ScrollReveal direction="left">
            {tourLoading ? (
              <div className="aspect-video animate-pulse rounded-3xl bg-bg-light" />
            ) : (
              <VideoEmbed
                analyticsLocation="homepage_tour"
                caption={tourVideo?.caption || (!tourVideo?.embed_url ? TOUR_VIDEO_FALLBACK_CAPTION : undefined)}
                poster={tourVideo?.poster_url || DEFAULT_TOUR_POSTER}
                title="KBS School Tour"
                url={tourVideo?.embed_url}
              />
            )}
          </ScrollReveal>
          <div className="space-y-6">
            <ScrollReveal direction="right" delay={0.2}>
              <SectionHeader
                align="left"
                heading="See KBS Before You Visit"
                overline="Virtual Tour"
                subtext="Walk through our classrooms, facilities, and everyday school life. A warm first look at the environment where your child will learn and grow."
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.35}>
              <Button as="link" to="/admissions" variant="primary">
                Book a Visit
              </Button>
            </ScrollReveal>
          </div>
        </div>
        <WaveDivider className="text-bg-light" />
      </section>

      {/* ── 3. ABOUT TEASER ─────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-10">
          <ScrollReveal direction="left">
            <PlaceholderIllustration
              className="h-64"
              icon={School}
              label="About mascot illustration"
            />
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal direction="right" delay={0.2}>
              <SectionHeader
                align="left"
                heading={homeHighlights.about.heading}
                overline={homeHighlights.about.overline}
                subtext={homeHighlights.about.subtext}
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.35}>
              <Button as="link" to="/about" variant="ghost">
                Learn More
              </Button>
            </ScrollReveal>
          </div>
        </div>
        <WaveDivider className="text-bg-light" />
      </section>

      {/* ── 4. ACADEMICS ────────────────────────────────────────────────────── */}
      <section className="bg-bg-light py-0">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
          <ScrollReveal direction="up" className="mb-12">
  <div className="mx-auto max-w-3xl text-center">
    <SectionHeader
      align="center"
      heading={homeHighlights.academics.heading}
      overline={homeHighlights.academics.overline}
      subtext={homeHighlights.academics.subtext}
    />
  </div>
</ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {academics.map((item, i) => (
              <ScrollReveal key={item.title} direction="up" delay={i * 0.15}>
                <Card className="group h-full space-y-5">
                  <div className="rounded-xl bg-brand-gray/30 h-40 mb-4 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-gray/50 group-hover:scale-110">
                    {item.icon ? <item.icon className="h-16 w-16 text-brand-primary" /> : null}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={item.variant}>{item.title}</Badge>
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-brand-primary">{item.ages}</p>
                    </div>
                    <h3 className="font-display text-h3 text-text-primary">{item.title}</h3>
                    <p className="font-body text-sm text-text-secondary">{item.description}</p>
                  </div>
                  <Link
                    className="inline-flex items-center gap-1 font-body font-semibold text-brand-primary hover:text-brand-primary transition-colors"
                    to="/academics"
                  >
                    <span>Explore {item.title}</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      {/* ── 4b. ACHIEVEMENTS STRIP ──────────────────────────────────────────── */}
      {!achievementsLoading && !achievementsEmpty ? (
        <section className="bg-brand-primary py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <ScrollReveal direction="up" className="mb-10">
              <SectionHeader
                align="center"
                className="mx-auto [&_h2]:text-white [&_p]:text-white/80"
                heading="Outcomes That Speak for Themselves"
                overline="Achievements"
                subtext="Highlights from examinations, competitions, and milestones across the KBS community."
              />
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((item, i) => (
                <ScrollReveal direction="up" delay={i * 0.1} key={item.id}>
                  <div className="rounded-2xl bg-white/10 px-5 py-6 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-brand-gray" />
                      {item.category ? (
                        <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand-gray">{item.category}</span>
                      ) : null}
                    </div>
                    <h3 className="font-display text-xl text-white">{item.title}</h3>
                    {item.year ? (
                      <p className="mt-1 font-body text-sm text-white/70">{item.year}</p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-3 font-body text-sm leading-7 text-white/80">{item.description}</p>
                    ) : null}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 5. NEWS ─────────────────────────────────────────────────────────── */}
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

          {newsLoading ? <NewsGridSkeleton count={3} /> : null}
          {!newsLoading && (newsError || newsEmpty) ? (
            <EmptyState
              description="School updates will appear here as they are added."
              illustration={<Newspaper className="h-12 w-12" />}
              title="No news published yet"
            />
          ) : null}
          {!newsLoading && !newsError && !newsEmpty ? (
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

      <WaveDivider className="text-bg-light" />

      {/* ── 6. GALLERY TEASER ───────────────────────────────────────────────── */}
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

          {galleryLoading ? <GalleryGridSkeleton count={6} /> : null}

          {/* No images: animated placeholder mosaic grid */}
          {!galleryLoading && (galleryError || galleryEmpty) ? (
            <GalleryPlaceholderGrid prefersReducedMotion={prefersReducedMotion} />
          ) : null}

          {/* Real images */}
          {!galleryLoading && !galleryError && !galleryEmpty ? (
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

      <WaveDivider className="text-brand-primary" />

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-bg-light">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
         <ScrollReveal direction="up" className="mb-12">
  <div className="mx-auto max-w-3xl text-center">
    <SectionHeader
      align="center"
      heading={homeHighlights.testimonials.heading}
      overline={homeHighlights.testimonials.overline}
      subtext={homeHighlights.testimonials.subtext}
    />
  </div>
</ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-3">
            {testimonialsLoading ? (
              [0, 1, 2].map((i) => (
                <div className="h-48 animate-pulse rounded-2xl bg-brand-gray/20" key={i} />
              ))
            ) : null}
            {!testimonialsLoading && testimonialsEmpty ? (
              <EmptyState
                className="lg:col-span-3"
                description="Parent stories will appear here as they are added."
                illustration={<Users className="h-12 w-12" />}
                title="Testimonials coming soon"
              />
            ) : null}
            {!testimonialsLoading && !testimonialsEmpty ? testimonials.map((testimonial, i) => (
              <ScrollReveal direction="up" delay={i * 0.15} key={testimonial.id}>
                <Card className="h-full space-y-5">
                  <p className="font-calligraphy text-lg italic text-text-primary">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-brand-gray/30 pt-2">
                    {testimonial.photo_url ? (
                      <FallbackImage
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                        fallbackSrc="/kbs-logo.png"
                        src={testimonial.photo_url}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gray/10 text-brand-primary">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-body font-semibold text-text-primary">{testimonial.name}</p>
                      <p className="font-body text-xs text-text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            )) : null}
          </div>
        </div>
      </section>

      <WaveDivider className="text-white" />

      {/* ── 7b. FEATURED EVENTS ───────────────────────────────────────────────── */}
      {!eventsLoading && !eventsEmpty ? (
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <ScrollReveal direction="up">
                <SectionHeader
                  align="left"
                  heading="Upcoming School Events"
                  overline="What's On"
                  subtext="Open days, exhibitions, and community gatherings — join us on campus."
                />
              </ScrollReveal>
              <Link
                className="inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-brand-primary transition-colors hover:text-brand-purple"
                to="/events"
              >
                <span>View all events</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <ScrollReveal direction="up" delay={i * 0.1} key={event.id}>
                  <Card className="h-full space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-primary" />
                      {event.type ? <Badge variant="cyan">{event.type}</Badge> : null}
                    </div>
                    <h3 className="font-display text-xl text-text-primary">{event.title}</h3>
                    <p className="font-body text-sm text-text-secondary">{formatDate(event.event_date)}</p>
                    {event.description ? (
                      <p className="font-body text-sm leading-7 text-text-secondary line-clamp-3">{event.description}</p>
                    ) : null}
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <WaveDivider className="text-bg-light" />
        </section>
      ) : null}

      {/* ── 8. ADMISSIONS CTA BANNER ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-accent py-24 text-white">
        {/* Decorative animated circles */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              aria-hidden="true"
              className="absolute -top-16 -right-16 h-64 w-64 rounded-full border-2 border-white/10 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 pointer-events-none"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute top-8 left-8 h-16 w-16 rounded-full bg-brand-primary/30 pointer-events-none"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-12 right-1/4 h-10 w-10 rounded-full bg-white/10 pointer-events-none"
              animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </>
        )}

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <ScrollReveal direction="scale">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-2 font-calligraphy text-xl italic text-white/80">{homeHighlights.admissionsBanner.overline}</p>
                <h2 className="mb-4 font-display text-h1 text-white">{homeHighlights.admissionsBanner.heading}</h2>
                <p className="mb-8 max-w-2xl font-body text-body-lg text-white/80">
                  {homeHighlights.admissionsBanner.subtext}
                </p>
                {/* CTA with glow on hover */}
                <motion.div
                  className="inline-block"
                  whileHover={prefersReducedMotion ? {} : { boxShadow: '0 0 30px rgba(41,171,226,0.6)', scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Button
                    as="link"
                    onClick={() => trackScheduleVisitClick('home_admissions_banner')}
                    size="lg"
                    to={ctaLinks.scheduleVisit}
                    variant="primary"
                  >
                    {cta.scheduleVisit}
                  </Button>
                </motion.div>
              </div>
              <PlaceholderIllustration
                className="flex h-72 items-center justify-center rounded-2xl border-2 border-dashed border-white/30 bg-white/10 text-sm text-white/50"
                icon={Sparkles}
                label="Admissions illustration"
              />
            </div>
          </ScrollReveal>
        </div>
        <WaveDivider className="text-white" />
      </section>

      {/* ── 8. NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-10">
          <ScrollReveal direction="up">
            <div className="rounded-[2rem] border border-brand-gray/30 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
              <SectionHeader
                align="center"
                className="mx-auto mb-10"
                heading="Stay in Touch With School Updates"
                overline="Newsletter"
                subtext="Join families receiving announcements, reminders, and highlights from across the school."
              />

              <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleNewsletterSubmit}>
                <Input
                  label="Name"
                  labelClassName="sr-only sm:not-sr-only"
                  name="name"
                  onChange={handleNewsletterChange}
                  placeholder="Your name"
                  required
                  value={formData.name}
                />
                <Input
                  label="Email"
                  labelClassName="sr-only sm:not-sr-only"
                  name="email"
                  onChange={handleNewsletterChange}
                  placeholder="your@email.com"
                  required
                  type="email"
                  value={formData.email}
                />
                <div className="sm:col-span-2 flex flex-col items-center gap-4">
                  <Button fullWidth loading={newsletter.loading} loadingText="Subscribing..." size="lg" type="submit" variant="primary">
                    Subscribe
                  </Button>
                  {newsletter.success ? (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center font-body text-sm text-success"
                    >
                      {newsletter.success}
                    </motion.p>
                  ) : null}
                  {newsletter.error ? (
                    <p className="text-center font-body text-sm text-error">{newsletter.error}</p>
                  ) : null}
                  <p className="text-center font-body text-sm text-text-secondary">
                    Join families already subscribed to KBS updates.
                  </p>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider className="text-text-primary" />
    </div>
  )
}

export default Home
