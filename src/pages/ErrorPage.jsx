// Route-level error boundary UI — shown when lazy chunks fail to load or a
// route component throws. Replaces React Router's default error screen.

import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Link, useRouteError } from 'react-router-dom'
import Button from '../components/ui/Button'
import { fadeUpMotion } from '../lib/motion'

function ErrorPage() {
  const error = useRouteError()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-6 py-16">
      <motion.div className="max-w-lg space-y-6 text-center" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl text-text-primary">Something went wrong</h1>
        <p className="font-body text-text-secondary">
          {import.meta.env.DEV && error instanceof Error ? (
            <span className="block break-words font-mono text-sm text-error">{error.message}</span>
          ) : (
            'We could not load this page. This is usually temporary — try refreshing, or head back to the homepage.'
          )}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => window.location.reload()} size="lg" variant="primary">
            Refresh Page
          </Button>
          <Button as="link" size="lg" to="/" variant="secondary">
            Back to Homepage
          </Button>
        </div>
        <p className="font-body text-xs text-text-secondary/70">
          If the problem persists, please contact{' '}
          <Link className="text-brand-primary underline" to="/contact">
            the school office
          </Link>
          .
        </p>
      </motion.div>
    </div>
  )
}

export default ErrorPage
