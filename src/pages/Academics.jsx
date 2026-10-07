// Academics page implementation following PRD US-03.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import PageSeo from '../components/seo/PageSeo'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BrandIllustration from '../components/ui/BrandIllustration'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { trackScheduleVisitClick } from '../lib/analytics'
import { cn } from '../lib/cn'
import { academicsCopy, cta, ctaLinks, seo, tiers } from '../lib/messaging'
import { fadeUpMotion } from '../lib/motion'

const tierList = [
  {
    id: 'nursery',
    name: tiers.nursery.name,
    ageRange: tiers.nursery.ages,
    headline: tiers.nursery.tagline,
    subjects: ['Early Literacy', 'Numeracy', 'Creative Play', 'Social Development'],
    extracurriculars: ['Music Time', 'Story Circle', 'Hands-on Play', 'Outdoor Exploration'],
    description:
      'Our nursery programme introduces children to school life through play, language development, early number work, and the Islamic values that shape confident young learners.',
  },
  {
    id: 'primary',
    name: tiers.primary.name,
    ageRange: tiers.primary.ages,
    headline: tiers.primary.tagline,
    subjects: ['English Studies', 'Mathematics', 'Basic Science', 'ICT', 'Social Studies'],
    extracurriculars: ['Reading Club', 'Art & Craft', 'School Sports', 'Science Activities'],
    description:
      'The primary years strengthen academic foundations while encouraging disciplined learning, noble character, teamwork, and curiosity across core subjects.',
  },
  {
    id: 'jss',
    name: tiers.jss.name,
    ageRange: tiers.jss.ages,
    headline: tiers.jss.tagline,
    subjects: ['English Language', 'Mathematics', 'Integrated Science', 'Business Studies', 'Civic Education'],
    extracurriculars: ['Debate', 'STEM Projects', 'Leadership Activities', 'Creative Arts'],
    description:
      'The JSS programme prepares learners for the next stage with deeper academic rigour, technology exposure, personal responsibility, and leadership development.',
  },
]

function Academics() {
  const prefersReducedMotion = useReducedMotion()
  const [activeTier, setActiveTier] = useState(tierList[0])

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/academics"
        description={seo.academics.description}
        title={seo.academics.title}
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="mx-auto max-w-3xl space-y-5 text-center" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">{academicsCopy.hero.overline}</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              {academicsCopy.hero.heading}
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              {academicsCopy.hero.subtext}
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-24 sm:py-32" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-10"
            heading="Explore Our Academic Tiers"
            overline="Curriculum Overview"
            subtext="Each tier balances strong academics with age-appropriate activities, Islamic character, and technology readiness."
          />

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tierList.map((tier) => (
              <button
                aria-pressed={activeTier.id === tier.id}
                className={cn(
                  'min-h-11 rounded-full px-5 py-3 font-body text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20',
                  activeTier.id === tier.id ? 'bg-brand-primary text-white' : 'bg-bg-light text-text-secondary hover:text-brand-primary',
                )}
                key={tier.id}
                onClick={() => setActiveTier(tier)}
                type="button"
              >
                {tier.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start"
              exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              key={activeTier.id}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
            >
              <BrandIllustration
                alt={`${activeTier.name} programme illustration`}
                className="min-h-[340px] rounded-3xl bg-bg-light p-6"
                name={activeTier.id}
              />

              <div className="space-y-6">
                <div className="space-y-3">
                  <Badge variant="cyan">{activeTier.ageRange}</Badge>
                  <h2 className="font-display text-4xl text-text-primary">{activeTier.name}</h2>
                  <p className="font-display text-xl text-brand-primary">{activeTier.headline}</p>
                  <p className="font-body text-base leading-8 text-text-secondary">{activeTier.description}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="space-y-4">
                    <h3 className="font-body text-lg font-semibold text-text-primary">Key Subjects</h3>
                    <ul className="space-y-3 font-body text-base text-text-secondary">
                      {activeTier.subjects.map((subject) => (
                        <li key={subject}>• {subject}</li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="space-y-4">
                    <h3 className="font-body text-lg font-semibold text-text-primary">Extracurriculars</h3>
                    <ul className="space-y-3 font-body text-base text-text-secondary">
                      {activeTier.extracurriculars.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="space-y-3 bg-bg-light">
                  <h3 className="font-body text-lg font-semibold text-text-primary">Curriculum Alignment</h3>
                  <p className="font-body text-base leading-8 text-text-secondary">
                    This tier is delivered in line with NERDC curriculum expectations, with structured classroom practice designed to prepare learners for the academic demands of the next level.
                  </p>
                </Card>

                <Button
                  as="link"
                  onClick={() => trackScheduleVisitClick('academics_tier')}
                  to={ctaLinks.scheduleVisit}
                  variant="primary"
                >
                  {cta.scheduleVisit}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  )
}

export default Academics
