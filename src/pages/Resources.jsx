// Resources page implementation following PRD US-06.

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import EmptyState from '../components/ui/EmptyState'
import IllustrationPlaceholder from '../components/ui/IllustrationPlaceholder'
import PageSeo from '../components/seo/PageSeo'
import ResourceItem from '../components/ui/ResourceItem'
import SectionHeader from '../components/ui/SectionHeader'
import WaveDivider from '../components/ui/WaveDivider'
import { useResources } from '../hooks/useResources'
import { cn } from '../lib/cn'
import { fadeUpMotion } from '../lib/motion'

const filters = ['All', 'Term Dates', 'Circulars', 'Forms & Documents']

function formatDate(value) {
  if (!value) {
    return 'Coming soon'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function getFileType(fileName) {
  return fileName?.split('.').pop()?.toLowerCase() ?? ''
}

function Resources() {
  const prefersReducedMotion = useReducedMotion()
  const { resources, loading, error } = useResources()
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredResources = useMemo(() => {
    return activeFilter === 'All'
      ? resources
      : resources.filter((item) => item.category === activeFilter)
  }, [activeFilter, resources])

  return (
    <div className="bg-surface-white">
      <PageSeo
        canonicalPath="/resources"
        description="Download term dates, school circulars, and official forms from Knowledgebased Basic Science Schools."
        title="Resources | KBS Nigeria"
      />

      <section className="overflow-hidden bg-[var(--gradient-hero)] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 lg:px-10 lg:pt-24">
          <motion.div className="max-w-3xl space-y-5" {...fadeUpMotion(prefersReducedMotion)}>
            <p className="font-calligraphy text-xl italic text-kbs-lavender">Resources</p>
            <h1 className="font-display text-5xl leading-[1.15] text-white sm:text-[3.25rem] lg:text-[3.5rem]">
              Important Downloads for Parents
            </h1>
            <p className="font-body text-lg leading-8 text-white/85">
              Find term dates, school circulars, and official forms in one organised place.
            </p>
          </motion.div>
        </div>
        <WaveDivider color="white" />
      </section>

      <motion.section className="py-20 sm:py-24" {...fadeUpMotion(prefersReducedMotion)}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                className={cn(
                  'min-h-11 rounded-full px-5 py-3 font-body text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20',
                  activeFilter === filter ? 'bg-kbs-cyan text-white' : 'bg-surface-grey text-text-medium hover:text-kbs-navy',
                )}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div className="h-32 animate-pulse rounded-2xl bg-surface-grey" key={item} />
              ))}
            </div>
          ) : null}

          {!loading && error ? <p className="font-body text-sm text-error">Unable to load resources right now.</p> : null}

          {!loading && !error && filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((item) => (
                <ResourceItem
                  category={item.category}
                  date={formatDate(item.uploaded_at)}
                  downloadUrl={item.file_url}
                  fileType={getFileType(item.file_name)}
                  key={item.id}
                  title={item.title}
                />
              ))}
            </div>
          ) : null}

          {!loading && !error && filteredResources.length === 0 ? (
            <EmptyState
              description={`No resources found for ${activeFilter.toLowerCase()}. Uploaded files in this category will appear here.`}
              illustration={<IllustrationPlaceholder className="min-h-[180px] bg-surface-grey" label="Resources placeholder" />}
              title={`No ${activeFilter === 'All' ? 'resources' : activeFilter.toLowerCase()} available yet`}
            />
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}

export default Resources
