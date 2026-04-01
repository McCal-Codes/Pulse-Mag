import { ArticleCard } from './ArticleCard'

type Post = Parameters<typeof ArticleCard>[0]['post']

export function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts?.length) {
    return (
      <p className="text-gray-500 text-center py-12">No posts found.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  )
}
