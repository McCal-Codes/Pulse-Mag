import Link from 'next/link'
import Image from 'next/image'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: SanityImageSource
  publishedAt?: string
  author?: { name: string; slug?: { current: string } }
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/90 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1">
      {post.mainImage && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={urlFor(post.mainImage).width(960).height(720).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-gray-400">
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
          <h2 className="font-serif text-3xl leading-none tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm leading-7 text-gray-600">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-black/8 pt-4">
          {post.author ? (
            post.author.slug?.current ? (
              <Link
                href={`/author/${post.author.slug.current}`}
                className="text-sm text-gray-500 transition-colors hover:text-accent"
              >
                {post.author.name}
              </Link>
            ) : (
              <span className="text-sm text-gray-500">{post.author.name}</span>
            )
          ) : (
            <span className="text-sm text-gray-400">Pulse editorial</span>
          )}

          <Link
            href={`/post/${post.slug.current}`}
            className="text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  )
}
