import Link from 'next/link'
import { currentIssue } from '@/lib/issues'
import { DiamondDivider } from '@/components/DiamondDivider'
import { AnimatedSection, AnimatedCard } from '@/components/ScrollAnimation'

// Hardcoded data - avoids Sanity client issues
// TODO: Re-enable Sanity fetching once client is debugged

const welcomeText = 'Pulse Literary & Arts Magazine is an annual multimedia literary and arts magazine led by students at Point Park University. As a multimedia magazine, we publish all art forms, including literature, poetry, scripts, art, photography, dance, and music.'

const blogPosts = [
  {
    _id: '1',
    title: 'Welcome to Pulse Magazine',
    slug: { current: 'welcome-to-pulse' },
    excerpt: 'We are excited to launch our new website and welcome submissions from emerging writers and artists in Pittsburgh and beyond.',
    publishedAt: '2024-01-15T12:00:00Z',
    featuredImage: null,
    author: { name: 'Pulse Editorial Team' }
  }
]

export const revalidate = 60

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function HomePage() {
  const featuredPost = blogPosts[0] ?? null
  const morePosts = blogPosts.slice(1, 4)

  return (
    <div className="pb-16">
      {/* ── Welcome ── */}
      <AnimatedSection className="mx-auto max-w-2xl px-6 pt-14 pb-10 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Welcome</h1>
        <DiamondDivider className="mt-3 mb-6" />
        <p className="text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">{welcomeText}</p>
      </AnimatedSection>

      {/* ── Featured Issue ── */}
      {currentIssue && (
        <AnimatedSection delay={100} className="mx-auto mb-14 flex justify-center px-6">
          <Link
            href="/issues"
            className="group relative flex w-56 flex-col overflow-hidden rounded-xl border border-black/10 shadow-[0_16px_40px_-20px_rgba(20,17,15,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(20,17,15,0.38)] sm:w-64"
          >
            {/* Cover image area */}
            <div className="relative aspect-[3/4] bg-[var(--color-paper-deep)]">
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                <p
                  className="font-display text-xl leading-tight text-white sm:text-2xl"
                  style={{ color: 'var(--color-amber)' }}
                >
                  {currentIssue.title}
                </p>
                <p className="mt-0.5 font-display text-3xl font-bold leading-none text-white/30">
                  {String(1).padStart(2, '0')}
                </p>
              </div>
              {/* Subtle grain overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />
            </div>
            {/* Caption */}
            <div className="bg-paper-soft px-4 py-3 text-center transition-colors duration-300 group-hover:bg-paper">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gray-500">
                {currentIssue.status === 'Current issue' ? 'Available Now' : 'Coming Soon'}
              </p>
              <p className="mt-0.5 text-[0.7rem] text-gray-500">{currentIssue.season}</p>
            </div>
          </Link>
        </AnimatedSection>
      )}

      <hr className="mx-auto max-w-4xl border-black/10 px-6" />

      {/* ── Pulse News ── */}
      <AnimatedSection delay={150} className="mx-auto max-w-5xl px-6 pt-12">
        <h2 className="mb-1 text-center font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Pulse News
        </h2>
        <div className="mx-auto mb-10 mt-1 h-px max-w-xs bg-black/15" />

        {blogPosts.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            No posts yet — publish blog posts in Sanity Studio to populate this section.
          </p>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && (
              <AnimatedCard className="mb-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
                {/* Text side */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-1 text-[0.7rem] tracking-wider text-gray-400">
                      {formatDate(featuredPost.publishedAt)}
                    </p>
                    {featuredPost.excerpt && (
                      <p className="mt-4 text-sm leading-7 text-gray-600">{featuredPost.excerpt}</p>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <Link
                      href={`/blog/${featuredPost.slug.current}`}
                      className="inline-block rounded border border-black/20 px-5 py-2 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
                    >
                      Read More
                    </Link>
                    {featuredPost.author && (
                      <span className="text-xs text-gray-500">By {featuredPost.author.name}</span>
                    )}
                  </div>
                </div>

                {/* Image side */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-paper-deep)] sm:aspect-auto sm:min-h-[14rem]">
                  <div className="flex h-full items-center justify-center text-[0.65rem] uppercase tracking-widest text-gray-400">
                    Featured Image
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* More posts */}
            {morePosts.length > 0 && (
              <>
                <hr className="mx-auto mb-8 max-w-2xl border-black/10" />
                <div className="grid gap-6 sm:grid-cols-3">
                  {morePosts.map((post, index) => (
                    <AnimatedCard key={post._id} delay={index * 100} className="flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-paper-deep)]">
                        <div className="flex h-full items-center justify-center text-[0.65rem] uppercase tracking-widest text-gray-400">
                          Featured Image
                        </div>
                      </div>
                      <h3 className="mt-3 font-display text-lg leading-snug text-ink">{post.title}</h3>
                      <p className="mt-0.5 text-[0.65rem] tracking-wider text-gray-400">
                        {formatDate(post.publishedAt)}
                      </p>
                      {post.excerpt && (
                        <div className="mt-2 rounded border border-black/10 p-3">
                          <p className="line-clamp-3 text-xs leading-6 text-gray-600">{post.excerpt}</p>
                        </div>
                      )}
                      <div className="mt-3">
                        <Link
                          href={`/blog/${post.slug.current}`}
                          className="inline-block rounded border border-black/15 px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
                        >
                          Read More
                        </Link>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </>
            )}

            {/* Read all link */}
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[var(--color-nav)]"
              >
                Read All Pulse News &rsaquo;&rsaquo;
              </Link>
            </div>
          </>
        )}
      </AnimatedSection>
    </div>
  )
}
