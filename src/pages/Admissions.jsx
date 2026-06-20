// Admissions page implementation following PRD US-04.

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import ContactDetails from '../components/layout/ContactDetails'
import Button from '../components/ui/Button'
import HoneypotField from '../components/ui/HoneypotField'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import Input from '../components/ui/Input'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import Textarea from '../components/ui/Textarea'
import WaveDivider from '../components/ui/WaveDivider'
import { useEnquirySubmission } from '../hooks/useEnquirySubmission'
import { MAPS_EMBED_URL } from '../lib/site'

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
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.6, ease: 'easeOut' },
      }
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
    website: '',
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
        website: '',
      })
    }
  }

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/admissions"
        description="Find admissions steps, requirements, contact details, and enquiry options for enrolling at KBS Nigeria."
        title="Admissions | KBS Nigeria"
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">Admissions</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              Start Your Child&apos;s KBS Journey With Confidence
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Learn how admissions work, what we require, and how to contact us directly for guidance on the best next step for your family.
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
            heading="How Admissions Work"
            overline="Step by Step"
            subtext="Our admissions process is simple, personal, and designed to help parents make informed decisions."
          />
          <div className="grid gap-6 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div key={step.title} {...fadeUpMotion(prefersReducedMotion)}>
                <div className="h-full rounded-2xl border border-brand-gray/30 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary font-display text-2xl text-white">
                    {index + 1}
                  </div>
                  <h2 className="font-body text-lg font-semibold text-text-primary">{step.title}</h2>
                  <p className="mt-3 font-body text-base leading-8 text-text-secondary">{step.description}</p>
                </div>
              </motion.div>
            ))}
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

            <form className="relative space-y-5 rounded-3xl border border-brand-gray/30 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
              <HoneypotField name="website" onChange={handleChange} value={formData.website} />
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
                <Button fullWidth loading={enquiry.loading} loadingText="Sending..." size="lg" type="submit" variant="primary">
                  Submit Enquiry
                </Button>
                {enquiry.success ? <p className="font-body text-sm text-success">{enquiry.success}</p> : null}
                {enquiry.error ? <p className="font-body text-sm text-error">{enquiry.error}</p> : null}
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
