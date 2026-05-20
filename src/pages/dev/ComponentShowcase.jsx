// Dev-only component library showcase page.

import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Modal from '../../components/ui/Modal'
import NewsCard from '../../components/ui/NewsCard'
import ResourceItem from '../../components/ui/ResourceItem'
import SectionHeader from '../../components/ui/SectionHeader'
import Textarea from '../../components/ui/Textarea'
import WaveDivider from '../../components/ui/WaveDivider'

function ShowcaseBlock({ children, title }) {
  return (
    <section className="space-y-6 rounded-3xl border border-surface-grey bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-3xl text-kbs-navy">{title}</h2>
      {children}
    </section>
  )
}

function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const illustrationPlaceholder = (
    <div className="mx-auto flex h-40 w-full max-w-xs items-center justify-center rounded-3xl border-2 border-dashed border-kbs-lavender bg-surface-grey px-6 text-center font-body text-sm text-text-medium">
      Illustration placeholder
    </div>
  )

  return (
    <main className="min-h-screen bg-surface-white px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <SectionHeader
          align="left"
          heading="KBS Component Showcase"
          overline="Design system review"
          subtext="Development-only page for reviewing the KBS Nigeria UI foundation against the approved design system."
        />

        <ShowcaseBlock title="Buttons">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Default</Button>
            <Button size="lg">Large</Button>
            <Button as="link" to="/news/sample-story" variant="secondary">
              Router Link
            </Button>
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Cards and Badges">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="space-y-3">
                <Badge variant="cyan">Term Dates</Badge>
                <h3 className="font-display text-2xl text-kbs-navy">Standard Card</h3>
                <p className="font-body text-base leading-7 text-text-medium">
                  Cards use the approved KBS border, radius, shadow, spacing, and hover lift treatment.
                </p>
              </div>
            </Card>
            <div className="flex flex-wrap items-start gap-3">
              <Badge variant="cyan">Term Dates</Badge>
              <Badge variant="purple">Circulars</Badge>
              <Badge variant="navy">Forms &amp; Documents</Badge>
            </div>
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Form Fields">
          <div className="grid gap-6 md:grid-cols-2">
            <Input helpText="We will only use this for school updates." label="Parent Email" required />
            <Input error="Please enter a valid phone number." label="Phone Number" />
            <div className="md:col-span-2">
              <Textarea
                helpText="Tell us about your child and the class level you are interested in."
                label="Message"
                required
              />
            </div>
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Modal">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          </div>
          <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} title="Admissions Enquiry">
            <div className="space-y-4">
              <p className="font-body leading-7 text-text-medium">
                This modal demonstrates the approved fade and scale entrance, focus trapping, escape close, and backdrop dismiss behaviour.
              </p>
              <Input label="Parent Name" />
              <Textarea label="Enquiry" rows={4} />
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsModalOpen(false)} variant="ghost">
                  Cancel
                </Button>
                <Button variant="primary">Submit</Button>
              </div>
            </div>
          </Modal>
        </ShowcaseBlock>

        <ShowcaseBlock title="Content Components">
          <div className="grid gap-6 lg:grid-cols-2">
            <NewsCard
              category="Announcement"
              coverImage="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
              date="May 20, 2026"
              excerpt="Parents are invited to the end-of-term exhibition where pupils will present science, reading, and art projects."
              slug="end-of-term-exhibition"
              title="End-of-Term Exhibition Holds Next Friday"
            />
            <div className="space-y-4">
              <ResourceItem
                category="Term Dates"
                date="Updated May 18, 2026"
                downloadUrl="#"
                fileType="pdf"
                title="2026 Third Term Academic Calendar"
              />
              <ResourceItem
                category="Circulars"
                date="Updated May 10, 2026"
                downloadUrl="#"
                fileType="docx"
                title="Mid-Term Break Parent Circular"
              />
              <ResourceItem
                category="Forms & Documents"
                date="Updated May 02, 2026"
                downloadUrl="#"
                fileType="xlsx"
                title="Transport Registration Form"
              />
            </div>
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Headers, Waves, Loading, Empty State">
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <SectionHeader
                align="center"
                heading="Centred Section Header"
                overline="Nurturing great minds"
                subtext="Amiri overline, Reem Kufi heading, and Inter body copy working together as specified."
              />
              <SectionHeader
                align="left"
                heading="Left-Aligned Header"
                overline="Admissions open"
                subtext="Use this alignment for editorial and utility sections where content should anchor to the grid."
              />
            </div>
            <div className="space-y-4">
              <WaveDivider color="grey" />
              <WaveDivider className="text-kbs-cyan" flipX />
            </div>
            <div className="flex items-center gap-4 text-kbs-cyan">
              <LoadingSpinner />
              <span className="font-body text-text-medium">Loading spinner preview</span>
            </div>
            <EmptyState
              action={{ label: 'Upload Resource', variant: 'primary', onClick: () => {} }}
              description="No resources have been added yet. Upload term dates, circulars, or forms to populate this section."
              illustration={illustrationPlaceholder}
              title="No resources uploaded yet"
            />
          </div>
        </ShowcaseBlock>
      </div>
    </main>
  )
}

export default ComponentShowcase
