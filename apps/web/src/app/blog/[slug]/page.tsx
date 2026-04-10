import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { sanityClient } from '@/lib/sanity.client'
import { blogPostBySlugQuery, allBlogSlugsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import { PortableText } from '@/components/PortableText'
import { ArticleSchema } from '@/components/ArticleSchema'
import type { BlogPost } from '@/lib/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await sanityClient?.fetch<{ slug: string }[]>(allBlogSlugsQuery) ?? []
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityClient?.fetch<BlogPost>(blogPostBySlugQuery, { slug })

  if (!post) {
    return {
      title: 'Pulse News',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com'
  const description = post.excerpt?.slice(0, 160) || 'Read the latest from Pulse Magazine.'
  const imageUrl = post.featuredImage ? urlFor(post.featuredImage).width(1200).height(630).url() : undefined

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      url: `${baseUrl}/blog/${slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export const revalidate = 60

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params)
  const postPromise = sanityClient?.fetch<BlogPost>(blogPostBySlugQuery, { slug })
  const post = postPromise ? use(postPromise) : null

  if (!post) {
    notFound()
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com'
  const imageUrl = post.featuredImage ? urlFor(post.featuredImage).width(1200).height(630).url() : undefined

  return (
    <>
      <ArticleSchema post={post} url={`${baseUrl}/blog/${slug}`} />
      <article className="mx-auto max-w-2xl px-6 py-14">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-gray-400 transition-colors hover:text-[var(--color-nav)]"
        >
          <span aria-hidden>←</span> Pulse News
        </Link>

        {/* Title */}
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Byline */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
          {post.author && (
            <span className="font-medium text-ink">{post.author.name}</span>
          )}
          {post.author && <span aria-hidden className="text-black/20">·</span>}
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={imageUrl!}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* Body */}
        {post.content && (
          <div className="prose prose-gray mt-10 max-w-none font-body leading-8
          prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight
          prose-a:text-[var(--color-nav)] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-[var(--color-nav)] prose-blockquote:font-display prose-blockquote:not-italic">
            <PortableText value={post.content} />
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
    </>
  )
}
