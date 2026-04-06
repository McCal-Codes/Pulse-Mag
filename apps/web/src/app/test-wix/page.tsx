// app/test-wix/page.tsx
// Test page to verify Wix RSS feed connection

import { fetchWixRSSPosts } from '@/lib/wix-rss'

export const metadata = {
  title: 'Wix RSS Test',
  robots: { index: false, follow: false },
}

export default async function TestWixPage() {
  const posts = await fetchWixRSSPosts()

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Wix RSS Test</h1>
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">
            Could not fetch posts from Wix RSS feed.
          </p>
          <p className="mt-2 text-sm text-red-600">
            Make sure:<br />
            1. Your Wix site has published blog posts<br />
            2. RSS feed is enabled: https://pulse24.wixsite.com/pulse/blog-feed.xml<br />
            3. Site: https://pulse24.wixsite.com/pulse
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Wix RSS Test ✅</h1>
      <p className="mt-2 text-gray-600">
        Successfully connected via RSS feed!
      </p>
      
      <h2 className="mt-10 font-display text-xl text-ink">Posts Found ({posts.length})</h2>
      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded border border-black/10 p-4">
            <h3 className="font-display text-lg text-ink">{post.title}</h3>
            <p className="text-sm text-gray-500">Slug: {post.slug}</p>
            <p className="text-sm text-gray-500">Date: {post.date}</p>
            {post.author && (
              <p className="text-sm text-gray-500">Author: {post.author}</p>
            )}
            {post.categories.length > 0 && (
              <p className="text-sm text-gray-500">Categories: {post.categories.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
