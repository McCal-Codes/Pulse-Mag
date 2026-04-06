// Footer with hardcoded social links - avoids Sanity client issues
// TODO: Re-enable Sanity fetching once client is debugged

type SocialLink = {
  label: string
  href: string
  icon: React.ReactNode
}

const socialLinks: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/pulseliterary',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/pulse-literary-magazine',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hello@pulseliterary.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/pulseliterary.bsky.social',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com/pulseliterary',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
]

export async function Footer() {
  const links = socialLinks

  return (
    <footer
      className="relative mt-24 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F4F1EC 0%, #E8E5E0 45%, #DDD9D3 100%)',
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(61, 20, 25, 0.15) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(18, 27, 19, 0.2) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />
      {/* Blob shapes */}
      <svg
        className="absolute -left-16 bottom-0 h-64 w-64 opacity-30"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#3D1419"
          d="M47.7,-51.2C60.3,-37.3,68,-18.6,68.2,0.2C68.4,19,61,38.1,48.4,51.9C35.8,65.7,17.9,74.2,-1.4,75.7C-20.7,77.2,-41.4,71.7,-55.2,57.9C-69,44.2,-75.8,22.1,-74.4,1.4C-73,-19.3,-63.3,-38.6,-49.1,-52.5C-34.9,-66.4,-17.4,-74.9,0.9,-75.9C19.2,-76.9,35.1,-65.1,47.7,-51.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -right-12 -top-8 h-72 w-72 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#121B13"
          d="M38.9,-42.5C50.5,-31.5,60.3,-15.8,62.2,1.9C64.1,19.6,58.2,39.2,46.6,52.3C35,65.4,17.5,72,-1.5,73.5C-20.5,75,-41,71.5,-54.5,58.5C-68,45.4,-74.5,22.7,-71.7,2.8C-68.9,-17.1,-56.8,-34.2,-43.3,-45.2C-29.8,-56.2,-14.9,-61.1,0.8,-62C16.5,-62.9,27.3,-53.5,38.9,-42.5Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 text-center">
        <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">Stay In Tune</h2>

        {/* Social icons */}
        <div className="mt-6 flex items-center gap-3">
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Logo */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none text-ink/60" aria-hidden="true">✦</span>
            <span className="font-display text-2xl tracking-[0.12em] text-ink/70">PULSE</span>
          </div>
          <span className="text-[0.65rem] italic tracking-widest text-ink/50">
            Literary &amp; Arts Magazine
          </span>
        </div>

        <p className="mt-6 text-[0.65rem] tracking-wider text-ink/40">
          © {new Date().getFullYear()} Pulse Literary &amp; Arts Magazine
        </p>
      </div>
    </footer>
  )
}
