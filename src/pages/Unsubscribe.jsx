// Newsletter unsubscribe — processes token from email links.

import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'
import { useNewsletterUnsubscribe } from '../hooks/useNewsletterUnsubscribe'

function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { unsubscribe, loading, error, success } = useNewsletterUnsubscribe()
  const attemptedRef = useRef(false)

  useEffect(() => {
    if (!token || attemptedRef.current) {
      return
    }

    attemptedRef.current = true
    unsubscribe(token)
  }, [token, unsubscribe])

  const isMissingToken = !token

  return (
    <div className="bg-bg-light px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
      <PageSeo
        canonicalPath="/unsubscribe"
        description="Manage your KBS Nigeria newsletter subscription preferences."
        title="Unsubscribe | KBS Nigeria"
      />

      <div className="mx-auto max-w-3xl rounded-3xl border border-brand-gray/30 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <SectionHeader
          align="center"
          className="mx-auto"
          heading={success ? 'You Are Unsubscribed' : 'Newsletter Preferences'}
          overline="Subscription"
          subtext={
            success
              ? 'You will no longer receive school newsletter emails from KBS Nigeria. You can always subscribe again from our website.'
              : 'We are processing your unsubscribe request from the link in your email.'
          }
        />

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : null}

          {isMissingToken && !loading ? (
            <p className="font-body text-sm text-text-secondary">
              This link is missing a valid token. If you need help, please contact the school directly.
            </p>
          ) : null}

          {error ? <p className="font-body text-sm text-error">{error}</p> : null}
          {success ? <p className="font-body text-sm text-success">{success}</p> : null}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button as="link" to="/" variant="secondary">
            Back to Home
          </Button>
          <Button as="link" to="/contact" variant="primary">
            Contact the School
          </Button>
        </div>

        {!success ? (
          <p className="mt-6 font-body text-xs text-text-secondary">
            Changed your mind?{' '}
            <Link className="text-brand-primary underline hover:text-brand-accent" to="/contact">
              Resubscribe on our contact page
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default Unsubscribe
