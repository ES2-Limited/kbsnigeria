// About page implementation following PRD US-02.

import { motion, useReducedMotion } from 'framer-motion'
import PageSeo from '../components/seo/PageSeo'
import Card from '../components/ui/Card'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'

const staff = [
  { name: 'Mrs Amina Yusuf', role: 'Head of School' },
  { name: 'Mr Chinedu Okafor', role: 'Vice Principal, Academics' },
  { name: 'Mrs Zainab Bello', role: 'Nursery Coordinator' },
  { name: 'Mr Tunde Adewale', role: 'JSS Programme Lead' },
]

const affiliations = ['NERDC Aligned Curriculum', 'WAEC Preparation Track', 'Safe School Practices', 'Parent Partnership Focus']

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

function About() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="bg-bg-light">
      <PageSeo
        canonicalPath="/about"
        description="Learn the story, mission, leadership, and educational values behind Knowledgebased Basic Science Schools in Abuja."
        title="About KBS | KBS Nigeria"
      />

      <section className="overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-brand-gray">About KBS</p>
            <h1 className="font-display text-h1 sm:text-display text-white">
              A Trusted School Community Built on Purpose and Possibility
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Discover the story, values, leadership, and learning culture that shape everyday life at Knowledgebased Basic Science Schools.
            </p>
          </motion.div>
        </div>
        <WaveDivider className="text-white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10">
          <IllustrationPlaceholder className="min-h-[320px] bg-bg-light" label="Founding story illustration placeholder" />
          <div className="space-y-6">
            <SectionHeader
              align="left"
              heading="Our Founding Story"
              overline="Since 1999"
              subtext="KBS Nigeria was established with a simple belief: children thrive when academic strength is paired with warmth, discipline, and personal attention. What began as a focused school community has grown into a trusted environment where families expect both excellence and care."
            />
            <p className="font-body text-base leading-8 text-text-secondary">
              Over the years, the school has continued to invest in strong classroom culture, committed staff, and programmes that help children develop confidence, curiosity, and good character from nursery through junior secondary level.
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
            subtext="The school's direction is shaped by a commitment to strong learning, responsible leadership, and the flourishing of every child."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
              <h2 className="font-display text-3xl text-text-primary">Our Mission</h2>
              <p className="font-body text-base leading-8 text-text-secondary">
                To nurture confident, disciplined, and academically grounded learners through a joyful school experience that builds character, curiosity, and lifelong readiness.
              </p>
            </Card>
            <Card className="space-y-4">
              <h2 className="font-display text-3xl text-text-primary">Our Vision</h2>
              <p className="font-body text-base leading-8 text-text-secondary">
                To be recognised as a trusted school community where children discover their strengths, grow in integrity, and are equipped to contribute meaningfully to society.
              </p>
            </Card>
          </div>
        </div>
      </motion.section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10">
          <IllustrationPlaceholder className="min-h-[360px] bg-bg-light" label="Principal photo placeholder" />
          <div className="space-y-6">
            <SectionHeader
              align="left"
              heading="A Message From the Principal"
              overline="Leadership"
              subtext="KBS is committed to raising children who are not only academically prepared, but also confident, respectful, and ready to engage the world with purpose."
            />
            <blockquote className="font-calligraphy text-2xl italic leading-10 text-brand-purple sm:text-[1.75rem]">
              "Every child deserves a school experience that sees their potential clearly and guides it patiently. That is the heart of our work at KBS."
            </blockquote>
            <p className="font-body text-base leading-8 text-text-secondary">
              Our leadership team works closely with staff and families to ensure that pupils are supported academically, emotionally, and socially through every phase of their learning journey.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section className="bg-bg-light py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
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
                <IllustrationPlaceholder className="min-h-[180px] bg-white" label="Staff photo placeholder" />
                <div className="space-y-1">
                  <h3 className="font-body text-lg font-semibold text-text-primary">{member.name}</h3>
                  <p className="font-body text-sm text-text-secondary">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="py-16 sm:py-20" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <SectionHeader
            align="center"
            className="mx-auto mb-10"
            heading="Affiliations & Standards"
            overline="Trust Signals"
            subtext="Our academic and operational approach is shaped by recognised standards, parent trust, and continuous improvement."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {affiliations.map((item) => (
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
