import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

type Category = {
  title: string
  slug: { current: string }
}

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: unknown
  publishedAt?: string
  author?: { name: string }
  categories?: Category[]
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200">
      {post.mainImage && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={urlFor(post.mainImage as Parameters<typeof urlFor>[0]).width(640).height(360).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-2">
        {post.categories?.[0] && (
          <Link
            href={`/category/${post.categories[0].slug.current}`}
            className="text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-75 transition-opacity"
          >
            {post.categories[0].title}
          </Link>
        )}

        <Link href={`/post/${post.slug.current}`}>
          <h2 className="font-serif text-xl font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
          {post.author && (
            <span className="text-xs text-gray-500">{post.author.name}</span>
          )}
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-xs text-gray-400 ml-auto"
            >
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
    </article>
  )
}
