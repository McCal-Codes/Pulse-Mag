import Link from 'next/link'
import Image from 'next/image'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: SanityImageSource
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
      className="group block overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/90 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="grid gap-0 sm:grid-cols-[0.92fr_1.08fr]">
        {post.featuredImage && (
          <div className="relative min-h-[14rem] overflow-hidden">
            <Image
              src={urlFor(post.featuredImage).width(900).height(720).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 640px) 40vw, 100vw"
            />
          </div>
        )}

        <div className="flex flex-col justify-between p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-gray-400">
              <span>From the desk</span>
              <span>{formattedDate}</span>
            </div>

            <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
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
      </div>
    </Link>
  )
}
