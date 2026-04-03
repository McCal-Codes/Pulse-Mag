import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityClient, getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/queries'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

type Props = { params: Promise<{ slug: string }> }

type PortableTextValue = Array<Record<string, unknown>>

type PostData = {
  title: string
  excerpt?: string
  mainImage?: SanityImageSource
  publishedAt?: string
  body?: PortableTextValue
  author?: { name: string; slug?: { current: string } }
}

export async function generateStaticParams() {
  if (!sanityClient) return []
  const slugs = await safeSanityFetch<Array<{ slug: string }>>(sanityClient, allPostSlugsQuery, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) return {}
  const { slug } = await params
  const post = await safeSanityFetch<PostData | null>(sanityServerClient, postBySlugQuery, { slug }, null)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  }
}

export const revalidate = 60

export default async function PostPage({ params }: Props) {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) notFound()

  const { slug } = await params
  const post = await safeSanityFetch<PostData | null>(sanityServerClient, postBySlugQuery, { slug }, null)
  if (!post) notFound()

  const body = Array.isArray(post.body) ? post.body : []

  return (
    <article className="mx-auto max-w-2xl px-6 py-14">
      {/* Back link */}
      <Link
        href="/issues"
        className="mb-8 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-gray-400 transition-colors hover:text-[var(--color-nav)]"
      >
        <span aria-hidden>←</span> Issues
      </Link>

      {/* Issue label */}
      <p className="text-[0.65rem] uppercase tracking-[0.28em]" style={{ color: 'var(--color-nav)' }}>
        Pulse Literary &amp; Arts Magazine
      </p>

      {/* Title */}
      <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mt-4 font-serif text-lg italic leading-relaxed text-gray-500">
          {post.excerpt}
        </p>
      )}

      {/* Byline */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-black/8 pb-6 text-sm text-gray-400">
        {post.author && (
          <span>
            By{' '}
            {post.author.slug?.current ? (
              <Link
                href={`/author/${post.author.slug.current}`}
                className="font-medium text-ink transition-colors hover:text-[var(--color-nav)]"
              >
                {post.author.name}
              </Link>
            ) : (
              <span className="font-medium text-ink">{post.author.name}</span>
            )}
          </span>
        )}
        {post.publishedAt && (
          <>
            {post.author && <span aria-hidden className="text-black/20">·</span>}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </>
        )}
      </div>

      {/* Main image */}
      {post.mainImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 700px, 100vw"
          />
        </div>
      )}

      {/* Body */}
      {body.length > 0 && (
        <div className="prose prose-gray mt-10 max-w-none font-sans leading-8
          prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight
          prose-a:text-[var(--color-nav)] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-[var(--color-nav)] prose-blockquote:font-serif prose-blockquote:not-italic
          prose-p:text-gray-700">
          <PortableText value={body as any} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-14 flex items-center justify-between border-t border-black/8 pt-8 text-sm text-gray-400">
        <Link href="/issues" className="transition-colors hover:text-[var(--color-nav)]">
          ← Back to Issues
        </Link>
        {post.author?.slug?.current && (
          <Link
            href={`/author/${post.author.slug.current}`}
            className="transition-colors hover:text-[var(--color-nav)]"
          >
            More by {post.author.name} →
          </Link>
        )}
      </div>
    </article>
  )
}
