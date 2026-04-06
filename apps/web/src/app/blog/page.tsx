import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { fetchWixRSSPosts } from '@/lib/wix-rss'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata: Metadata = {
  title: 'Pulse News',
  description: 'News, updates, and behind-the-scenes from Pulse Literary & Arts Magazine.',
}

export const revalidate = 60

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, '').slice(0, 200) + '...' || ''
}

export default async function BlogPage() {
  // Fetch from Wix RSS feed
  const posts = await fetchWixRSSPosts()

  const featured = posts[0] ?? null
  const rest = posts.slice(1)

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Pulse News</h1>
        <DiamondDivider className="mt-3 mb-5" />
        <p className="mx-auto max-w-md text-sm leading-7 text-gray-500">
          News, updates, and behind-the-scenes from the Pulse team.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white/60 px-8 py-14 text-center">
          <p className="font-display text-2xl text-ink">No posts yet</p>
          <p className="mt-2 text-sm text-gray-400">Check back soon.</p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <article className="mb-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-1 text-[0.7rem] tracking-wider text-gray-400">
                    {formatDate(featured.date)}
                    {featured.author && (
                      <span className="ml-2 text-gray-400">· {featured.author}</span>
                    )}
                  </p>
                  {featured.excerpt && (
                    <div className="mt-4 rounded border border-black/10 p-4">
                      <p className="text-sm leading-7 text-gray-600">
                        {stripHtml(featured.excerpt)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-block rounded border border-black/20 px-5 py-2 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
                  >
                    Read More
                  </Link>
                  {featured.categories && featured.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {featured.categories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full border border-black/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-gray-400"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-paper-deep)] sm:aspect-auto sm:min-h-[14rem]">
                {featured.featuredImage ? (
                  <Image
                    src={featured.featuredImage}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.6rem] uppercase tracking-widest text-gray-400">
                    Featured Image
                  </div>
                )}
              </div>
            </article>
          )}

          {/* Rest of posts grid */}
          {rest.length > 0 && (
            <>
              <hr className="mb-10 border-black/10" />
              <div className="grid gap-6 sm:grid-cols-3">
                {rest.map((post) => (
                  <article key={post.id} className="flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-paper-deep)]">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[0.6rem] uppercase tracking-widest text-gray-400">
                          Featured Image
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-lg leading-snug text-ink">{post.title}</h3>
                    <p className="mt-0.5 text-[0.65rem] tracking-wider text-gray-400">
                      {formatDate(post.date)}
                      {post.author && <span className="ml-1">· {post.author}</span>}
                    </p>

                    {post.excerpt && (
                      <div className="mt-2 rounded border border-black/10 p-3">
                        <p className="line-clamp-3 text-xs leading-6 text-gray-600">
                          {stripHtml(post.excerpt)}
                        </p>
                      </div>
                    )}

                    {post.categories && post.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.categories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full border border-black/10 px-2 py-0.5 text-[0.55rem] uppercase tracking-wider text-gray-400"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block rounded border border-black/15 px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
