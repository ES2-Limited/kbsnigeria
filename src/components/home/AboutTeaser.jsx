// Homepage about teaser — illustration + welcome copy.

import { School } from 'lucide-react'
import Button from '../ui/Button'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import WaveDivider from '../ui/WaveDivider'
import PlaceholderIllustration from './PlaceholderIllustration'

function AboutTeaser() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-10">
        <ScrollReveal direction="left">
          <PlaceholderIllustration
            className="h-64"
            icon={School}
            label="About mascot illustration"
          />
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal direction="right" delay={0.2}>
            <SectionHeader
              align="left"
              heading="A School Experience Built Around Care, Character, and Curiosity"
              overline="Welcome to KBS"
              subtext="From nursery through junior secondary, we combine nurturing guidance with strong academic foundations so children grow in confidence, discipline, and discovery."
            />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.35}>
            <Button as="link" to="/about" variant="ghost">
              Learn More
            </Button>
          </ScrollReveal>
        </div>
      </div>
      <WaveDivider className="text-bg-light" />
    </section>
  )
}

export default AboutTeaser
