'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('You\'re subscribed! Welcome to The Pulse Beat.')
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="rounded-xl border border-black/10 bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-paper-soft)] p-8">
      <div className="mx-auto max-w-md text-center">
        <h3 className="font-display text-2xl tracking-tight text-ink">The Pulse Beat</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Monthly updates on new issues, featured writers, submission opportunities, and behind-the-scenes from the Pulse team.
        </p>

        {status === 'success' ? (
          <div className="mt-6 rounded-lg bg-[var(--color-nav)]/10 p-4">
            <p className="text-sm font-medium text-[var(--color-nav)]">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded border border-black/20 bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:border-[var(--color-nav)] focus:outline-none focus:ring-1 focus:ring-[var(--color-nav)]"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded bg-[var(--color-nav)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-nav)]/90 disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-xs text-[var(--color-accent)]">{message}</p>
        )}

        <p className="mt-4 text-[0.65rem] text-gray-400">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  )
}
