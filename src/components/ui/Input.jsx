// Text input component with label and validation states.

import { forwardRef, useId } from 'react'
import { cn } from '../../lib/cn'

const inputBaseClass =
  'w-full rounded-xl border px-4 py-3 font-body text-text-dark transition-all duration-200 outline-none placeholder:text-text-medium/60 focus:border-kbs-cyan focus:ring-2 focus:ring-kbs-cyan/20'

function FieldMeta({ error, helpText, id }) {
  if (!error && !helpText) {
    return null
  }

  return (
    <p className={cn('mt-2 text-sm font-body', error ? 'text-error' : 'text-text-medium')} id={id}>
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
        <label className={cn('mb-2 block font-body text-sm font-medium text-text-dark', labelClassName)} htmlFor={fieldId}>
          {label}
          {required ? <span className="ml-1 text-error">*</span> : null}
        </label>
      ) : null}
      <input
        aria-describedby={error || helpText ? helpId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          inputBaseClass,
          error
            ? 'border-error ring-2 ring-error/20 focus:border-error focus:ring-error/20'
            : 'border-kbs-lavender',
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
