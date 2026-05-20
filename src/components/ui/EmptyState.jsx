// Empty state component for no-content screens.

import Button from './Button'

function EmptyState({ action, description, illustration, title }) {
  const actionLabel = action?.label
  const actionProps = action ? { ...action } : null

  if (actionProps) {
    delete actionProps.label
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-kbs-lavender bg-white px-6 py-12 text-center">
      {illustration ? <div className="max-w-xs text-kbs-lavender">{illustration}</div> : null}
      <div className="space-y-2">
        <h3 className="font-display text-h3 text-kbs-navy">{title}</h3>
        {description ? <p className="font-body text-text-medium">{description}</p> : null}
      </div>
      {actionProps ? <Button variant="secondary" {...actionProps}>{actionLabel}</Button> : null}
    </div>
  )
}

export default EmptyState
