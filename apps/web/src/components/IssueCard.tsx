import type { IssueEntry } from '@/lib/issues'

type IssueCardProps = {
  issue: IssueEntry
  compact?: boolean
}

export function IssueCard({ issue, compact = false }: IssueCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(251,246,238,0.96)_100%)] shadow-[0_24px_60px_-28px_rgba(20,17,15,0.24)] sm:rounded-[2rem] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent sm:text-[11px] sm:tracking-[0.3em]">
            {issue.status}
          </p>
          <p className="mt-2 text-sm text-gray-500">{issue.season}</p>
        </div>
        <span className="rounded-full border border-black/10 bg-paper px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-gray-500">
          Issue Desk
        </span>
      </div>

      <h2
        className={`mt-6 font-serif leading-none tracking-[-0.04em] text-ink ${compact ? 'text-[2rem] sm:text-4xl' : 'text-[2.3rem] sm:text-5xl'}`}
      >
        {issue.title}
      </h2>

      <p className="mt-4 max-w-[48ch] text-sm leading-7 text-gray-600 sm:text-base">
        {issue.summary}
      </p>

      <div className="mt-6 grid gap-3 border-t border-black/10 pt-5 text-sm text-gray-600 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Window</p>
          <p className="mt-1 text-gray-700">{issue.window}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Status</p>
          <p className="mt-1 text-gray-700">{issue.note}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full border border-black/10 bg-paper px-5 py-2 text-sm font-medium text-gray-500 sm:w-auto"
        >
          Read Brief
        </button>
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full border border-black/10 bg-paper px-5 py-2 text-sm font-medium text-gray-500 sm:w-auto"
        >
          Read Notes
        </button>
      </div>
    </article>
  )
}
