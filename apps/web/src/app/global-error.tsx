'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to error monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-4xl tracking-tight">Something went wrong</h1>
          <p className="mt-4 max-w-md text-sm text-gray-500">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 rounded border border-black/20 px-5 py-2.5 text-sm font-medium transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
