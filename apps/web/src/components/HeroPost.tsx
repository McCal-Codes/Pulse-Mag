import Link from 'next/link'
import Image from 'next/image'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'

type HeroPostProps = {
  post: {
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: SanityImageSource
    publishedAt?: string
    author?: { name: string }
  }
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section className="relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-ink text-paper shadow-[0_30px_80px_-32px_rgba(15,23,42,0.45)]">
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(1800).height(1200).url()}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#161615_0%,#2b2521_100%)]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,21,0.15)_0%,rgba(22,22,21,0.78)_62%,rgba(22,22,21,0.96)_100%)]" />

      <div className="relative flex min-h-[34rem] flex-col justify-between p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-paper/65">
          <span>Lead story</span>
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>

        <div className="max-w-3xl">
          <Link href={`/post/${post.slug.current}`}>
            <h2 className="font-serif text-5xl leading-none tracking-[-0.04em] text-paper transition-colors hover:text-paper/85 sm:text-6xl lg:text-7xl">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-paper/78 sm:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-paper/70">
            {post.author && <span>{post.author.name}</span>}
            <Link
              href={`/post/${post.slug.current}`}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 font-medium text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:-translate-y-px hover:bg-white/15"
            >
              Read the story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
