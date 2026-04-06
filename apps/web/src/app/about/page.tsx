import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { siteSettingsQuery } from '@/lib/queries'
import { groq } from 'next-sanity'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Pulse Literary & Arts Magazine.',
}

export const revalidate = 3600

const aboutPageQuery = groq`
  *[_type == "page" && slug.current == "about"][0] {
    title,
    content
  }
`

type PageData = {
  title?: string
  content?: Array<Record<string, unknown>>
}

type SiteSettings = {
  editorQuote?: string
  editorQuoteAttribution?: string
}

export default async function AboutPage() {
  const client = await getSanityServerClient()
  const [page, settings] = await Promise.all([
    client ? safeSanityFetch<PageData | null>(client, aboutPageQuery, {}, null) : null,
    client ? safeSanityFetch<SiteSettings | null>(client, siteSettingsQuery, {}, null) : null,
  ])

  const editorQuote = settings?.editorQuote
  const editorQuoteAttribution = settings?.editorQuoteAttribution

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">About Us</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {/* Content sections - editorial style */}
      <div className="space-y-12">
        {page?.content ? (
          <div className="prose prose-lg prose-gray max-w-none font-body prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight prose-a:text-[var(--color-nav)] prose-a:no-underline hover:prose-a:underline">
            <PortableText value={page.content as any} />
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
            {/* About Pulse - Left */}
            <section className="relative pl-6 sm:pl-8">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[var(--color-nav)] via-[var(--color-nav)]/40 to-transparent" />
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-nav)]">About</p>
              <p className="mt-3 text-lg leading-8 text-gray-700 sm:text-xl sm:leading-9">
                Pulse Literary &amp; Arts Magazine is an annual multimedia literary and arts magazine led
                by students at Point Park University. As a multimedia magazine, we publish all art
                forms, including literature, poetry, scripts, art, photography, dance, and music.
              </p>
            </section>

            {/* Our Mission - Right */}
            <section className="relative pl-6 sm:pl-8">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[var(--color-amber)] via-[var(--color-amber)]/40 to-transparent" />
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">Mission</p>
              <p className="mt-3 text-lg leading-8 text-gray-700 sm:text-xl sm:leading-9">
                We seek submissions that draw meaning from our world and the intricacies of our human
                experience. We love to see creators use the boundaries of their art form to bring
                their passions, interpretations, experiences, and messages to life.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Editor quote */}
      {(editorQuote || !page?.content) && (
        <div className="mt-16 pt-12">
          <div className="text-center">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[var(--color-nav)]/30" />
              <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--color-nav)]">Editor&apos;s Note</span>
              <span className="h-px w-12 bg-[var(--color-nav)]/30" />
            </div>
            <blockquote className="mx-auto max-w-2xl">
              <p className="font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
                &ldquo;{editorQuote ?? 'Insert Quote From Current Editor-in-Chief here.'}&rdquo;
              </p>
            </blockquote>
            {(editorQuoteAttribution || !editorQuote) && (
              <p className="mt-4 text-sm text-gray-500">
                <span className="text-[var(--color-nav)]">—</span>
                <span className="ml-2 italic">
                  {editorQuoteAttribution ?? '[First Name] [Last Name], editor-in-chief'}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/about/team"
          className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--color-nav)' }}
        >
          Meet Our Staff
        </Link>
        <Link
          href="/join"
          className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
        >
          Join Our Team
        </Link>
      </div>

      {!page?.content && (
        <aside className="mt-10 rounded border border-dashed border-black/10 p-4 text-xs text-gray-400">
          <strong className="text-gray-500">Studio note:</strong> Create a{' '}
          <strong>Page</strong> document with slug <code className="text-[var(--color-nav)]">about</code> in
          Sanity Studio to replace this fallback content. Set editorQuote &amp; editorQuoteAttribution in Site Settings.
        </aside>
      )}
    </div>
  )
}
