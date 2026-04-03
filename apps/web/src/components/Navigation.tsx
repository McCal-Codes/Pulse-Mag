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
    <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/90 backdrop-blur-md">
      <div className="border-b border-black/5">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-gray-500 sm:px-6 lg:px-8">
          <span>{currentIssue?.status ?? 'Issue desk'}: {currentIssue?.title ?? 'Pulse Magazine'}</span>
          <Link href="/issues" className="text-accent transition-colors hover:text-ink">
            View issue lineup
          </Link>
        </div>
      </div>

      <nav className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <span className="block text-[11px] uppercase tracking-[0.34em] text-gray-400 transition-colors group-hover:text-accent">
            Pulse Magazine
          </span>
          <span className="block font-serif text-3xl leading-none tracking-[-0.04em] text-ink">
            The Long Read, reset.
          </span>
        </Link>

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

        <Link
          href="/submit"
          className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-px hover:border-accent hover:text-accent"
        >
          Submit
        </Link>
      </nav>
    </header>
  )
}
