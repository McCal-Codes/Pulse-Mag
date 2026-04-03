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
    title: post ? `${post.title} — Pulse Magazine Blog` : 'Blog',
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
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-14">
      <Link
        href="/blog"
        className="text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-75 transition-opacity mb-4 inline-block"
      >
        ← Blog
      </Link>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-ink mb-4">
        {post.title}
      </h1>

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
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {post.featuredImage && (
        <div className="relative aspect-video mb-10 rounded-lg overflow-hidden">
          <Image
            src={urlFor(post.featuredImage).width(1200).height(675).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 800px, 100vw"
          />
        </div>
      )}

      {body.length > 0 && (
        <div className="prose prose-lg prose-gray max-w-none font-sans
          prose-headings:font-serif prose-headings:font-bold
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <PortableText value={body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2 mt-10 pt-8 border-t border-gray-200">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-accent transition-colors">
          ← All blog posts
        </Link>
      </div>
    </article>
  )
}
