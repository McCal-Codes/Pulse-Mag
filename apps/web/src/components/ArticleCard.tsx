import Link from 'next/link'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  author?: { name: string; slug?: { current: string } }
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-4 text-[0.6rem] uppercase tracking-widest text-gray-400">
          <span>Story</span>
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
        </div>

        <Link href={`/post/${post.slug.current}`}>
          <h2 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-[var(--color-nav)] sm:text-2xl">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="line-clamp-3 text-sm leading-7 text-gray-600">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-black/8 pt-4">
          {post.author ? (
            post.author.slug?.current ? (
              <Link
                href={`/author/${post.author.slug.current}`}
                className="text-xs text-gray-500 transition-colors hover:text-[var(--color-nav)]"
              >
                {post.author.name}
              </Link>
            ) : (
              <span className="text-xs text-gray-500">{post.author.name}</span>
            )
          ) : (
            <span className="text-xs text-gray-400">Pulse editorial</span>
          )}

          <Link
            href={`/post/${post.slug.current}`}
            className="text-xs font-medium text-ink transition-colors group-hover:text-[var(--color-nav)]"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
