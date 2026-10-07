// Homepage academics section — three tier cards.

import { motion, useReducedMotion } from 'framer-motion'
import { BookOpen, ChevronRight, Target, TreeDeciduous } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import WaveDivider from '../ui/WaveDivider'
import { fadeUpItemVariants, staggerContainerMotion } from '../../lib/motion'

const academics = [
  {
    title: 'Nursery',
    ages: 'Ages 3–5',
    description: 'A warm first classroom built around play, literacy, and the confidence to ask big questions.',
    variant: 'cyan',
    icon: TreeDeciduous,
  },
  {
    title: 'Primary',
    ages: 'Ages 6–11',
    description: 'Strong foundations in core subjects, creativity, and structured curiosity that grows every term.',
    variant: 'purple',
    icon: BookOpen,
  },
  {
    title: 'JSS',
    ages: 'Ages 12–15',
    description: 'Focused preparation for higher study through science, leadership, discipline, and discovery.',
    variant: 'navy',
    icon: Target,
  },
]

function AcademicsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-bg-light py-0">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-10">
        <ScrollReveal direction="up" className="mb-12">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              align="center"
              heading="Learning Pathways for Every Stage"
              overline="Academics"
              subtext="Each level is thoughtfully structured to meet children where they are and prepare them for what comes next."
            />
          </div>
        </ScrollReveal>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          {...staggerContainerMotion(prefersReducedMotion, 0.12)}
        >
          {academics.map((item) => (
            <motion.div key={item.title} variants={fadeUpItemVariants}>
              <Card className="group h-full space-y-5">
                <div className="rounded-xl bg-brand-gray/30 h-40 mb-4 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-gray/50 group-hover:scale-110">
                  {item.icon ? <item.icon className="h-16 w-16 text-brand-primary" /> : null}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.variant}>{item.title}</Badge>
                    <p className="font-body text-xs font-semibold uppercase tracking-wide text-brand-primary">{item.ages}</p>
                  </div>
                  <h3 className="font-display text-h3 text-text-primary">{item.title}</h3>
                  <p className="font-body text-sm text-text-secondary">{item.description}</p>
                </div>
                <Link
                  className="inline-flex items-center gap-1 font-body font-semibold text-brand-primary hover:text-brand-primary transition-colors"
                  to="/academics"
                >
                  <span>Explore {item.title}</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WaveDivider className="text-white" />
    </section>
  )
}

export default AcademicsSection
