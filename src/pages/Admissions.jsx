// Admissions page implementation following PRD US-04.

import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactDetails from '../components/layout/ContactDetails'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import HoneypotField from '../components/ui/HoneypotField'
import BrandIllustration from '../components/ui/BrandIllustration'
import Input from '../components/ui/Input'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import Textarea from '../components/ui/Textarea'
import WaveDivider from '../components/ui/WaveDivider'
import { useEnquirySubmission } from '../hooks/useEnquirySubmission'
import { fadeUpMotion } from '../lib/motion'
import { MAPS_EMBED_URL } from '../lib/site'

const requirements = [
  'Completed admissions enquiry and follow-up discussion with the school',
  'Child birth certificate or age documentation',
  'Recent passport photographs',
  'Previous school records where applicable',
  'Parent or guardian contact details',
]

function Admissions() {
  const prefersReducedMotion = useReducedMotion()
  const [searchParams] = useSearchParams()
  const enquiry = useEnquirySubmission()
  const { events, loading: eventsLoading, isEmpty: eventsEmpty } = useEvents({
    publishedOnly: true,
    upcoming: true,
    limit: 3,
  })
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    classLevel: '',
    phone: '',
    email: '',
    message: '',
    intent: 'general',
    website: '',
  })

  useEffect(() => {
    const queryIntent = searchParams.get('intent')
    if (queryIntent) {
      setFormData((current) => ({
        ...current,
        intent: intentFromQueryParam(queryIntent),
      }))
    }
  }, [searchParams])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const didSubmit = await enquiry.submitEnquiry(formData)

    if (didSubmit) {
      setFormData({
        parentName: '',
        childName: '',
        classLevel: '',
        phone: '',
        email: '',
        message: '',
        intent: intentFromQueryParam(searchParams.get('intent')),
        website: '',
      })
    }
  }

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/admissions"
        description={seo.admissions.description}
        title={seo.admissions.title}
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">{admissionsCopy.hero.overline}</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              {admissionsCopy.hero.heading}
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              {admissionsCopy.hero.subtext}
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading={admissionsCopy.process.heading}
            overline={admissionsCopy.process.overline}
            subtext={admissionsCopy.process.subtext}
          />
          <div className="grid gap-6 lg:grid-cols-4">
            {funnelSteps.map((step, index) => (
              <motion.div key={step.title} {...fadeUpMotion(prefersReducedMotion)}>
                <div className="h-full rounded-2xl border border-brand-gray/30 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary font-display text-2xl text-white">
                    {index + 1}
                  </div>
                  <h2 className="font-body text-lg font-semibold capitalize text-text-primary">{step.title}</h2>
                  <p className="mt-3 font-body text-base leading-8 text-text-secondary">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-white py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading={admissionsCopy.events.heading}
            overline={admissionsCopy.events.overline}
            subtext={admissionsCopy.events.subtext}
          />

          {eventsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((key) => (
                <div className="h-44 animate-pulse rounded-3xl bg-bg-light" key={key} />
              ))}
            </div>
          ) : null}

          {!eventsLoading && eventsEmpty ? (
            <EmptyState
              description="Open classroom days, STEM discovery sessions, and assessment weeks will appear here once published."
              illustration={<Calendar className="h-12 w-12 text-brand-primary" />}
              title="No upcoming events yet"
            />
          ) : null}

          {!eventsLoading && !eventsEmpty ? (
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <Card className="flex h-full flex-col justify-between gap-4" key={event.id}>
                  <div className="space-y-3">
                    {event.type ? (
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        {event.type}
                      </p>
                    ) : null}
                    <h2 className="font-display text-xl text-text-primary">{event.title}</h2>
                    <p className="flex items-center gap-2 font-body text-sm text-text-secondary">
                      <Calendar className="h-4 w-4 shrink-0 text-brand-primary" />
                      {formatEventDate(event.event_date)}
                    </p>
                    {event.description ? (
                      <p className="font-body text-sm leading-7 text-text-secondary line-clamp-3">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {event.cta_label && event.cta_url ? (
                      /^https?:\/\//i.test(event.cta_url) ? (
                        <a
                          className="inline-flex min-h-11 items-center rounded-full bg-brand-primary px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-brand-secondary"
                          href={event.cta_url}
                          onClick={() => trackEventCtaClick(event.title, 'admissions')}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {event.cta_label}
                        </a>
                      ) : (
                        <Button
                          as="link"
                          onClick={() => trackEventCtaClick(event.title, 'admissions')}
                          size="sm"
                          to={event.cta_url}
                          variant="primary"
                        >
                          {event.cta_label}
                        </Button>
                      )
                    ) : (
                      <Button as="link" size="sm" to="/admissions?intent=open-day" variant="primary">
                        Register Interest
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          <div className="mt-10 text-center">
            <Link
              className="inline-flex items-center gap-1 font-body text-sm font-semibold text-brand-primary hover:text-brand-purple"
              to="/events"
            >
              <span>View all school events</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-bg-light py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12 lg:px-10">
          <div className="mb-10 lg:mb-0">
            <SectionHeader
              align="left"
              heading="Admissions Requirements"
              overline="What to Prepare"
              subtext="Before admission is finalised, families may be asked to provide the following documents and information."
            />
            <ul className="mt-6 space-y-4 font-body text-base text-text-secondary">
              {requirements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <BrandIllustration
            alt="Parent and child arriving at KBS for admissions"
            className="min-h-[320px] rounded-3xl bg-white p-6"
            name="admissions"
          />
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10">
          <div>
            <SectionHeader
              align="left"
              className="mb-8"
              heading="Send an Admissions Enquiry"
              overline="Get in Touch"
              subtext="Tell us about your child and what you would like to know. Our team will follow up with the next steps."
            />

            <form className="relative space-y-5 rounded-3xl border border-brand-gray/30 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
              <HoneypotField name="website" onChange={handleChange} value={formData.website} />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary" htmlFor="intent">
                    Enquiry Type
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <select
                    className={selectBaseClass}
                    id="intent"
                    name="intent"
                    onChange={handleChange}
                    required
                    value={formData.intent}
                  >
                    {ENQUIRY_INTENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Parent Name"
                  name="parentName"
                  onChange={handleChange}
                  required
                  value={formData.parentName}
                />
                <Input
                  label="Child Name"
                  name="childName"
                  onChange={handleChange}
                  required
                  value={formData.childName}
                />
                <Input
                  label="Child Age / Class Level"
                  name="classLevel"
                  onChange={handleChange}
                  required
                  value={formData.classLevel}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  required
                  type="tel"
                  value={formData.phone}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Message"
                    name="message"
                    onChange={handleChange}
                    required
                    rows={6}
                    value={formData.message}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth loading={enquiry.loading} loadingText="Sending..." size="lg" type="submit" variant="primary">
                  {cta.enquireNow}
                </Button>
                {enquiry.success ? <p className="font-body text-sm text-success" role="status">{enquiry.success}</p> : null}
                {enquiry.error ? <p className="font-body text-sm text-error" role="alert">{enquiry.error}</p> : null}
              </div>
            </form>
          </div>

          <div className="mt-12 space-y-8 lg:mt-0">
            <div className="rounded-3xl border border-brand-gray/30 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-3xl text-text-primary">Visit or Contact Us</h2>
              <div className="mt-6">
                <ContactDetails />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-brand-gray/30 bg-white shadow-sm">
              <iframe
                className="h-[320px] w-full"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={MAPS_EMBED_URL}
                title="Map showing KBS Nigeria, FHA Lugbe, Abuja"
                width="640"
              />
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Admissions
