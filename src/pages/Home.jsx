// Homepage — composed of animated sections living in src/components/home/.

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
import PageSeo from '../components/seo/PageSeo'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'

function Home() {
  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/"
        description="Discover Knowledgebased Basic Science Schools, FHA Lugbe, Abuja — a warm, modern nursery to JSS school for growing minds."
        title="KBS Nigeria | Knowledgebased Basic Science Schools"
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. STATS BAR ────────────────────────────────────────────────────── */}
      <StatsSection />
      <MarqueeStrip />

      {/* ── 3. ABOUT TEASER ─────────────────────────────────────────────────── */}
      <AboutTeaser />

      {/* ── 4. ACADEMICS ────────────────────────────────────────────────────── */}
      <AcademicsSection />

      {/* ── 5. NEWS ─────────────────────────────────────────────────────────── */}
      <NewsSection />
      <WaveDivider className="text-bg-light" />

      {/* ── 6. GALLERY TEASER ───────────────────────────────────────────────── */}
      <GalleryTeaser />
      <WaveDivider className="text-brand-primary" />

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <TestimonialsSection />
      <WaveDivider className="text-white" />

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
