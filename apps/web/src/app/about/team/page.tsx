import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import { groq } from 'next-sanity'

export const metadata: Metadata = {
  title: 'Our Team — Pulse Magazine',
  description: 'Meet the editors, writers, and contributors behind Pulse Magazine.',
}

export const revalidate = 60

const allAuthorsQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    role,
    bio
  }
`

type Author = {
  _id: string
  name: string
  slug: { current: string }
  image?: SanityImageSource
  role?: string
  bio?: unknown[]
}

export default async function TeamPage() {
  const client = await getSanityServerClient()
  const authors = await safeSanityFetch<Author[]>(client, allAuthorsQuery, {}, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
      <header className="mb-14 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">About</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">Our Team</h1>
        <p className="text-lg text-gray-600">
          The editors, writers, and contributors who make Pulse Magazine possible.
        </p>
      </header>

      {authors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <Link
              key={author._id}
              href={`/author/${author.slug.current}`}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
            >
              {author.image ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-accent transition-all mb-4">
                  <Image
                    src={urlFor(author.image).width(192).height(192).fit('crop').url()}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 ring-2 ring-gray-200">
                  <span className="text-2xl font-serif font-bold text-gray-400">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}

              <h2 className="font-serif text-lg font-bold text-ink group-hover:text-accent transition-colors">
                {author.name}
              </h2>
              {author.role && (
                <p className="text-sm text-gray-500 mt-1">{author.role}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          Team members will appear here once Author profiles are created in the Studio.
        </p>
      )}

      <div className="mt-14 flex gap-4">
        <Link
          href="/about"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-ink font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← About Pulse Magazine
        </Link>
      </div>
    </div>
  )
}
