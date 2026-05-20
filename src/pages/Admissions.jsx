// Admissions page implementation following PRD US-04.

import { motion, useReducedMotion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/ui/Button'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import Input from '../components/ui/Input'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import Textarea from '../components/ui/Textarea'
import WaveDivider from '../components/ui/WaveDivider'
import { useEnquirySubmission } from '../hooks/useEnquirySubmission'

const processSteps = [
  {
    title: 'Send an Enquiry',
    description: 'Tell us about your child and the class level you are considering through the admissions form below.',
  },
  {
    title: 'Speak With Our Team',
    description: 'Our admissions team will contact you to answer questions, explain availability, and guide you through next steps.',
  },
  {
    title: 'Visit the School',
    description: 'Families can visit the campus, see the learning environment, and better understand what everyday life at KBS feels like.',
  },
  {
    title: 'Complete Registration',
    description: 'Once you are ready to proceed, we guide you through documentation, placement, and enrolment confirmation.',
  },
]

const requirements = [
  'Completed admissions enquiry and follow-up discussion with the school',
  'Child birth certificate or age documentation',
  'Recent passport photographs',
  'Previous school records where applicable',
  'Parent or guardian contact details',
]

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

function WhatsAppIcon(props) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.8C6.9 2.8 2.8 6.9 2.8 12C2.8 13.8 3.3 15.4 4.3 16.9L3 21.2L7.5 20C8.9 20.8 10.4 21.2 12 21.2C17.1 21.2 21.2 17.1 21.2 12C21.2 6.9 17.1 2.8 12 2.8ZM12 19.3C10.6 19.3 9.3 18.9 8.1 18.2L7.8 18L5.2 18.7L6 16.2L5.8 15.8C5 14.6 4.6 13.3 4.6 12C4.6 7.9 7.9 4.6 12 4.6C16.1 4.6 19.4 7.9 19.4 12C19.4 16.1 16.1 19.3 12 19.3ZM16.2 13.8C16 13.7 14.8 13.1 14.6 13.1C14.4 13 14.2 13 14.1 13.2C13.9 13.5 13.5 14 13.4 14.1C13.3 14.2 13.2 14.3 13 14.2C11.8 13.6 10.9 12.9 10 11.4C9.9 11.2 10 11.1 10.1 11C10.2 10.9 10.4 10.7 10.5 10.6C10.6 10.5 10.7 10.3 10.8 10.2C10.9 10 10.8 9.9 10.8 9.7C10.7 9.6 10.2 8.4 10 7.9C9.8 7.5 9.6 7.5 9.5 7.5H9C8.8 7.5 8.6 7.6 8.5 7.7C8.3 7.9 7.8 8.4 7.8 9.4C7.8 10.4 8.5 11.3 8.6 11.4C8.7 11.6 10.1 13.7 12.2 14.6C14.3 15.5 14.3 15.2 14.7 15.2C15.1 15.1 16 14.6 16.2 14.1C16.4 13.7 16.4 13.9 16.2 13.8Z" />
    </svg>
  )
}

function Admissions() {
  const prefersReducedMotion = useReducedMotion()
  const enquiry = useEnquirySubmission()
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    classLevel: '',
    phone: '',
    email: '',
    message: '',
  })

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
      })
    }
  }

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/admissions"
        description="Find admissions steps, requirements, contact details, and enquiry options for enrolling at KBS Nigeria."
        title="Admissions | KBS Nigeria"
      />

      <section className="overflow-hidden bg-[var(--gradient-hero)] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">Admissions</p>
            <h1 className="font-display text-5xl leading-[1.15] text-white sm:text-[3.25rem] lg:text-[3.5rem]">
              Start Your Child&apos;s KBS Journey With Confidence
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Learn how admissions work, what we require, and how to contact us directly for guidance on the best next step for your family.
            </p>
          </motion.div>
        </div>
        <WaveDivider color="white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading="How Admissions Work"
            overline="Step by Step"
            subtext="Our admissions process is simple, personal, and designed to help parents make informed decisions."
          />
          <div className="grid gap-6 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div key={step.title} {...fadeUpMotion(prefersReducedMotion)}>
                <div className="h-full rounded-2xl border border-surface-grey bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-kbs-cyan font-display text-2xl text-white">
                    {index + 1}
                  </div>
                  <h2 className="font-body text-lg font-semibold text-text-dark">{step.title}</h2>
                  <p className="mt-3 font-body text-base leading-8 text-text-medium">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-surface-grey py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12 lg:px-10">
          <div className="mb-10 lg:mb-0">
            <SectionHeader
              align="left"
              heading="Admissions Requirements"
              overline="What to Prepare"
              subtext="Before admission is finalised, families may be asked to provide the following documents and information."
            />
            <ul className="mt-6 space-y-4 font-body text-base text-text-medium">
              {requirements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <IllustrationPlaceholder className="min-h-[320px] bg-white" label="Admissions illustration placeholder" />
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

            <form className="space-y-5 rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
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
                <Button loading={enquiry.loading} size="lg" type="submit" variant="primary">
                  Submit Enquiry
                </Button>
                {enquiry.success ? <p className="font-body text-sm text-success">{enquiry.success}</p> : null}
                {enquiry.error ? <p className="font-body text-sm text-error">{enquiry.error}</p> : null}
              </div>
            </form>
          </div>

          <div className="mt-12 space-y-8 lg:mt-0">
            <div className="rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-3xl text-kbs-navy">Visit or Contact Us</h2>
              <div className="mt-6 space-y-4 font-body text-base text-text-medium">
                <a className="flex min-h-11 items-start gap-3 hover:text-kbs-cyan" href="tel:+2348000000000">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                  <span>+234 800 000 0000</span>
                </a>
                <a className="flex min-h-11 items-start gap-3 hover:text-kbs-cyan" href="mailto:info@kbsnigeria.com">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                  <span>info@kbsnigeria.com</span>
                </a>
                <a
                  className="flex min-h-11 items-start gap-3 hover:text-kbs-cyan"
                  href="https://maps.google.com/?q=FHA+Lugbe+Abuja"
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                  <span>FHA Lugbe, Abuja, Nigeria</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-surface-grey bg-white shadow-sm">
              <iframe
                className="h-[320px] w-full"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=FHA%20Lugbe%20Abuja&z=14&output=embed"
                title="Map showing FHA Lugbe, Abuja"
                width="640"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <a
        className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-md transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success/30 lg:bottom-8 lg:right-8"
        href="https://wa.me/2348000000000"
        rel="noreferrer"
        target="_blank"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="sr-only">Chat with KBS on WhatsApp</span>
      </a>
    </div>
  )
}

export default Admissions
