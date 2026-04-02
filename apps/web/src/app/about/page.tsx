import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Pulse Magazine — independent journalism at the pulse of culture.',
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

export default async function AboutPage() {
  const client = await getSanityServerClient()
  const page = await safeSanityFetch<PageData | null>(client, aboutPageQuery, {}, null)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-14">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">About</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-tight">
          {page?.title ?? 'Pulse Magazine'}
        </h1>
      </header>

      {page?.content ? (
        <div className="prose prose-lg prose-gray max-w-none font-sans prose-headings:font-serif prose-headings:font-bold prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <PortableText value={page.content as any} />
        </div>
      ) : (
        // Static fallback until an "about" page document is created in Sanity Studio
        <div className="prose prose-lg prose-gray max-w-none font-sans prose-headings:font-serif">
          <p className="lead text-xl text-gray-600 leading-relaxed">
            Pulse Magazine is an independent editorial publication covering culture, politics, technology, and fiction. We publish writing that takes its time — long reads, reported essays, and short fiction that rewards attention.
          </p>

          <h2>What we publish</h2>
          <p>
            Our editorial focus is on work that resists the news cycle. We are interested in the slower stories: how institutions change, how communities hold together, how technology reshapes daily life without making headlines. We publish essays, reported pieces, interviews, and a fiction section that commissions new short work.
          </p>

          <h2>How we work</h2>
          <p>
            Pulse is built by a small team of editors and contributors. We work with writers across disciplines — journalists, academics, novelists, and practitioners who bring deep knowledge to their subjects. We pay for all commissioned work.
          </p>

          <h2>Contact</h2>
          <p>
            For editorial pitches, partnership enquiries, or general correspondence, write to us at{' '}
            <a href="mailto:hello@pulsemagazine.com">hello@pulsemagazine.com</a>.
          </p>

          <aside className="mt-12 p-4 bg-gray-50 rounded-lg border border-gray-200 not-prose">
            <p className="text-xs text-gray-400 font-sans">
              <strong className="text-gray-500">Studio note:</strong> This page is showing its static fallback. To edit this content, create a{' '}
              <strong>Page</strong> document in Sanity Studio with the slug <code className="text-accent">about</code>.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
