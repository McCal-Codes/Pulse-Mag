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
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-gray-500 sm:px-6 lg:px-8">
          <span>{currentIssue?.status ?? 'Issue desk'}: {currentIssue?.title ?? 'Pulse Magazine'}</span>
          <Link href="/issues" className="text-accent transition-colors hover:text-ink">
            Issue lineup
          </Link>
        </div>
      </div>

      <nav className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <span className="block text-[10px] uppercase tracking-[0.34em] text-gray-400 transition-colors group-hover:text-accent">
            Pulse Magazine
          </span>
          <span className="block font-serif text-[2rem] leading-none tracking-[-0.045em] text-ink sm:text-[2.2rem]">
            The long read, reset.
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
          className="rounded-full border border-black/10 bg-ink px-5 py-2 text-sm font-medium text-paper shadow-[0_10px_28px_-16px_rgba(20,17,15,0.55)] transition-all hover:-translate-y-px hover:bg-accent"
        >
          Submit
        </Link>
      </nav>
    </header>
  )
}
