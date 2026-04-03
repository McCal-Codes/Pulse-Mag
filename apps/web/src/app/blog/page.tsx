import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { allBlogPostsQuery } from '@/lib/queries'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

export const metadata: Metadata = {
  title: 'Blog — Pulse Magazine',
  description: 'News, updates, and behind-the-scenes from the Pulse Magazine team.',
}

export const revalidate = 60

type BlogPost = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: SanityImageSource
  tags?: string[]
  author?: { name: string; slug?: { current: string } }
}

export default async function BlogPage() {
  const client = await getSanityServerClient()
  const posts = await safeSanityFetch<BlogPost[]>(client, allBlogPostsQuery, {}, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Blog</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">From the Team</h1>
        <p className="text-lg text-gray-600">
          News, updates, and behind-the-scenes from Pulse Magazine.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post._id} className="group">
              <Link
                href={`/blog/${post.slug.current}`}
                className="flex flex-col sm:flex-row gap-6 p-6 -mx-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {post.featuredImage && (
                  <div className="relative w-full sm:w-48 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(post.featuredImage).width(384).height(288).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 192px, 100vw"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <time dateTime={post.publishedAt} className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {post.author && (
                      <span className="text-xs text-gray-400">· {post.author.name}</span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl font-bold text-ink group-hover:text-accent transition-colors mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No blog posts yet. Check back soon.</p>
      )}
    </div>
  )
}
