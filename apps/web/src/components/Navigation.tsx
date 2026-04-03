'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Issues', href: '/issues' },
  { label: 'Submit', href: '/submit' },
  { label: 'Events', href: '/events' },
]

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      {/* Logo block */}
      <div className="flex flex-col items-center py-4 px-4">
        <Link href="/" className="group flex flex-col items-center gap-1">
          {/* Starburst + PULSE wordmark */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[1.1rem] leading-none text-[var(--color-nav)] transition-colors group-hover:text-accent"
              aria-hidden="true"
            >
              ✦
            </span>
            <span className="font-serif text-[2.2rem] leading-none tracking-[0.12em] text-ink transition-colors group-hover:text-accent sm:text-[2.6rem]">
              PULSE
            </span>
          </div>
          <span className="font-sans text-[0.65rem] italic tracking-[0.18em] text-gray-500 sm:text-[0.7rem]">
            Literary &amp; Arts Magazine
          </span>
        </Link>
      </div>

      {/* Nav bar */}
      <nav
        className="w-full"
        style={{ backgroundColor: 'var(--color-nav)' }}
        aria-label="Main navigation"
      >
        {/* Desktop */}
        <ul className="hidden items-center justify-center gap-10 py-2.5 sm:flex">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: hamburger */}
        <div className="flex items-center justify-between px-4 py-2.5 sm:hidden">
          <span className="text-xs font-medium tracking-wider text-white/80">Menu</span>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block h-px w-5 bg-white transition-all duration-200 ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`}
            />
            <span
              className={`block h-px w-5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-px w-5 bg-white transition-all duration-200 ${menuOpen ? '-translate-y-[3px] -rotate-45' : ''}`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <ul className="border-t border-white/20 px-4 pb-3 sm:hidden">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
