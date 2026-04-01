import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-24 bg-paper">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
            GF Magazine
          </Link>
          <p className="text-xs text-gray-400">A modern literary and editorial publication.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          <Link href="/category/culture" className="hover:text-accent transition-colors">Culture</Link>
          <Link href="/category/politics" className="hover:text-accent transition-colors">Politics</Link>
        </nav>

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} GF Magazine
        </p>
      </div>
    </footer>
  )
}
