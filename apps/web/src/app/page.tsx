import Link from 'next/link'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { homepageSettingsQuery, allPostsQuery, latestBlogPostQuery } from '@/lib/queries'
import { HeroPost } from '@/components/HeroPost'
import { ArticleCard } from '@/components/ArticleCard'
import { IssueCard } from '@/components/IssueCard'
import { currentIssue, upcomingIssues } from '@/lib/issues'

export const revalidate = 60

type HomePost = Parameters<typeof ArticleCard>[0]['post']

type HomepageSettings = {
  heroText?: string
  featuredPost?: HomePost | null
  featuredPosts?: HomePost[]
}

type BlogPost = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: { asset?: { _ref: string } }
  author?: { name: string; slug?: { current: string } }
}

export default async function HomePage() {
  const sanityServerClient = await getSanityServerClient()

  if (!sanityServerClient) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Configure Sanity environment variables to load magazine content.
      </div>
    )
  }

  const [settings, allPosts, latestBlog] = await Promise.all([
    safeSanityFetch<HomepageSettings | null>(sanityServerClient, homepageSettingsQuery, {}, null),
    safeSanityFetch<HomePost[]>(sanityServerClient, allPostsQuery, {}, []),
    safeSanityFetch<BlogPost | null>(sanityServerClient, latestBlogPostQuery, {}, null),
  ])

  const featuredPost = settings?.featuredPost ?? allPosts?.[0] ?? null
  const frontPool = (settings?.featuredPosts?.length ? settings.featuredPosts : allPosts ?? []).filter(
    (post) => post._id !== featuredPost?._id
  )
  const leadStories = frontPool.slice(0, 2)
  const moreStories = frontPool.slice(2, 6)
  const heroText = settings?.heroText ?? 'Pulse is a seasonal magazine for criticism, essays, and fiction.'
  const frontCount = (featuredPost ? 1 : 0) + leadStories.length + moreStories.length

  return (
    <div className="pb-16">
      <section className="container mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[0.56fr_1.04fr]">
          <div className="grid gap-8">
            <div className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(248,241,229,0.95)_100%)] p-8 shadow-[0_24px_58px_-30px_rgba(20,17,15,0.28)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Magazine front</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {currentIssue?.season ?? 'Current cycle'}
                  </p>
                </div>
                <span className="rounded-full border border-black/10 bg-paper px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-gray-500">
                  {frontCount} stories in play
                </span>
              </div>

              <h1 className="mt-6 max-w-xl font-serif text-5xl leading-none tracking-[-0.05em] text-ink sm:text-6xl">
                Stories worth the second sitting.
              </h1>

              <p className="mt-5 max-w-[34rem] text-base leading-8 text-gray-600">
                {heroText}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/issues"
                  className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:bg-accent"
                >
                  Browse issues
                </Link>
                <Link
                  href="/submit"
                  className="rounded-full border border-black/10 bg-paper px-5 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-px hover:border-accent hover:text-accent"
                >
                  Submit work
                </Link>
              </div>

              <dl className="mt-10 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Lead</dt>
                  <dd className="mt-2 text-sm text-gray-700">
                    {featuredPost ? 'Hero story live' : 'Awaiting hero post'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Desk</dt>
                  <dd className="mt-2 text-sm text-gray-700">
                    {latestBlog ? 'Notebook updated' : 'Quiet for now'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-gray-400">Next</dt>
                  <dd className="mt-2 text-sm text-gray-700">
                    {upcomingIssues.length} upcoming issue{upcomingIssues.length === 1 ? '' : 's'}
                  </dd>
                </div>
              </dl>
            </div>

            {latestBlog ? (
              <aside className="rounded-[2rem] border border-black/10 bg-paper-soft/72 p-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Notebook</p>
                <h2 className="mt-4 font-serif text-3xl leading-none tracking-[-0.04em] text-ink">
                  <Link href={`/blog/${latestBlog.slug.current}`} className="transition-colors hover:text-accent">
                    {latestBlog.title}
                  </Link>
                </h2>
                {latestBlog.excerpt && (
                  <p className="mt-4 text-sm leading-7 text-gray-600">{latestBlog.excerpt}</p>
                )}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/10 pt-4 text-sm">
                  <span className="text-gray-500">{latestBlog.author?.name ?? 'Pulse editorial'}</span>
                  <Link href={`/blog/${latestBlog.slug.current}`} className="font-medium text-ink transition-colors hover:text-accent">
                    Read note
                  </Link>
                </div>
              </aside>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/60 p-8 text-sm text-gray-500">
                Publish a blog post to surface a desk note here.
              </div>
            )}
          </div>

          <div className="grid gap-8">
            {featuredPost ? (
              <HeroPost post={featuredPost} />
            ) : (
              <div className="flex min-h-[35rem] items-center justify-center rounded-[2rem] border border-black/10 bg-white/80 text-sm text-gray-400">
                Add a featured post in Sanity Studio to build the front page.
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              {currentIssue && <IssueCard issue={currentIssue} compact />}

              <div className="rounded-[2rem] border border-black/10 bg-paper-soft/74 p-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Coming next</p>
                <div className="mt-5 space-y-5">
                  {upcomingIssues.length > 0 ? (
                    upcomingIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="border-t border-black/10 pt-5 first:border-t-0 first:pt-0"
                      >
                        <p className="font-serif text-3xl leading-none tracking-[-0.04em] text-ink">
                          {issue.title}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">{issue.window}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-600">{issue.summary}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-gray-600">
                      The next issue line is still being assembled.
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-black/10 pt-4">
                  <Link href="/issues" className="text-sm font-medium text-ink transition-colors hover:text-accent">
                    View the full issue desk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 border-b border-black/10 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Selected stories</p>
            <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.04em] text-ink">
              On the page now
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-gray-600">
            A tighter front, a visible issue desk, and enough room for stories to feel chosen rather than merely recent.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {leadStories.length > 0 ? (
              leadStories.map((post) => <ArticleCard key={post._id} post={post} />)
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-white/70 p-8 text-sm text-gray-500 md:col-span-2">
                Add more featured posts in Sanity Studio to populate the front page deck.
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(248,241,229,0.95)_100%)] p-8 shadow-[0_24px_58px_-30px_rgba(20,17,15,0.24)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Issue desk</p>
            <h3 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] text-ink">
              {currentIssue?.title ?? 'Current issue'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {currentIssue?.window ?? 'Reading window to be announced.'}
            </p>
            <p className="mt-5 text-sm leading-7 text-gray-600">
              {currentIssue?.summary ??
                'Pulse organizes the magazine around issues rather than endless categories.'}
            </p>

            <div className="mt-8 space-y-4 border-t border-black/10 pt-5 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-4">
                <span>Current brief</span>
                <span className="text-gray-400">Placeholder read</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Notes package</span>
                <span className="text-gray-400">Placeholder read</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/issues"
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:bg-accent"
              >
                View issues
              </Link>
              <Link
                href="/submit"
                className="rounded-full border border-black/10 bg-paper px-5 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-px hover:border-accent hover:text-accent"
              >
                Submit work
              </Link>
            </div>
          </aside>
        </div>

        {moreStories.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {moreStories.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
