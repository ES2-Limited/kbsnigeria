// Reusable skeleton blocks for loading states.

import { cn } from '../../lib/cn'

export function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-xl bg-gradient-to-r from-brand-gray/25 via-brand-gray/40 to-brand-gray/25', className)}
    />
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-gray/20 bg-white shadow-sm">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-4 sm:p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-11/12" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

export function NewsGridSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function GalleryGridSkeleton({ count = 6 }) {
  return (
    <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          className={cn('mb-3 w-full break-inside-avoid sm:mb-4', index % 3 === 0 ? 'h-72' : index % 2 === 0 ? 'h-52' : 'h-64')}
          key={index}
        />
      ))}
    </div>
  )
}

export function ResourceListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-gray/20 bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={index}>
          <div className="flex flex-1 items-start gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-11 w-full sm:w-28" />
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-brand-gray/20 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-10 w-16" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div aria-busy="true" aria-live="polite" className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6 lg:px-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  )
}
