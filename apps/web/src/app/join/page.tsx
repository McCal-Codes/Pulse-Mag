'use client'

import { useState } from 'react'
import { positions } from '@/lib/positions'
import { DiamondDivider } from '@/components/DiamondDivider'

// Replace with your actual Google Form or mailto when ready
const APPLICATION_ACTION = 'mailto:hello@pulsemag.com'

export default function JoinPage() {
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Basic mailto fallback — swap for Google Form or API route as needed
    const form = e.currentTarget
    const data = new FormData(form)
    const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
    window.location.href = `mailto:hello@pulsemag.com?subject=Staff Application — ${data.get('position') ?? 'Pulse Magazine'}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Join Our Team</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {/* Intro */}
      <div className="mb-12 rounded border border-black/10 bg-white/60 p-6 sm:p-8">
        <p className="text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          We&rsquo;re looking to grow our team of creatives! These volunteer positions can provide a
          creative outlet for yourself, skills &amp; experience in the world of lit mag publishing, and
          connections with some talented creators. Our available role descriptions &amp; requirements
          are listed below. To apply, fill out the application form at the bottom of this page.
        </p>
      </div>

      <hr className="mb-10 border-black/10" />

      {/* Open Positions */}
      <section>
        <h2 className="mb-8 text-center font-serif text-2xl tracking-tight text-ink sm:text-3xl">
          Open Positions
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {positions.map((position) => (
            <article key={position.id} className="flex flex-col">
              {/* Amber placeholder with initial */}
              <div
                className="flex aspect-square items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--color-amber)' }}
              >
                <span className="font-serif text-4xl font-bold text-white/90">
                  {position.title.charAt(0)}
                </span>
              </div>
              {/* Title */}
              <h3 className="mt-3 font-serif text-lg text-ink">{position.title}</h3>
              {/* Description box */}
              <div className="mt-2 flex-1 rounded border border-black/10 p-4">
                <p className="text-xs leading-6 text-gray-600">{position.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="my-12 border-black/10" />

      {/* Staff Application Form */}
      <section>
        <h2 className="mb-8 text-center font-serif text-2xl tracking-tight text-ink sm:text-3xl">
          Staff Application
        </h2>

        {submitted ? (
          <div className="rounded border border-black/10 bg-white/60 p-8 text-center">
            <p className="font-serif text-xl text-ink">Thank you for applying!</p>
            <p className="mt-2 text-sm text-gray-500">
              Your application has been sent. We&rsquo;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg rounded border border-black/10 bg-white/70 p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                />
              </div>
              <div>
                <label htmlFor="position" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Select Position
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                >
                  <option value="">Choose an option</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="mb-1.5 block text-xs font-medium text-gray-700">
                  Year
                </label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  placeholder="e.g. Sophomore"
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="whyJoin" className="mb-1.5 block text-xs font-medium text-gray-700">
                Why Do You Want To Join Pulse? <span className="text-gray-400">(Short Answer)</span>
              </label>
              <textarea
                id="whyJoin"
                name="whyJoin"
                rows={4}
                required
                className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[var(--color-nav)] focus:ring-1 focus:ring-[var(--color-nav)]"
              />
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="rounded-full px-8 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-nav)' }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
