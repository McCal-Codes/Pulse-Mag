import type { Metadata } from 'next'
import Link from 'next/link'
import { Flipbook } from '@/components/Flipbook'
import { DiamondDivider } from '@/components/DiamondDivider'
import { sanityClient, safeSanityFetch } from '@/lib/sanity.client'
import { currentIssueQuery, upcomingIssuesQuery } from '@/lib/queries'
import type { Issue } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Issues',
  description: 'Current and upcoming issue themes from Pulse Literary & Arts Magazine.',
}

export default async function IssuesPage() {
  // Fetch from Sanity with fallback to empty data
  const currentIssue = await safeSanityFetch<Issue | null>(
    sanityClient,
    currentIssueQuery,
    {},
    null
  )

  const upcomingIssues = await safeSanityFetch<Issue[]>(
    sanityClient,
    upcomingIssuesQuery,
    {},
    []
  )
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Issues</h1>
        <DiamondDivider className="mt-3" />
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600">
          Each Pulse issue is built around a seasonal theme — a reading window, an editorial brief,
          and a submission desk. We organize around ideas, not endless categories.
        </p>
      </div>

      {/* Current issue */}
      {currentIssue && (
        <section className="mb-10">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70 shadow-[0_8px_32px_-12px_rgba(158,114,114,0.2)]">
            {/* Issue number band */}
            <div
              className="flex items-center justify-between px-6 py-3 text-white"
              style={{ backgroundColor: 'var(--color-nav)' }}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.28em] text-white/80">
                Current issue
              </span>
              <span className="font-display text-2xl font-bold text-white/30">
                {String(currentIssue.issueNumber ?? 1).padStart(2, '0')}
              </span>
            </div>

            <div className="px-7 py-8">
              <p className="text-[0.65rem] uppercase tracking-widest text-gray-400">
                {currentIssue.season}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
                {currentIssue.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-600">{currentIssue.summary}</p>

              <div className="mt-6 grid gap-4 border-t border-black/8 pt-5 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-gray-400">Window</p>
                  <p className="mt-1 text-gray-700">{currentIssue.windowText}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-gray-400">Status</p>
                  <p className="mt-1 text-gray-700">{currentIssue.statusNote}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/submit"
                  className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-nav)' }}
                >
                  Submit to the Desk
                </Link>
                <a
                  href="mailto:submissions@pulsemag.com"
                  className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
                >
                  Ask an Editor
                </a>
                {currentIssue.pdfUrl && (
                  <Flipbook 
                    pdfUrl={currentIssue.pdfUrl} 
                    issueTitle={currentIssue.title}
                    issueId={currentIssue._id}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coming soon */}
      {upcomingIssues.length > 0 && (
        <section>
          <p className="mb-5 text-[0.6rem] uppercase tracking-[0.28em] text-gray-400">Coming Soon</p>
          <div className="space-y-4">
            {upcomingIssues.map((issue, i) => (
              <div
                key={issue._id}
                className="rounded-xl border border-black/10 bg-white/50 px-7 py-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-gray-400">
                      {issue.season}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl text-ink">{issue.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-gray-600">{issue.summary}</p>
                  </div>
                  <span className="shrink-0 font-display text-3xl font-bold text-black/10">
                    {String((issue.issueNumber ?? i + 2)).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-4 text-xs text-gray-400">{issue.windowText}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state - no issues configured */}
      {!currentIssue && upcomingIssues.length === 0 && (
        <section className="text-center py-12">
          <p className="text-gray-500">
            No issues configured yet. Create issues in the Sanity Studio to display them here.
          </p>
        </section>
      )}
    </div>
  )
}
