// Academics page implementation following PRD US-03.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import PageSeo from '../components/seo/PageSeo'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { cn } from '../lib/cn'

const tiers = [
  {
    id: 'nursery',
    name: 'Nursery',
    ageRange: 'Ages 3-5',
    subjects: ['Early Literacy', 'Numeracy', 'Creative Play', 'Social Development'],
    extracurriculars: ['Music Time', 'Story Circle', 'Hands-on Play', 'Outdoor Exploration'],
    description:
      'Our nursery programme introduces children to school life through a gentle rhythm of play, language development, early number work, and social confidence building.',
  },
  {
    id: 'primary',
    name: 'Primary',
    ageRange: 'Ages 6-11',
    subjects: ['English Studies', 'Mathematics', 'Basic Science', 'ICT', 'Social Studies'],
    extracurriculars: ['Reading Club', 'Art & Craft', 'School Sports', 'Science Activities'],
    description:
      'The primary years strengthen academic foundations while encouraging disciplined learning, self-expression, teamwork, and curiosity across core subjects.',
  },
  {
    id: 'jss',
    name: 'JSS',
    ageRange: 'Ages 12-15',
    subjects: ['English Language', 'Mathematics', 'Integrated Science', 'Business Studies', 'Civic Education'],
    extracurriculars: ['Debate', 'STEM Projects', 'Leadership Activities', 'Creative Arts'],
    description:
      'The JSS programme prepares learners for the next stage with deeper academic rigour, personal responsibility, and exposure to leadership and practical problem solving.',
  },
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

function Academics() {
  const prefersReducedMotion = useReducedMotion()
  const [activeTier, setActiveTier] = useState(tiers[0])

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/academics"
        description="Explore the Nursery, Primary, and JSS academic programmes at KBS Nigeria, including subjects, activities, and curriculum alignment."
        title="Academics | KBS Nigeria"
      />

      <section className="overflow-hidden bg-hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">Academics</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              Programmes Designed for Every Learning Stage
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              From nursery to junior secondary, our curriculum is structured to build confidence, academic depth, and character at the right pace for each child.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-surface-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-10"
            heading="Explore Our Academic Tiers"
            overline="Curriculum Overview"
            subtext="Each tier balances strong academics with age-appropriate activities, structure, and developmental support."
          />

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tiers.map((tier) => (
              <button
                className={cn(
                  'min-h-11 rounded-full px-5 py-3 font-body text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20',
                  activeTier.id === tier.id ? 'bg-kbs-cyan text-white' : 'bg-surface-grey text-text-medium hover:text-kbs-navy',
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
              <IllustrationPlaceholder
                className="min-h-[340px] bg-surface-grey"
                label={`${activeTier.name} illustration placeholder`}
              />

              <div className="space-y-6">
                <div className="space-y-3">
                  <Badge variant="cyan">{activeTier.ageRange}</Badge>
                  <h2 className="font-display text-4xl text-kbs-navy">{activeTier.name}</h2>
                  <p className="font-body text-base leading-8 text-text-medium">{activeTier.description}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="space-y-4">
                    <h3 className="font-body text-lg font-semibold text-text-dark">Key Subjects</h3>
                    <ul className="space-y-3 font-body text-base text-text-medium">
                      {activeTier.subjects.map((subject) => (
                        <li key={subject}>• {subject}</li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="space-y-4">
                    <h3 className="font-body text-lg font-semibold text-text-dark">Extracurriculars</h3>
                    <ul className="space-y-3 font-body text-base text-text-medium">
                      {activeTier.extracurriculars.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="space-y-3 bg-surface-grey">
                  <h3 className="font-body text-lg font-semibold text-text-dark">Curriculum Alignment</h3>
                  <p className="font-body text-base leading-8 text-text-medium">
                    This tier is delivered in line with NERDC curriculum expectations, with structured classroom practice designed to prepare learners for the academic demands of the next level.
                  </p>
                </Card>

                <Button as="link" to="/admissions" variant="primary">
                  Enquire About {activeTier.name}
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
