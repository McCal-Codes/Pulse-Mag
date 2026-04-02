import { getSanityServerClient } from '@/lib/sanity.client'
import { homepageSettingsQuery, allPostsQuery } from '@/lib/queries'
import { HeroPost } from '@/components/HeroPost'
import { PostGrid } from '@/components/PostGrid'

// ISR: revalidate page every 60 seconds
export const revalidate = 60

export default async function HomePage() {
  const sanityServerClient = await getSanityServerClient()

  if (!sanityServerClient) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Configure Sanity environment variables to load magazine content.
      </div>
    )
  }

  // Fetch homepage settings and all posts in parallel
  const [settings, allPosts] = await Promise.all([
    sanityServerClient.fetch(homepageSettingsQuery),
    sanityServerClient.fetch(allPostsQuery),
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
