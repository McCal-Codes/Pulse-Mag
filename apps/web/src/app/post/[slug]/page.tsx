import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityClient, getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/queries'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

// In Next.js 15, params is a Promise — always await it
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
  if (!sanityClient) {
    return []
  }

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
      images: post.mainImage
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
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
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-14">
      {/* Title */}
      <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-ink mb-4">
        {post.title}
      </h1>

      {/* Byline */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        {post.author && (
          <span>
            By{' '}
            {post.author.slug?.current ? (
              <Link
                href={`/author/${post.author.slug.current}`}
                className="font-medium text-ink hover:text-accent transition-colors"
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
            {post.author && <span aria-hidden>·</span>}
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
        <div className="relative aspect-video mb-10 rounded-lg overflow-hidden">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 800px, 100vw"
          />
        </div>
      )}

      {/* Body */}
      {body.length > 0 && (
        <div className="prose prose-lg prose-gray max-w-none font-sans
          prose-headings:font-serif prose-headings:font-bold
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <PortableText value={body as any} />
        </div>
      )}
    </article>
  )
}
