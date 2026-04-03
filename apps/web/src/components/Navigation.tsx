import Link from 'next/link'
import { currentIssue } from '@/lib/issues'

const navLinks = [
  { label: 'Issues', href: '/issues' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/about/team' },
]

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/84 backdrop-blur-md">
      <div className="border-b border-black/6">
        <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-gray-500 sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.3em] lg:px-8">
          <span className="min-w-0 truncate">
            {currentIssue?.status ?? 'Issue desk'}: {currentIssue?.title ?? 'Pulse Magazine'}
          </span>
          <Link href="/issues" className="shrink-0 text-accent transition-colors hover:text-ink">
            Issue lineup
          </Link>
        </div>
      </div>

      <nav className="container mx-auto max-w-7xl px-4 py-4 sm:flex sm:h-20 sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="group min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-gray-400 transition-colors group-hover:text-accent sm:tracking-[0.34em]">
              Pulse Magazine
            </span>
            <span className="block font-serif text-[1.65rem] leading-none tracking-[-0.045em] text-ink sm:text-[2.2rem]">
              The long read, reset.
            </span>
          </Link>

          <Link
            href="/submit"
            className="shrink-0 rounded-full border border-black/10 bg-ink px-4 py-2 text-sm font-medium text-paper shadow-[0_10px_28px_-16px_rgba(20,17,15,0.55)] transition-all hover:-translate-y-px hover:bg-accent sm:px-5"
          >
            Submit
          </Link>
        </div>

        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-black/10 bg-white/76 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
