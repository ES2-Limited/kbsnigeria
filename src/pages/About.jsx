// About page implementation following PRD US-02.

import { Award } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import PageSeo from '../components/seo/PageSeo'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FallbackImage from '../components/ui/FallbackImage'
import { LEGACY_STAFF_PHOTOS } from '../lib/legacyGallery'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useAchievements } from '../hooks/useAchievements'
import { aboutCopy, pillars, seo } from '../lib/messaging'
import { fadeUpMotion } from '../lib/motion'

const staff = [
  { name: 'Mrs Amina Yusuf', role: 'Head of School', photo: LEGACY_STAFF_PHOTOS.principal },
  { name: 'Mr Chinedu Okafor', role: 'Vice Principal, Academics', photo: LEGACY_STAFF_PHOTOS.staff[1] },
  { name: 'Mrs Zainab Bello', role: 'Nursery Coordinator', photo: LEGACY_STAFF_PHOTOS.staff[0] },
  { name: 'Mr Tunde Adewale', role: 'JSS Programme Lead', photo: LEGACY_STAFF_PHOTOS.staff[1] },
]

function About() {
  const prefersReducedMotion = useReducedMotion()
  const { achievements, loading: achievementsLoading, isEmpty: achievementsEmpty } = useAchievements({ featured: true, limit: 8 })

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/about"
        description={seo.about.description}
        title={seo.about.title}
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">{aboutCopy.hero.overline}</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              {aboutCopy.hero.heading}
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              {aboutCopy.hero.subtext}
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10">
          <FallbackImage
            alt="KBS campus — founding years"
            className="min-h-[320px] w-full rounded-3xl object-cover"
            src="/assets/legacy-gallery/campus-01.jpg"
          />
          <div className="space-y-6">
            <SectionHeader
              align="left"
              heading="Our Founding Story"
              overline="Since 1999"
              subtext="KBS Nigeria was established with a simple belief: children thrive when academic strength is paired with Islamic values, technology, and personal attention. What began as a focused school community has grown into Abuja's trusted environment for future-ready leaders."
            />
            <p className="font-body text-base leading-8 text-text-secondary">
              Over the years, the school has continued to invest in strong classroom culture, committed staff, and programmes that help children develop confidence, faith, curiosity, and good character from nursery through junior secondary level.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-bg-light py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading="What Guides Us"
            overline="Mission & Vision"
            subtext="The school's direction is shaped by a commitment to academic excellence, Islamic character, and technology-driven leadership."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
              <h2 className="font-display text-3xl text-text-primary">{aboutCopy.mission.title}</h2>
              <p className="font-body text-base leading-8 text-text-secondary">
                {aboutCopy.mission.body}
              </p>
            </Card>
            <Card className="space-y-4">
              <h2 className="font-display text-3xl text-text-primary">{aboutCopy.vision.title}</h2>
              <p className="font-body text-base leading-8 text-text-secondary">
                {aboutCopy.vision.body}
              </p>
            </Card>
          </div>
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading={aboutCopy.pillars.heading}
            overline={aboutCopy.pillars.overline}
            subtext={aboutCopy.pillars.subtext}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <Card className="space-y-4" key={pillar.title}>
                <h2 className="font-display text-2xl text-text-primary">{pillar.title}</h2>
                <p className="font-body text-base leading-8 text-text-secondary">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-bg-light py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10">
          <FallbackImage
            alt="Head teacher with pupils at KBS"
            className="min-h-[360px] w-full rounded-3xl object-cover"
            src={LEGACY_STAFF_PHOTOS.principal}
          />
          <div className="space-y-6">
            <SectionHeader
              align="left"
              heading="A Message From the Principal"
              overline="Leadership"
              subtext="KBS is committed to raising children who are not only academically prepared, but also grounded in faith, respectful, and ready to lead in a technology-driven world."
            />
            <blockquote className="font-calligraphy text-2xl italic leading-10 text-brand-purple sm:text-[1.75rem]">
              &ldquo;Every child deserves a school experience that sees their potential clearly and guides it patiently. That is the heart of our work at KBS.&rdquo;
            </blockquote>
            <p className="font-body text-base leading-8 text-text-secondary">
              Our leadership team works closely with staff and families to ensure that pupils are supported academically, spiritually, emotionally, and socially through every phase of their learning journey.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading="Meet Our Key Staff"
            overline="Staff"
            subtext="A committed team of educators and leaders helps create a school environment where children feel known, challenged, and supported."
          />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {staff.map((member) => (
              <Card className="space-y-4 p-4 sm:p-6" key={member.name}>
                <FallbackImage
                  alt={`${member.name}, ${member.role}`}
                  className="min-h-[180px] w-full rounded-2xl object-cover"
                  src={member.photo}
                />
                <div className="space-y-1">
                  <h3 className="font-body text-lg font-semibold text-text-primary">{member.name}</h3>
                  <p className="font-body text-sm text-text-secondary">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-12"
            heading="Outcomes & Milestones"
            overline="Achievements"
            subtext="A record of academic results, competitions, and community milestones that reflect the strength of the KBS learning culture."
          />
          {achievementsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((key) => (
                <div className="h-32 animate-pulse rounded-2xl bg-bg-light" key={key} />
              ))}
            </div>
          ) : null}
          {!achievementsLoading && achievementsEmpty ? (
            <EmptyState
              description="School achievements will appear here once added through the admin panel."
              illustration={<Award className="h-12 w-12 text-brand-primary" />}
              title="Achievements coming soon"
            />
          ) : null}
          {!achievementsLoading && !achievementsEmpty ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map((item) => (
                <Card className="space-y-3 p-5" key={item.id}>
                  <Award className="h-6 w-6 text-brand-primary" />
                  <h3 className="font-body text-lg font-semibold text-text-primary">{item.title}</h3>
                  {item.year ? <p className="font-body text-sm text-brand-primary">{item.year}</p> : null}
                  {item.category ? <p className="font-body text-xs uppercase tracking-wide text-text-secondary">{item.category}</p> : null}
                  {item.description ? (
                    <p className="font-body text-sm leading-7 text-text-secondary">{item.description}</p>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.section className="bg-bg-light py-16 sm:py-20" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-10"
            heading="Affiliations & Standards"
            overline="Trust Signals"
            subtext="Our academic and operational approach is shaped by recognised standards, Islamic values, technology integration, and continuous improvement."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aboutCopy.affiliations.map((item) => (
              <div
                className="flex min-h-24 items-center justify-center rounded-2xl border border-brand-gray/30 bg-white px-4 text-center font-body text-sm font-semibold text-text-primary shadow-sm"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default About
