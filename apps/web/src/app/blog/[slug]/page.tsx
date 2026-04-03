import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityClient, getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import { blogPostBySlugQuery, allBlogSlugsQuery } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

type BlogPost = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  featuredImage?: SanityImageSource
  content?: unknown[]
  tags?: string[]
  author?: { name: string; slug?: { current: string }; image?: SanityImageSource }
}

export async function generateStaticParams() {
  if (!sanityClient) return []
  const slugs = await safeSanityFetch<Array<{ slug: string }>>(sanityClient, allBlogSlugsQuery, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSanityServerClient()
  if (!client) return {}
  const { slug } = await params
  const post = await safeSanityFetch<BlogPost | null>(client, blogPostBySlugQuery, { slug }, null)
  return {
    title: post?.title ?? 'Pulse News',
    openGraph: post?.featuredImage
      ? { images: [urlFor(post.featuredImage).width(1200).height(630).url()] }
      : undefined,
  }
}

export const revalidate = 60

export default async function BlogPostPage({ params }: Props) {
  const client = await getSanityServerClient()
  if (!client) notFound()

  const { slug } = await params
  const post = await safeSanityFetch<BlogPost | null>(client, blogPostBySlugQuery, { slug }, null)
  if (!post) notFound()

  const body = Array.isArray(post.content) ? post.content : []

  return (
    <article className="mx-auto max-w-2xl px-6 py-14">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-gray-400 transition-colors hover:text-[var(--color-nav)]"
      >
        <span aria-hidden>←</span> Pulse News
      </Link>

      {/* Title */}
      <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Byline */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
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
        {post.author && <span aria-hidden className="text-black/20">·</span>}
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={urlFor(post.featuredImage).width(1200).height(675).url()}
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
          prose-blockquote:border-l-[var(--color-nav)] prose-blockquote:font-serif prose-blockquote:not-italic">
          <PortableText value={body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-black/8 pt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 px-3 py-1 text-[0.6rem] uppercase tracking-wider text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-10 border-t border-black/8 pt-8">
        <Link
          href="/blog"
          className="text-sm text-gray-400 transition-colors hover:text-[var(--color-nav)]"
        >
          ← All Pulse News
        </Link>
      </div>
    </article>
  )
}
