import Link from 'next/link'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { homepageSettingsQuery, allPostsQuery, latestBlogPostQuery } from '@/lib/queries'
import { HeroPost } from '@/components/HeroPost'
import { PostGrid } from '@/components/PostGrid'
import { BlogCard } from '@/components/BlogCard'
import { IssueCard } from '@/components/IssueCard'
import { currentIssue, upcomingIssues } from '@/lib/issues'

export const revalidate = 60

type HomePost = Parameters<typeof PostGrid>[0]['posts'][number]

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
  const featuredPosts = settings?.featuredPosts?.length ? settings.featuredPosts : allPosts?.slice(0, 6) ?? []
  const heroText = settings?.heroText ?? 'Pulse is a seasonal magazine for criticism, essays, and fiction.'

  return (
    <div>
      <section className="container mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-[0_20px_48px_-30px_rgba(15,23,42,0.22)]">
              <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Magazine front</p>
              <h1 className="mt-5 max-w-xl font-serif text-5xl leading-none text-ink sm:text-6xl">
                Reporting, criticism, and fiction for the long attention span.
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
            </div>

            {currentIssue && <IssueCard issue={currentIssue} compact />}
          </div>

          {featuredPost ? (
            <HeroPost post={featuredPost} />
          ) : (
            <div className="flex min-h-[34rem] items-center justify-center rounded-[2rem] border border-black/10 bg-white/80 text-sm text-gray-400">
              Add a featured post in Sanity Studio to build the front page.
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Latest stories</p>
                <h2 className="mt-3 font-serif text-4xl leading-none text-ink">On the page now</h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-gray-500 transition-colors hover:text-accent">
                Visit the blog
              </Link>
            </div>

            {featuredPosts.length > 0 ? (
              <PostGrid posts={featuredPosts} />
            ) : (
              <p className="rounded-[1.5rem] border border-dashed border-black/10 bg-white/70 p-8 text-sm text-gray-500">
                Add featured posts in Sanity Studio to populate the landing page.
              </p>
            )}
          </div>

          <div className="space-y-8">
            {latestBlog ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">From the desk</p>
                <div className="mt-4">
                  <BlogCard post={latestBlog} />
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-white/70 p-8 text-sm text-gray-500">
                Publish a blog post to surface an editorial note here.
              </div>
            )}

            {upcomingIssues.length > 0 && (
              <div className="rounded-[2rem] border border-black/10 bg-[#f2eadf] p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Coming soon</p>
                <div className="mt-4 space-y-5">
                  {upcomingIssues.map((issue) => (
                    <div key={issue.id} className="border-t border-black/10 pt-5 first:border-t-0 first:pt-0">
                      <p className="font-serif text-3xl leading-none text-ink">{issue.title}</p>
                      <p className="mt-2 text-sm text-gray-500">{issue.window}</p>
                      <p className="mt-3 text-sm leading-7 text-gray-600">{issue.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
