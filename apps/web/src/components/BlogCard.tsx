import Link from 'next/link'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  author?: { name: string; slug?: { current: string } }
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,241,229,0.95)_100%)] shadow-[0_20px_52px_-30px_rgba(20,17,15,0.24)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex flex-col justify-between p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-gray-400">
              <span>Notebook</span>
              <span>{formattedDate}</span>
            </div>

            <h3 className="mt-4 font-display text-3xl leading-none tracking-[-0.035em] text-ink transition-colors group-hover:text-accent">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mt-4 text-sm leading-7 text-gray-600">{post.excerpt}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/8 pt-4 text-sm">
            <span className="text-gray-500">{post.author?.name ?? 'Pulse editorial'}</span>
            <span className="font-medium text-ink transition-colors group-hover:text-accent">
              Read note
            </span>
          </div>
        </div>
    </Link>
  )
}
