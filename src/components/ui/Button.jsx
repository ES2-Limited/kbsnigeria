// Button component — mobile-first CTAs with clear loading states.

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import { cn } from '../../lib/cn'

const variantClasses = {
  primary:
    'bg-brand-accent text-white shadow-md hover:bg-brand-accent/90 hover:shadow-lg active:scale-[0.98] disabled:hover:bg-brand-accent',
  secondary:
    'border-2 border-brand-accent bg-white text-brand-primary hover:bg-brand-accent/10 active:scale-[0.98]',
  ghost:
    'bg-transparent text-brand-primary hover:bg-brand-accent/10 active:scale-[0.98]',
  danger:
    'bg-error text-white shadow-md hover:bg-error/90 active:scale-[0.98]',
}

const sizeClasses = {
  sm: 'min-h-11 gap-2 px-4 py-2.5 text-sm',
  md: 'min-h-11 gap-2 px-5 py-3 text-sm sm:px-6 sm:text-base',
  lg: 'min-h-12 gap-2.5 px-6 py-3.5 text-base sm:px-8 sm:text-lg',
}

const Button = forwardRef(function Button(
  {
    as,
    children,
    className,
    disabled = false,
    fullWidth = false,
    loading = false,
    loadingText,
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
    'inline-flex items-center justify-center rounded-xl font-body font-semibold transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    'disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none disabled:active:scale-100',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {loading ? <LoadingSpinner className="h-4 w-4 shrink-0" label="Loading" /> : null}
      <span className={cn(loading && !loadingText && 'opacity-80')}>
        {loading && loadingText ? loadingText : children}
      </span>
    </>
  )

  if (as === 'link') {
    return (
      <Link
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={classes}
        onClick={isDisabled ? (event) => event.preventDefault() : onClick}
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
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={classes}
        href={isDisabled ? undefined : href}
        onClick={isDisabled ? (event) => event.preventDefault() : onClick}
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
      aria-busy={loading}
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
