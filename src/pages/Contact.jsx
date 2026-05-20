// Contact page implementation for public enquiries and newsletter signup.

import { motion, useReducedMotion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import Textarea from '../components/ui/Textarea'
import WaveDivider from '../components/ui/WaveDivider'
import { useEnquirySubmission } from '../hooks/useEnquirySubmission'
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription'
import { fadeUpMotion } from '../lib/motion'

function Contact() {
  const prefersReducedMotion = useReducedMotion()
  const enquiry = useEnquirySubmission()
  const newsletter = useNewsletterSubscription()
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    classLevel: '',
    phone: '',
    email: '',
    message: '',
  })
  const [newsletterData, setNewsletterData] = useState({ name: '', email: '' })

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleNewsletterChange = (event) => {
    const { name, value } = event.target
    setNewsletterData((current) => ({ ...current, [name]: value }))
  }

  const handleEnquirySubmit = async (event) => {
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

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    const didSubscribe = await newsletter.subscribe(newsletterData)

    if (didSubscribe) {
      setNewsletterData({ name: '', email: '' })
    }
  }

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/contact"
        description="Contact Knowledgebased Basic Science Schools in FHA Lugbe, Abuja for admissions enquiries, school information, and updates."
        title="Contact | KBS Nigeria"
      />

      <section className="overflow-hidden bg-[var(--gradient-hero)] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">Contact & Location</p>
            <h1 className="font-display text-5xl leading-[1.15] text-white sm:text-[3.25rem] lg:text-[3.5rem]">
              We&apos;re Here to Help Your Family Take the Next Step
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Reach out for admissions questions, school information, and updates from the KBS Nigeria team.
            </p>
          </motion.div>
        </div>
        <WaveDivider color="white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12 lg:px-10">
          <div className="space-y-8">
            <SectionHeader
              align="left"
              heading="Visit or Contact the School"
              overline="Get in Touch"
              subtext="You can call, email, visit, or send an enquiry using the form. Our team will be happy to guide you."
            />

            <div className="space-y-4 rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8">
              <a className="flex min-h-11 items-start gap-3 font-body text-base text-text-medium hover:text-kbs-cyan" href="tel:+2348000000000">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                <span>+234 800 000 0000</span>
              </a>
              <a className="flex min-h-11 items-start gap-3 font-body text-base text-text-medium hover:text-kbs-cyan" href="mailto:info@kbsnigeria.com">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                <span>info@kbsnigeria.com</span>
              </a>
              <a
                className="flex min-h-11 items-start gap-3 font-body text-base text-text-medium hover:text-kbs-cyan"
                href="https://maps.google.com/?q=FHA+Lugbe+Abuja"
                rel="noreferrer"
                target="_blank"
              >
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-kbs-cyan" />
                <span>FHA Lugbe, Abuja, Nigeria</span>
              </a>
            </div>

            <IllustrationPlaceholder className="min-h-[260px] bg-surface-grey" label="Contact illustration placeholder" />
          </div>

          <div className="mt-12 space-y-8 lg:mt-0">
            <form className="rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8" onSubmit={handleEnquirySubmit}>
              <SectionHeader
                align="left"
                className="mb-6"
                heading="Send an Enquiry"
                overline="Admissions & General Questions"
                subtext="Share your details and what you would like to know."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Parent Name" name="parentName" onChange={handleFormChange} required value={formData.parentName} />
                <Input label="Child Name" name="childName" onChange={handleFormChange} required value={formData.childName} />
                <Input label="Child Age / Class Level" name="classLevel" onChange={handleFormChange} required value={formData.classLevel} />
                <Input label="Phone Number" name="phone" onChange={handleFormChange} required type="tel" value={formData.phone} />
                <div className="sm:col-span-2">
                  <Input label="Email Address" name="email" onChange={handleFormChange} required type="email" value={formData.email} />
                </div>
                <div className="sm:col-span-2">
                  <Textarea label="Message" name="message" onChange={handleFormChange} required rows={5} value={formData.message} />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <Button loading={enquiry.loading} size="lg" type="submit" variant="primary">
                  Submit Enquiry
                </Button>
                {enquiry.success ? <p className="font-body text-sm text-success">{enquiry.success}</p> : null}
                {enquiry.error ? <p className="font-body text-sm text-error">{enquiry.error}</p> : null}
              </div>
            </form>

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

            <form className="rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8" onSubmit={handleNewsletterSubmit}>
              <SectionHeader
                align="left"
                className="mb-6"
                heading="Subscribe to School Updates"
                overline="Newsletter"
                subtext="Receive important announcements and family updates from the school."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" name="name" onChange={handleNewsletterChange} required value={newsletterData.name} />
                <Input label="Email" name="email" onChange={handleNewsletterChange} required type="email" value={newsletterData.email} />
              </div>
              <div className="mt-5 space-y-3">
                <Button loading={newsletter.loading} size="lg" type="submit" variant="primary">
                  Subscribe
                </Button>
                {newsletter.success ? <p className="font-body text-sm text-success">{newsletter.success}</p> : null}
                {newsletter.error ? <p className="font-body text-sm text-error">{newsletter.error}</p> : null}
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Contact
