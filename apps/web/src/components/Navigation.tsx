import Link from 'next/link'

const navLinks = [
  { label: 'Culture', href: '/category/culture' },
  { label: 'Politics', href: '/category/politics' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Fiction', href: '/category/fiction' },
  { label: 'Submit', href: '/submit' },
]

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors"
        >
          Pulse Magazine
        </Link>

        <ul className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: show only the wordmark, no hamburger for now */}
        <div className="sm:hidden" />
      </nav>
    </header>
  )
}
