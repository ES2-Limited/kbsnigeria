// Public events listing page.

import { Calendar, ChevronRight, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageSeo from '../components/seo/PageSeo'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useEvents } from '../hooks/useEvents'
import { trackEventCtaClick } from '../lib/analytics'
import { fadeUpMotion } from '../lib/motion'

function formatEventDate(value) {
  if (!value) {
    return 'Date to be announced'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function EventCta({ event }) {
  if (!event.cta_label || !event.cta_url) {
    return (
      <Button as="link" size="sm" to="/contact" variant="secondary">
        Contact School
      </Button>
    )
  }

  const isExternal = /^https?:\/\//i.test(event.cta_url)

  const handleClick = () => {
    trackEventCtaClick(event.title, 'events_page')
  }

  if (isExternal) {
    return (
      <a
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-primary px-5 py-2 font-body text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-secondary"
        href={event.cta_url}
        onClick={handleClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{event.cta_label}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    )
  }

  return (
    <Button as="link" onClick={handleClick} size="sm" to={event.cta_url} variant="primary">
      {event.cta_label}
    </Button>
  )
}

function Events() {
  const prefersReducedMotion = useReducedMotion()
  const { events, loading, error, isEmpty } = useEvents({ publishedOnly: true })

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/events"
        description="Discover upcoming open days, exhibitions, and school events at Knowledgebased Basic Science Schools, FHA Lugbe, Abuja."
        title="School Events | KBS Nigeria"
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">School Events</p>
            <h1 className="font-display text-h1 text-white sm:text-display">
              Open Days, Exhibitions & Community Moments
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Join us for upcoming events and celebrations across the KBS community. Event listings promote awareness and direct families to the right next step — not online ticketing.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <SectionHeader
            align="left"
            className="mb-10"
            heading="Upcoming & Recent Events"
            overline="What's On"
            subtext="Published events appear here automatically when added through the admin panel."
          />

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((key) => (
                <div className="h-48 animate-pulse rounded-3xl bg-white" key={key} />
              ))}
            </div>
          ) : null}

          {error ? <p className="font-body text-sm text-error">Unable to load events right now.</p> : null}

          {!loading && !error && isEmpty ? (
            <EmptyState
              description="School events will appear here once they are published from the admin panel."
              illustration={<Calendar className="h-12 w-12 text-brand-primary" />}
              title="No events published yet"
            />
          ) : null}

          {!loading && !error && !isEmpty ? (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <Card className="flex h-full flex-col justify-between gap-5" key={event.id}>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {event.type ? <Badge variant="cyan">{event.type}</Badge> : null}
                      {event.featured ? <Badge variant="purple">Featured</Badge> : null}
                    </div>
                    <h2 className="font-display text-2xl text-text-primary">{event.title}</h2>
                    <p className="flex items-center gap-2 font-body text-sm text-text-secondary">
                      <Calendar className="h-4 w-4 shrink-0 text-brand-primary" />
                      {formatEventDate(event.event_date)}
                    </p>
                    {event.description ? (
                      <p className="font-body text-sm leading-7 text-text-secondary">{event.description}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <EventCta event={event} />
                    <Link
                      className="inline-flex items-center gap-1 font-body text-sm font-semibold text-brand-primary hover:text-brand-purple"
                      to="/contact"
                    >
                      <span>Ask a question</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}

export default Events
