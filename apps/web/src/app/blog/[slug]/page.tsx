import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWixRSSPostBySlug } from '@/lib/wix-rss'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getWixRSSPostBySlug(slug)
  return {
    title: post?.title ?? 'Pulse News',
  }
}

export const revalidate = 60

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getWixRSSPostBySlug(slug)

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
      <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Byline */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
        {post.author && (
          <span className="font-medium text-ink">{post.author}</span>
        )}
        {post.author && <span aria-hidden className="text-black/20">·</span>}
        <time dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      {post.content && (
        <div
          className="prose prose-gray mt-10 max-w-none font-body leading-8
          prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight
          prose-a:text-[var(--color-nav)] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-[var(--color-nav)] prose-blockquote:font-display prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Categories */}
      {post.categories.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-black/8 pt-8">
          {post.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-black/10 px-3 py-1 text-[0.6rem] uppercase tracking-wider text-gray-400"
            >
              {cat}
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
