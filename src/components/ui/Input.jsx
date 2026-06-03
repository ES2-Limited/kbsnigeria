// Text input component with label and validation states.

import { forwardRef, useId } from 'react'
import { cn } from '../../lib/cn'

const inputBaseClass =
  'w-full rounded-xl border px-4 py-3 font-body text-text-primary transition-all duration-200 outline-none placeholder:text-text-secondary/60 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20'

function FieldMeta({ error, helpText, id }) {
  if (!error && !helpText) {
    return null
  }

  return (
    <p className={cn('mt-2 text-sm font-body', error ? 'text-error' : 'text-text-secondary')} id={id}>
      {error || helpText}
    </p>
  )
}

const Input = forwardRef(function Input(
  { className, error, helpText, id, label, labelClassName, required = false, type = 'text', ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const helpId = `${fieldId}-help`

  return (
    <div className="w-full">
      {label ? (
        <label className={cn('mb-2 block font-body text-sm font-semibold text-text-primary', labelClassName)} htmlFor={fieldId}>
          {label}
          {required ? <span className="ml-1 text-red-400">*</span> : null}
        </label>
      ) : null}
      <input
        aria-describedby={error || helpText ? helpId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          inputBaseClass,
          error
            ? 'border-red-400 ring-2 ring-red-400/20 focus:border-red-400 focus:ring-red-400/20'
            : 'border-brand-gray/30',
          className,
        )}
        id={fieldId}
        ref={ref}
        required={required}
        type={type}
        {...props}
      />
      <FieldMeta error={error} helpText={helpText} id={helpId} />
    </div>
  )
})

export default Input
