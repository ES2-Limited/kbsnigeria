// Newsletter unsubscribe page placeholder.

import Button from '../components/ui/Button'
import PageSeo from '../components/seo/PageSeo'
import SectionHeader from '../components/ui/SectionHeader'

function Unsubscribe() {
  return (
    <div className="bg-surface-white px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
      <PageSeo
        canonicalPath="/unsubscribe"
        description="Manage your KBS Nigeria newsletter subscription preferences."
        title="Unsubscribe | KBS Nigeria"
      />

      <div className="mx-auto max-w-3xl rounded-3xl border border-surface-grey bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <SectionHeader
          align="center"
          className="mx-auto"
          heading="Newsletter Preferences"
          overline="Subscription"
          subtext="If you followed an unsubscribe link, your request is being processed through the newsletter workflow. If you need help, contact the school directly."
        />
        <div className="mt-8 flex justify-center">
          <Button as="link" to="/contact" variant="secondary">
            Contact the School
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Unsubscribe
