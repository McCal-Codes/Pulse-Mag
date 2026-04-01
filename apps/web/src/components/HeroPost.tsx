import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

type HeroPostProps = {
  post: {
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: unknown
    publishedAt?: string
    author?: { name: string }
    categories?: Array<{ title: string; slug: { current: string } }>
  }
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section className="relative h-[80vh] min-h-[520px] flex items-end overflow-hidden">
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage as Parameters<typeof urlFor>[0]).width(1920).height(1080).url()}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-white max-w-7xl">
        {post.categories?.[0] && (
          <Link
            href={`/category/${post.categories[0].slug.current}`}
            className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3 hover:opacity-75 transition-opacity"
          >
            {post.categories[0].title}
          </Link>
        )}

        <Link href={`/post/${post.slug.current}`}>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl hover:text-white/85 transition-colors">
            {post.title}
          </h1>
        </Link>

        {post.excerpt && (
          <p className="mt-4 text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 mt-6 text-sm text-gray-300">
          {post.author && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <>
              {post.author && <span aria-hidden>·</span>}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
