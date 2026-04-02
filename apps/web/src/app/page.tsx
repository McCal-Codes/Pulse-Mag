import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { homepageSettingsQuery, allPostsQuery, latestWeeklyBlogQuery } from '@/lib/queries'
import { HeroPost } from '@/components/HeroPost'
import { PostGrid } from '@/components/PostGrid'
import { WeeklyBlogCard } from '@/components/WeeklyBlogCard'

// ISR: revalidate page every 60 seconds
export const revalidate = 60

type HomePost = Parameters<typeof PostGrid>[0]['posts'][number]

type HomepageSettings = {
  heroText?: string
  featuredPost?: HomePost | null
  featuredPosts?: HomePost[]
}

type WeeklyBlog = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  weekNumber?: number
  year?: number
  featuredImage?: { asset?: { _ref: string } }
}

export default async function HomePage() {
  const sanityServerClient = await getSanityServerClient()

  if (!sanityServerClient) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Configure Sanity environment variables to load magazine content.
      </div>
    )
  }

  // Fetch homepage settings, all posts, and latest weekly blog in parallel
  const [settings, allPosts, latestWeeklyBlog] = await Promise.all([
    safeSanityFetch<HomepageSettings | null>(sanityServerClient, homepageSettingsQuery, {}, null),
    safeSanityFetch<HomePost[]>(sanityServerClient, allPostsQuery, {}, []),
    safeSanityFetch<WeeklyBlog | null>(sanityServerClient, latestWeeklyBlogQuery, {}, null),
  ])

  const featuredPost = settings?.featuredPost
  const featuredPosts = settings?.featuredPosts ?? []
  const heroText = settings?.heroText

  // Fall back to latest posts if no homepage settings configured
  const gridPosts = featuredPosts.length > 0 ? featuredPosts : allPosts?.slice(0, 6) ?? []

  return (
    <>
      {featuredPost ? (
        <HeroPost post={featuredPost} />
      ) : allPosts?.[0] ? (
        <HeroPost post={allPosts[0]} />
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Add content in Sanity Studio to get started.
        </div>
      )}

      {latestWeeklyBlog && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 border-b border-gray-200">
          <h2 className="font-serif text-xl font-bold mb-6 text-ink">This Week at Pulse</h2>
          <div className="max-w-2xl">
            <WeeklyBlogCard blog={latestWeeklyBlog} />
          </div>
        </section>
      )}

      {gridPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-14">
          {heroText && (
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">{heroText}</p>
          )}
          <h2 className="font-serif text-2xl font-bold mb-8 text-ink">Recent Stories</h2>
          <PostGrid posts={gridPosts} />
        </section>
      )}
    </>
  )
}
