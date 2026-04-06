// Test page to verify WordPress GraphQL connection
// URL: /test-wp

import { fetchFromWP, getAllPostsQuery } from '@/lib/wordpress-client'

export const metadata = {
  title: 'WordPress Connection Test',
  robots: { index: false, follow: false }, // Don't index this test page
}

export default async function TestWPPage() {
  const data = await fetchFromWP<{ posts: { nodes: any[] } }>(getAllPostsQuery)

  if (!data || !data.posts?.nodes?.length) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="font-display text-3xl text-ink">WordPress Connection Test</h1>
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">
            Could not connect to WordPress or no posts found.
          </p>
          <p className="mt-2 text-sm text-red-600">
            Make sure WPGraphQL plugin is installed and activated on:<br />
            https://mediumaquamarine-dog-147416.hostingersite.com
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl text-ink">WordPress Connection Test ✅</h1>
      <p className="mt-2 text-gray-600">
        Successfully connected to your WordPress site!
      </p>
      
      <h2 className="mt-10 font-display text-xl text-ink">Posts Found ({data.posts.nodes.length})</h2>
      <div className="mt-4 space-y-4">
        {data.posts.nodes.map((post: any) => (
          <div key={post.id} className="rounded border border-black/10 p-4">
            <h3 className="font-display text-lg text-ink">{post.title}</h3>
            <p className="text-sm text-gray-500">Slug: {post.slug}</p>
            <p className="text-sm text-gray-500">Date: {post.date}</p>
            {post.author?.node?.name && (
              <p className="text-sm text-gray-500">Author: {post.author.node.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
