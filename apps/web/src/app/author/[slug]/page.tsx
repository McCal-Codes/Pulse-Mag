import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityClient, getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import { authorBySlugQuery, postsByAuthorQuery, allAuthorSlugsQuery } from '@/lib/queries'
import { ArticleCard } from '@/components/ArticleCard'

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
  pronoun?: string
  lookingFor?: string
}

type Post = Parameters<typeof ArticleCard>[0]['post']

export async function generateStaticParams() {
  if (!sanityClient) return []
  const slugs = await safeSanityFetch<Array<{ slug: string }>>(sanityClient, allAuthorSlugsQuery, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSanityServerClient()
  if (!client) return {}
  const { slug } = await params
  const author = await safeSanityFetch<Author | null>(client, authorBySlugQuery, { slug }, null)
  return {
    title: author?.name ?? 'Author',
    description: author?.role ?? undefined,
  }
}

export const revalidate = 60

export default async function AuthorPage({ params }: Props) {
  const client = await getSanityServerClient()
  if (!client) notFound()

  const { slug } = await params
  const author = await safeSanityFetch<Author | null>(client, authorBySlugQuery, { slug }, null)
  if (!author) notFound()

  const posts = await safeSanityFetch<Post[]>(client, postsByAuthorQuery, { authorId: author._id }, [])

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Back */}
      <Link
        href="/about/team"
        className="mb-8 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-gray-400 transition-colors hover:text-[var(--color-nav)]"
      >
        <span aria-hidden>←</span> Our Staff
      </Link>

      {/* Author header */}
      <header className="flex flex-col gap-7 border-b border-black/8 pb-10 sm:flex-row sm:items-start">
        {/* Photo */}
        <div className="shrink-0">
          {author.image ? (
            <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-[var(--color-nav)]/20 sm:h-40 sm:w-40">
              <Image
                src={urlFor(author.image).width(320).height(320).fit('crop').url()}
                alt={author.name}
                width={160}
                height={160}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full sm:h-40 sm:w-40"
              style={{ backgroundColor: 'var(--color-amber)' }}
            >
              <span className="font-serif text-4xl font-bold text-white">
                {author.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-[0.6rem] uppercase tracking-[0.28em]" style={{ color: 'var(--color-nav)' }}>
            Staff
          </p>
          <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{author.name}</h1>
          {author.role && (
            <p className="mt-1 text-sm text-gray-500">{author.role}</p>
          )}

          {author.bio && (author.bio as unknown[]).length > 0 && (
            <div className="prose prose-sm prose-gray mt-4 max-w-none font-sans prose-p:leading-7 prose-p:text-gray-600">
              <PortableText value={author.bio as any} />
            </div>
          )}

          {author.lookingFor && (
            <div className="mt-4 rounded border border-black/8 bg-white/60 p-4">
              <p className="text-[0.6rem] uppercase tracking-widest text-gray-400">
                What {author.pronoun?.split('/')[0] ?? author.name.split(' ')[0]} is looking for
              </p>
              <p className="mt-1.5 text-sm italic leading-7 text-gray-600">{author.lookingFor}</p>
            </div>
          )}

          {/* Social links */}
          {(author.twitter || author.website) && (
            <div className="mt-4 flex gap-4">
              {author.twitter && (
                <a
                  href={`https://x.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 transition-colors hover:text-[var(--color-nav)]"
                >
                  @{author.twitter}
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 transition-colors hover:text-[var(--color-nav)]"
                >
                  Website ↗
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Posts */}
      <section className="mt-12">
        <h2 className="mb-7 font-serif text-2xl text-ink">
          {posts.length > 0
            ? `${posts.length} article${posts.length === 1 ? '' : 's'} by ${author.name}`
            : `No published articles yet`}
        </h2>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Check back soon — articles will appear here once published.
          </p>
        )}
      </section>
    </div>
  )
}
