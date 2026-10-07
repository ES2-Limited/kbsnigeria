// Homepage — composed of animated sections living in src/components/home/.

import { Award, Calendar, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import NewsletterSignupForm from '../components/forms/NewsletterSignupForm'
import AboutTeaser from '../components/home/AboutTeaser'
import AcademicsSection from '../components/home/AcademicsSection'
import AdmissionsCta from '../components/home/AdmissionsCta'
import GalleryTeaser from '../components/home/GalleryTeaser'
import HeroSection from '../components/home/HeroSection'
import MarqueeStrip from '../components/home/MarqueeStrip'
import NewsSection from '../components/home/NewsSection'
import StatsSection from '../components/home/StatsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import VideoEmbed from '../components/media/VideoEmbed'
import PageSeo from '../components/seo/PageSeo'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useAchievements } from '../hooks/useAchievements'
import { useEvents } from '../hooks/useEvents'
import { useSiteMedia } from '../hooks/useSiteMedia'
import { formatDate } from '../lib/format'
import { DEFAULT_TOUR_POSTER, TOUR_VIDEO_FALLBACK_CAPTION } from '../lib/illustrations'
import { seo } from '../lib/messaging'

function Home() {
  const { media: tourVideo, loading: tourLoading } = useSiteMedia('hero_tour_video')
  const { achievements, loading: achievementsLoading, isEmpty: achievementsEmpty } = useAchievements({
    featured: true,
    limit: 6,
  })
  const { events, loading: eventsLoading, isEmpty: eventsEmpty } = useEvents({
    publishedOnly: true,
    featured: true,
    upcoming: true,
    limit: 3,
  })
  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/"
        description={seo.home.description}
        title={seo.home.title}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. STATS BAR ────────────────────────────────────────────────────── */}
      <StatsSection />
      <MarqueeStrip />

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
      <AboutTeaser />

      {/* ── 4. ACADEMICS ────────────────────────────────────────────────────── */}
      <AcademicsSection />

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
      <NewsSection />
      <WaveDivider className="text-bg-light" />

      {/* ── 6. GALLERY TEASER ───────────────────────────────────────────────── */}
      <GalleryTeaser />
      <WaveDivider className="text-brand-primary" />

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <TestimonialsSection />
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
      <AdmissionsCta />

      {/* ── 9. NEWSLETTER ───────────────────────────────────────────────────── */}
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
              <NewsletterSignupForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider className="text-text-primary" />
    </div>
  )
}

export default Home
