'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h2 className="font-display text-2xl text-ink">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-500">
        We could not load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded border border-black/20 px-4 py-2 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
      >
        Try again
      </button>
    </div>
  )
}
