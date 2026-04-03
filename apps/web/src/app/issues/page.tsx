import type { Metadata } from 'next'
import Link from 'next/link'
import { IssueCard } from '@/components/IssueCard'
import { currentIssue, issues, upcomingIssues } from '@/lib/issues'

export const metadata: Metadata = {
  title: 'Issues',
  description: 'Current and upcoming issue themes from the Pulse Magazine editorial desk.',
}

export default function IssuesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="grid gap-8 border-b border-black/10 pb-10 sm:gap-10 sm:pb-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Issues</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[2.9rem] leading-none text-ink sm:text-6xl">
            The magazine is organized in seasonal briefs, not endless buckets.
          </h1>
        </div>
        <div className="space-y-5 text-sm leading-7 text-gray-600">
          <p>
            Each Pulse issue is a temporary editorial desk: a theme, a reading packet,
            and a submission window. The buttons below are placeholders until the briefs publish.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/submit"
              className="w-full rounded-full bg-ink px-5 py-2 text-center text-sm font-medium text-paper transition-all hover:-translate-y-px hover:bg-accent sm:w-auto"
            >
              Submit to the desk
            </Link>
            <a
              href="mailto:submissions@pulsemagazine.com"
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2 text-center text-sm font-medium text-ink transition-all hover:-translate-y-px hover:border-accent hover:text-accent sm:w-auto"
            >
              Ask an editor
            </a>
          </div>
        </div>
      </header>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {currentIssue && <IssueCard issue={currentIssue} />}

        <div className="rounded-[1.75rem] border border-black/10 bg-[#f2eadf] p-6 sm:rounded-[2rem] sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Desk note</p>
          <h2 className="mt-4 font-serif text-[2.25rem] leading-none text-ink sm:text-4xl">
            What happens next
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
            <p>
              We post issue briefs first, then open the reading window. Until those packets are live,
              the read buttons stay dormant by design.
            </p>
            <p>
              If you already have a piece that fits the current theme, send a concise pitch, a short bio,
              and links to any previous work. We would rather read a clear note than a generic packet.
            </p>
          </div>

          {upcomingIssues.length > 0 && (
            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Coming soon</p>
              <ul className="mt-4 space-y-4">
                {upcomingIssues.map((issue) => (
                  <li key={issue.id}>
                    <p className="font-serif text-2xl text-ink">{issue.title}</p>
                    <p className="text-sm text-gray-500">{issue.window}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} compact />
        ))}
      </section>
    </div>
  )
}
