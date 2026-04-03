import type { IssueEntry } from '@/lib/issues'

type IssueCardProps = {
  issue: IssueEntry
  compact?: boolean
}

export function IssueCard({ issue, compact = false }: IssueCardProps) {
  return (
    <article className={`overflow-hidden rounded-xl border border-black/10 bg-white/70 shadow-sm ${compact ? '' : 'shadow-[0_8px_28px_-10px_rgba(158,114,114,0.18)]'}`}>
      {/* Status band */}
      <div
        className="flex items-center justify-between px-5 py-2.5 text-white"
        style={{ backgroundColor: 'var(--color-nav)' }}
      >
        <span className="text-[0.55rem] uppercase tracking-[0.28em] text-white/80">
          {issue.status}
        </span>
        <span className="font-serif text-lg font-bold text-white/25">{issue.season}</span>
      </div>

      <div className={compact ? 'px-5 py-5' : 'px-6 py-7'}>
        <h2
          className={`font-serif leading-tight text-ink ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}
        >
          {issue.title}
        </h2>

        <p className={`mt-3 leading-7 text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
          {issue.summary}
        </p>

        <div className="mt-5 grid gap-3 border-t border-black/8 pt-4 text-xs sm:grid-cols-2">
          <div>
            <p className="text-[0.55rem] uppercase tracking-widest text-gray-400">Window</p>
            <p className="mt-1 text-gray-700">{issue.window}</p>
          </div>
          <div>
            <p className="text-[0.55rem] uppercase tracking-widest text-gray-400">Status</p>
            <p className="mt-1 text-gray-700">{issue.note}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
