// Empty state component for no-content screens.

import Button from './Button'
import SectionHeader from './SectionHeader'

function EmptyState({ action, description, illustration, title }) {
  const actionLabel = action?.label
  const actionProps = action ? { ...action } : null

  if (actionProps) {
    delete actionProps.label
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-kbs-lavender bg-white px-6 py-12 text-center">
      {illustration ? <div className="max-w-xs text-kbs-lavender">{illustration}</div> : null}
      <SectionHeader align="center" heading={title} subtext={description} />
      {actionProps ? <Button {...actionProps}>{actionLabel}</Button> : null}
    </div>
  )
}

export default EmptyState
