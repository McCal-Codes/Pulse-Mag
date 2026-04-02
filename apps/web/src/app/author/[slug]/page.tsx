import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityClient, getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import {
  authorBySlugQuery,
  postsByAuthorQuery,
  allAuthorSlugsQuery,
} from '@/lib/queries'
import { PostGrid } from '@/components/PostGrid'

// In Next.js 15, params is a Promise — always await it
type Props = { params: Promise<{ slug: string }> }

type Author = {
  _id: string
  name: string
  slug: { current: string }
  image?: SanityImageSource
  role?: string
  bio?: unknown[]
  twitter?: string
  website?: string
}

type GridPost = Parameters<typeof PostGrid>[0]['posts'][number]

export async function generateStaticParams() {
  if (!sanityClient) return []
  const slugs = await safeSanityFetch<Array<{ slug: string }>>(sanityClient, allAuthorSlugsQuery, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) return {}

  const { slug } = await params
  const author = await safeSanityFetch<Author | null>(
    sanityServerClient,
    authorBySlugQuery,
    { slug },
    null
  )

  return {
    title: author?.name ? `${author.name} — Pulse Magazine` : 'Author',
    description: author?.role ?? `Articles by ${slug}`,
  }
}

export const revalidate = 60

export default async function AuthorPage({ params }: Props) {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) notFound()

  const { slug } = await params

  const author = await safeSanityFetch<Author | null>(
    sanityServerClient,
    authorBySlugQuery,
    { slug },
    null
  )

  if (!author) notFound()

  const posts = await safeSanityFetch<GridPost[]>(
    sanityServerClient,
    postsByAuthorQuery,
    { authorId: author._id },
    []
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-14">
      {/* Author header */}
      <header className="flex flex-col sm:flex-row gap-8 items-start mb-14 pb-14 border-b border-gray-200">
        {author.image && (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-gray-200">
            <Image
              src={urlFor(author.image).width(288).height(288).fit('crop').url()}
              alt={author.name}
              fill
              className="object-cover"
              sizes="144px"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
              Author
            </p>
            <h1 className="font-serif text-4xl font-bold text-ink">{author.name}</h1>
            {author.role && (
              <p className="mt-1 text-gray-500 text-sm font-medium">{author.role}</p>
            )}
          </div>

          {author.bio && (
            <div className="prose prose-sm max-w-xl text-gray-600">
              <PortableText value={author.bio as Parameters<typeof PortableText>[0]['value']} />
            </div>
          )}

          {/* Social links */}
          <div className="flex gap-4 mt-1">
            {author.twitter && (
              <a
                href={`https://x.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-accent transition-colors"
              >
                @{author.twitter}
              </a>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-accent transition-colors"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Posts by this author */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-ink mb-8">
          {posts.length > 0
            ? `${posts.length} article${posts.length === 1 ? '' : 's'} by ${author.name}`
            : `No published articles yet`}
        </h2>

        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <p className="text-gray-500">
            Check back soon — articles will appear here once published.
          </p>
        )}
      </section>

      <div className="mt-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-accent transition-colors">
          ← Back to all articles
        </Link>
      </div>
    </div>
  )
}
