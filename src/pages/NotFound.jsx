// 404 page for unknown routes.

import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import { fadeUpMotion } from '../lib/motion'

function NotFound() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="bg-bg-light px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
      <PageSeo
        canonicalPath="/404"
        description="The page you are looking for could not be found on the KBS Nigeria website."
        title="Page Not Found | KBS Nigeria"
      />

      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
        {...fadeUpMotion(prefersReducedMotion)}
      >
        <IllustrationPlaceholder className="min-h-[200px] w-full max-w-sm bg-white" label="404 illustration placeholder" />
        <SectionHeader
          align="center"
          className="mx-auto"
          heading="This Page Could Not Be Found"
          overline="404"
          subtext="The link may be outdated or the page may have moved. Head back home or contact the school if you need help."
        />
        <div className="flex flex-wrap justify-center gap-4">
          <Button as="link" size="lg" to="/" variant="primary">
            Back to Home
          </Button>
          <Button as="link" size="lg" to="/contact" variant="secondary">
            Contact Us
          </Button>
        </div>
        <p className="font-body text-sm text-text-secondary">
          Looking for admissions?{' '}
          <Link className="text-brand-primary underline hover:text-brand-accent" to="/admissions">
            Visit our admissions page
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default NotFound
