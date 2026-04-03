import Link from 'next/link'
import { currentIssue } from '@/lib/issues'

export const metadata = {
  title: 'Submit Your Work — Pulse Magazine',
  description: 'Submission guidance for essays, criticism, fiction, photography, and artwork at Pulse Magazine.',
}

export default function SubmitPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="grid gap-10 border-b border-black/10 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Submit</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-ink sm:text-6xl">
            We want pitches with a point of view, not content dressed as momentum.
          </h1>
        </div>
        <div className="space-y-5 text-sm leading-7 text-gray-600">
          <p>
            Pulse reads essays, criticism, interviews, fiction, photography, and artwork.
            We prefer strong framing, patient reporting, and work that feels made for readers instead of feeds.
          </p>
          <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Current desk</p>
            <p className="mt-2 font-serif text-2xl text-ink">{currentIssue?.title ?? 'Issue desk'}</p>
            <p className="mt-2 text-sm text-gray-500">{currentIssue?.window ?? 'Reading window to be announced.'}</p>
          </div>
        </div>
      </header>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/10 bg-[#f2eadf] p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">What to send</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
            <li>A short pitch or artist note with the angle, stakes, and intended form.</li>
            <li>Estimated word count or image count, plus any reporting or production timeline.</li>
            <li>A brief bio and links to previous work when relevant.</li>
            <li>For completed pieces, include the full draft only if the issue brief explicitly asks for it.</li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.24)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">How it works</p>
          <ol className="mt-5 space-y-5 text-sm leading-7 text-gray-600">
            <li>Read the current issue lineup to understand what the desk is commissioning right now.</li>
            <li>Send a concise note to the editorial team with your idea, intended format, and timeline.</li>
            <li>If the piece fits, we will reply with next steps, edit expectations, and delivery details.</li>
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/issues"
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:bg-accent"
            >
              Browse issues
            </Link>
            <a
              href="mailto:submissions@pulsemagazine.com?subject=Pulse%20Magazine%20Pitch"
              className="rounded-full border border-black/10 bg-paper px-5 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-px hover:border-accent hover:text-accent"
            >
              Email the desk
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Questions can go to{' '}
            <a href="mailto:submissions@pulsemagazine.com" className="text-accent hover:underline">
              submissions@pulsemagazine.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
