import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import { allAuthorsQuery } from '@/lib/queries'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata: Metadata = {
  title: 'Our Staff',
  description: 'Meet the editors and contributors behind Pulse Literary & Arts Magazine.',
}

export const revalidate = 60

type Author = {
  _id: string
  name: string
  slug: { current: string }
  image?: SanityImageSource
  role?: string
  bio?: unknown[]
  pronoun?: string
  lookingFor?: string
}

export default async function TeamPage() {
  const client = await getSanityServerClient()
  const authors = await safeSanityFetch<Author[]>(client, allAuthorsQuery, {}, [])

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Our Staff</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {authors.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          Staff members will appear here once Author profiles are created in Sanity Studio.
        </p>
      ) : (
        <div className="space-y-16">
          {authors.map((author, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={author._id}
                className={`flex flex-col gap-8 sm:flex-row sm:items-start ${isEven ? '' : 'sm:flex-row-reverse'}`}
              >
                {/* Photo */}
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <Link href={`/author/${author.slug.current}`} className="group">
                    <div className="h-48 w-48 overflow-hidden rounded-full ring-2 ring-black/10 transition-all group-hover:ring-[var(--color-nav)] sm:h-56 sm:w-56">
                      {author.image ? (
                        <Image
                          src={urlFor(author.image).width(224).height(224).fit('crop').url()}
                          alt={author.name}
                          width={224}
                          height={224}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{ backgroundColor: 'var(--color-amber)' }}
                        >
                          <span className="font-display text-4xl font-bold text-white">
                            {author.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <p className="text-center text-sm font-medium text-ink">{author.name}</p>
                  {author.role && (
                    <p className="text-center text-xs text-gray-500">{author.role}</p>
                  )}
                </div>

                {/* Bio box */}
                <div className="flex-1 rounded border border-black/10 bg-white/60 p-6">
                  <p className="font-display text-xl text-ink">{author.name}</p>
                  {author.bio && (author.bio as unknown[]).length > 0 && (
                    <div className="prose prose-sm prose-gray mt-3 max-w-none font-body prose-p:leading-7 prose-p:text-gray-600">
                      <PortableText value={author.bio as any} />
                    </div>
                  )}
                  {author.lookingFor && (
                    <div className="mt-4 border-t border-black/8 pt-4">
                      <p className="text-[0.7rem] uppercase tracking-widest text-gray-400">
                        What {author.pronoun?.split('/')[0] ?? author.name.split(' ')[0]} is looking for in submissions
                      </p>
                      <p className="mt-1.5 text-sm italic leading-7 text-gray-600">
                        {author.lookingFor}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Join Us CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/join"
          className="inline-block rounded-full px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-px hover:shadow-lg"
          style={{ backgroundColor: 'var(--color-nav)' }}
        >
          Join Us
        </Link>
      </div>
    </div>
  )
}
