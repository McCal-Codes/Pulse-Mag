import Link from 'next/link'
import { currentIssue } from '@/lib/issues'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 bg-paper-soft/70">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="font-serif text-3xl leading-none tracking-[-0.04em] text-ink">
            Pulse Magazine
          </Link>
          <p className="max-w-md text-sm leading-7 text-gray-600">
            A magazine for essays, criticism, and fiction that outlast the scroll.
            Built around issues, edited with patience, and published for readers who stay with the page.
          </p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">
            {currentIssue?.status ?? 'Issue desk'}: {currentIssue?.title ?? 'Pulse Magazine'}
          </p>
        </div>

        <nav className="space-y-3 text-sm text-gray-600">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Navigate</p>
          <Link href="/issues" className="block transition-colors hover:text-accent">Issues</Link>
          <Link href="/blog" className="block transition-colors hover:text-accent">Blog</Link>
          <Link href="/about" className="block transition-colors hover:text-accent">About</Link>
          <Link href="/about/team" className="block transition-colors hover:text-accent">Team</Link>
          <Link href="/submit" className="block transition-colors hover:text-accent">Submit</Link>
        </nav>

        <div className="space-y-3 text-sm text-gray-600">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Editorial</p>
          <a href="mailto:hello@pulsemagazine.com" className="block transition-colors hover:text-accent">
            hello@pulsemagazine.com
          </a>
          <a href="mailto:submissions@pulsemagazine.com" className="block transition-colors hover:text-accent">
            submissions@pulsemagazine.com
          </a>
          <p className="pt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} Pulse Magazine
          </p>
        </div>
      </div>
    </footer>
  )
}
