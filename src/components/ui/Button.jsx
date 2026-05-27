// Button component with KBS variants, sizes, and Framer Motion micro-interactions.

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'
import { cn } from '../../lib/cn'

const MotionLink   = motion(Link)
const MotionAnchor = motion.a
const MotionButton = motion.button

const variantClasses = {
  primary:
    'relative overflow-hidden bg-brand-primary text-white shadow-lg hover:shadow-xl hover:bg-brand-secondary focus-visible:ring-brand-accent/20',
  secondary:
    'border-2 border-brand-primary text-brand-primary hover:bg-brand-secondary hover:text-white focus-visible:ring-brand-accent/20',
  ghost:
    'text-text-primary underline underline-offset-4 hover:text-brand-purple focus-visible:ring-brand-purple/20',
  danger:
    'bg-error text-white shadow-lg hover:shadow-xl hover:bg-error/90 focus-visible:ring-error/20',
}

const sizeClasses = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-11 px-6 py-3 text-base',
  lg: 'min-h-11 px-8 py-4 text-lg',
}

// Shine sweep shown on primary buttons during hover
const shineVariants = {
  rest:  { x: '-100%' },
  hover: { x: '200%', transition: { duration: 0.45, ease: 'easeInOut' } },
}

const buttonVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 17 } },
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
  const prefersReduced = useReducedMotion()
  const isDisabled = disabled || loading

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  const motionProps = prefersReduced
    ? {}
    : {
        variants: buttonVariants,
        initial: 'rest',
        whileHover: 'hover',
        whileTap: { scale: 0.96, transition: { type: 'spring', stiffness: 400, damping: 17 } },
      }

  const shine = variant === 'primary' && !prefersReduced ? (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
      variants={shineVariants}
    />
  ) : null

  const content = (
    <>
      {shine}
      {loading ? <LoadingSpinner className="h-4 w-4" label="Button loading" /> : null}
      <span>{children}</span>
    </>
  )

  if (as === 'link') {
    return (
      <MotionLink
        {...motionProps}
        aria-disabled={isDisabled}
        className={classes}
        onClick={isDisabled ? undefined : onClick}
        ref={ref}
        tabIndex={isDisabled ? -1 : undefined}
        to={isDisabled ? '#' : to}
        {...props}
      >
        {content}
      </MotionLink>
    )
  }

  if (as === 'a') {
    return (
      <MotionAnchor
        {...motionProps}
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
      </MotionAnchor>
    )
  }

  return (
    <MotionButton
      {...motionProps}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      ref={ref}
      type={type}
      {...props}
    >
      {content}
    </MotionButton>
  )
})

export default Button
