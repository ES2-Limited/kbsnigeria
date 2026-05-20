// Button component with KBS variants and sizes.

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import { cn } from '../../lib/cn'

const variantClasses = {
  primary:
    'bg-kbs-cyan text-white shadow-md hover:bg-kbs-cyan/90 focus-visible:ring-kbs-cyan/20',
  secondary:
    'border-2 border-kbs-cyan text-kbs-cyan hover:bg-kbs-cyan hover:text-white focus-visible:ring-kbs-cyan/20',
  ghost:
    'text-kbs-navy underline underline-offset-4 hover:text-kbs-purple focus-visible:ring-kbs-purple/20',
  danger:
    'bg-error text-white hover:bg-error/90 focus-visible:ring-error/20',
}

const sizeClasses = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-11 px-6 py-3 text-base',
  lg: 'min-h-11 px-8 py-4 text-lg',
}

const Button = forwardRef(function Button(
  {
    as,
    children,
    className,
    disabled = false,
    loading = false,
    onClick,
    size = 'md',
    to,
    href,
    target,
    rel,
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  const content = (
    <>
      {loading ? <LoadingSpinner className="h-4 w-4" label="Button loading" /> : null}
      <span>{children}</span>
    </>
  )

  if (as === 'link') {
    return (
      <Link
        aria-disabled={isDisabled}
        className={classes}
        onClick={isDisabled ? undefined : onClick}
        ref={ref}
        tabIndex={isDisabled ? -1 : undefined}
        to={isDisabled ? '#' : to}
        {...props}
      >
        {content}
      </Link>
    )
  }

  if (as === 'a') {
    return (
      <a
        aria-disabled={isDisabled}
        className={classes}
        href={isDisabled ? undefined : href}
        onClick={isDisabled ? undefined : onClick}
        ref={ref}
        rel={rel}
        tabIndex={isDisabled ? -1 : undefined}
        target={target}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      ref={ref}
      type={type}
      {...props}
    >
      {content}
    </button>
  )
})

export default Button
