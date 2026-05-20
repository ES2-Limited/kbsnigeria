// Homepage implementation following DESIGN.md Section 8.1.

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import NewsCard from '../components/ui/NewsCard'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useGallery } from '../hooks/useGallery'
import { useNews } from '../hooks/useNews'
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription'

const heroWords = ['Where', 'Every', 'Child', 'Discovers', 'Their', 'Potential']

const stats = [
  { label: 'Years Operating', value: 25 },
  { label: 'Students Enrolled', value: 400 },
  { label: 'Staff Members', value: 40 },
  { label: 'Classes', value: 12 },
]

const academics = [
  {
    title: 'Nursery',
    ages: 'Ages 3-5',
    description: 'A warm first classroom experience built around play, literacy, and confidence.',
  },
  {
    title: 'Primary',
    ages: 'Ages 6-11',
    description: 'Strong foundations in core subjects, creativity, and structured curiosity.',
  },
  {
    title: 'JSS',
    ages: 'Ages 12-15',
    description: 'Focused preparation for higher study with science, leadership, and discipline.',
  },
]

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

function fadeUpMotion(prefersReducedMotion) {
  return prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: 'easeOut' },
      }
}

function PlaceholderIllustration({ className, label }) {
  return (
    <div
      className={`flex items-center justify-center rounded-3xl border-2 border-dashed border-kbs-lavender bg-white/70 px-6 py-10 text-center font-body text-sm text-text-medium ${className}`}
    >
      {label}
    </div>
  )
}

function Counter({ label, value }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) {
      return undefined
    }

    if (prefersReducedMotion) {
      setCount(value)
      return undefined
    }

    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setCount(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-6 text-center text-white" ref={ref}>
      <div className="font-display text-4xl leading-none sm:text-5xl">{count}</div>
      <p className="mt-3 font-body text-sm uppercase tracking-wide text-white/90">{label}</p>
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div className="overflow-hidden rounded-2xl border border-surface-grey bg-white shadow-sm" key={item}>
          <div className="aspect-[16/10] animate-pulse bg-surface-grey" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-24 animate-pulse rounded-full bg-surface-grey" />
            <div className="h-8 animate-pulse rounded-xl bg-surface-grey" />
            <div className="h-20 animate-pulse rounded-2xl bg-surface-grey" />
            <div className="h-5 w-28 animate-pulse rounded-full bg-surface-grey" />
          </div>
        </div>
      ))}
    </div>
  )
}

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

function Home() {
  const prefersReducedMotion = useReducedMotion()
  const { news, loading: newsLoading, error: newsError, isEmpty: newsEmpty } = useNews({ limit: 3 })
  const { images, loading: galleryLoading, error: galleryError, isEmpty: galleryEmpty } = useGallery({ limit: 6 })
  const newsletter = useNewsletterSubscription()
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleNewsletterChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    const didSubscribe = await newsletter.subscribe(formData)

    if (didSubscribe) {
      setFormData({ name: '', email: '' })
    }
  }

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/"
        description="Discover Knowledgebased Basic Science Schools, FHA Lugbe, Abuja - a warm, modern nursery to JSS school for growing minds."
        title="KBS Nigeria | Knowledgebased Basic Science Schools"
      />

      <section className="overflow-hidden bg-[var(--gradient-hero)] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:grid-cols-2 lg:items-center lg:px-10 lg:pt-24">
          <div className="space-y-8">
            <motion.p
              className="font-calligraphy text-lg italic text-kbs-lavender sm:text-xl"
              {...fadeUpMotion(prefersReducedMotion)}
            >
              Nurturing great minds since 1999
            </motion.p>

            <div className="space-y-4">
              <motion.h1
                className="font-display text-5xl leading-[1.15] text-white sm:text-[3.25rem] lg:text-[3.5rem]"
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView={prefersReducedMotion ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.5 }}
                variants={
                  prefersReducedMotion
                    ? undefined
                    : {
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                      }
                }
              >
                {heroWords.map((word) => (
                  <motion.span
                    className="mr-3 inline-block"
                    key={word}
                    variants={
                      prefersReducedMotion
                        ? undefined
                        : {
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }
                    }
                    transition={prefersReducedMotion ? undefined : { duration: 0.5, ease: 'easeOut' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="max-w-2xl font-body text-lg leading-8 text-white/85"
                {...fadeUpMotion(prefersReducedMotion)}
              >
                At KBS Nigeria, every child is guided with warmth, structure, and curiosity through a school experience that feels joyful, modern, and deeply grounded.
              </motion.p>
            </div>

            <motion.div className="flex flex-col gap-4 sm:flex-row" {...fadeUpMotion(prefersReducedMotion)}>
              <Button as="link" size="lg" to="/admissions" variant="primary">
                Enquire Now
              </Button>
              <Button as="link" size="lg" to="/about" variant="secondary">
                Learn More
              </Button>
            </motion.div>
          </div>

          <motion.div
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 60 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.8, ease: 'easeOut' }}
          >
            <PlaceholderIllustration
              className="min-h-[320px] bg-white/10 text-white/80 sm:min-h-[420px]"
              label="Hero illustration placeholder"
            />
          </motion.div>
        </div>
        <WaveDivider color="cyan" />
      </section>

      <motion.section className="bg-kbs-cyan py-10" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
          {stats.map((stat) => (
            <Counter key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-10">
          <PlaceholderIllustration className="min-h-[280px] bg-surface-grey" label="About mascot placeholder" />

          <div className="space-y-6">
            <SectionHeader
              align="left"
              heading="A School Experience Built Around Care, Character, and Curiosity"
              overline="Welcome to KBS"
              subtext="From nursery through junior secondary, we combine nurturing guidance with strong academic foundations so children grow in confidence, discipline, and discovery."
            />
            <Button as="link" to="/about" variant="ghost">
              Learn More
            </Button>
          </div>
        </div>
      </motion.section>

      <section className="bg-surface-grey py-0">
        <WaveDivider color="surface-grey" direction="top" />
        <motion.div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10" {...fadeUpMotion(prefersReducedMotion)}>
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading="Learning Pathways for Every Stage"
            overline="Academics"
            subtext="Each level is thoughtfully structured to meet children where they are and prepare them for what comes next."
          />

          <motion.div
            className="grid gap-6 lg:grid-cols-3"
            initial={prefersReducedMotion ? false : 'hidden'}
            transition={prefersReducedMotion ? undefined : { staggerChildren: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
          >
            {academics.map((item) => (
              <motion.div
                key={item.title}
                transition={prefersReducedMotion ? undefined : { duration: 0.6, ease: 'easeOut' }}
                variants={
                  prefersReducedMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }
                }
              >
                <Card className="h-full space-y-5">
                  <PlaceholderIllustration className="min-h-[180px] bg-white" label={`${item.title} illustration placeholder`} />
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold uppercase tracking-wide text-kbs-cyan">{item.ages}</p>
                    <h3 className="font-display text-3xl text-kbs-navy">{item.title}</h3>
                    <p className="font-body text-base leading-7 text-text-medium">{item.description}</p>
                  </div>
                  <Link
                    className="inline-flex items-center gap-2 font-body text-sm font-semibold text-kbs-cyan transition-colors duration-200 hover:text-kbs-purple"
                    to="/academics"
                  >
                    <span>Explore {item.title}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <WaveDivider color="white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              align="left"
              heading="Latest News & Announcements"
              overline="Latest News"
              subtext="Stay up to date with school events, term updates, and important announcements for parents and pupils."
            />
            <Link
              className="inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-kbs-cyan transition-colors duration-200 hover:text-kbs-purple"
              to="/news"
            >
              <span>View all news</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {newsLoading ? <NewsSkeleton /> : null}
          {!newsLoading && newsError ? <p className="font-body text-sm text-error">Unable to load the latest news right now.</p> : null}

          {!newsLoading && !newsError && !newsEmpty ? (
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

          {!newsLoading && !newsError && newsEmpty ? (
            <EmptyState
              action={{ as: 'link', label: 'View News Page', to: '/news', variant: 'secondary' }}
              description="Published school updates will appear here as soon as they are added from the admin panel."
              illustration={<PlaceholderIllustration className="min-h-[180px] bg-surface-grey" label="News placeholder" />}
              title="No news published yet"
            />
          ) : null}
        </div>
      </motion.section>

      <motion.section className="bg-surface-grey py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              align="left"
              heading="A Glimpse Into School Life"
              overline="Gallery"
              subtext="Moments from classrooms, events, and the everyday experiences that make KBS feel vibrant and welcoming."
            />
            <Button as="link" to="/gallery" variant="secondary">
              View Full Gallery
            </Button>
          </div>

          {galleryLoading ? <GallerySkeleton /> : null}
          {!galleryLoading && galleryError ? <p className="font-body text-sm text-error">Unable to load gallery images right now.</p> : null}

          {!galleryLoading && !galleryError && !galleryEmpty ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {images.map((image, index) => (
                <div className="mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm" key={image.id}>
                  <img
                    alt={image.caption || `KBS gallery image ${index + 1}`}
                    className="h-auto w-full object-cover"
                    height="900"
                    loading="lazy"
                    src={image.url}
                    width="1200"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {!galleryLoading && !galleryError && galleryEmpty ? (
            <EmptyState
              action={{ as: 'link', label: 'Visit Gallery', to: '/gallery', variant: 'secondary' }}
              description="Gallery images from school life will appear here once uploads are available."
              illustration={<PlaceholderIllustration className="min-h-[180px] bg-white" label="Gallery placeholder" />}
              title="No gallery images yet"
            />
          ) : null}
        </div>
      </motion.section>

      <motion.section className="px-6 py-20 sm:px-8 sm:py-24 lg:px-10" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] bg-[var(--gradient-cta)] px-8 py-10 text-white sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <p className="font-calligraphy text-xl italic text-white/85">Admissions open</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Begin Your Child&apos;s Journey With KBS Nigeria</h2>
            <p className="max-w-2xl font-body text-lg leading-8 text-white/85">
              Speak with our team about admissions, school culture, and how we can support your child at every stage of learning.
            </p>
            <Button as="link" size="lg" to="/admissions" variant="primary">
              Enquire Now
            </Button>
          </div>

          <PlaceholderIllustration
            className="min-h-[260px] border-white/20 bg-white/10 text-white/80"
            label="Admissions illustration placeholder"
          />
        </div>
      </motion.section>

      <motion.section className="pb-20 sm:pb-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-surface-grey bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
            <SectionHeader
              align="center"
              className="mx-auto mb-10"
              heading="Stay in Touch With School Updates"
              overline="Newsletter Subscribe"
              subtext="Join families receiving announcements, reminders, and highlights from across the school."
            />

            <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleNewsletterSubmit}>
              <Input
                label="Name"
                name="name"
                onChange={handleNewsletterChange}
                required
                value={formData.name}
              />
              <Input
                label="Email"
                name="email"
                onChange={handleNewsletterChange}
                required
                type="email"
                value={formData.email}
              />
              <div className="sm:col-span-2 flex flex-col items-center gap-4">
                <Button loading={newsletter.loading} size="lg" type="submit" variant="primary">
                  Subscribe
                </Button>
                {newsletter.success ? <p className="text-center font-body text-sm text-success">{newsletter.success}</p> : null}
                {newsletter.error ? <p className="text-center font-body text-sm text-error">{newsletter.error}</p> : null}
                <p className="text-center font-body text-sm text-text-medium">Join families already subscribed to KBS updates.</p>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
