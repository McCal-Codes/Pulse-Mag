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
    <section className="relative min-h-[30rem] overflow-hidden rounded-[1.75rem] bg-ink text-paper shadow-[0_34px_86px_-34px_rgba(20,17,15,0.52)] sm:min-h-[35rem] sm:rounded-[2rem]">
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
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#14110f_0%,#2f241d_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(141,82,53,0.28),transparent_34%),linear-gradient(180deg,rgba(20,17,15,0.08)_0%,rgba(20,17,15,0.64)_52%,rgba(20,17,15,0.96)_100%)]" />

      <div className="relative flex min-h-[30rem] flex-col justify-between p-6 sm:min-h-[35rem] sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-paper/65 sm:text-[11px] sm:tracking-[0.28em]">
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            Lead story
          </span>
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
            <h2 className="font-serif text-[2.8rem] leading-none tracking-[-0.045em] text-paper transition-colors hover:text-paper/84 sm:text-6xl lg:text-7xl">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-paper/78 sm:text-lg sm:leading-8">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-col items-start gap-4 text-sm text-paper/70 sm:flex-row sm:flex-wrap sm:items-center">
            {post.author && <span>{post.author.name}</span>}
            <Link
              href={`/post/${post.slug.current}`}
              className="rounded-full border border-white/14 bg-accent px-5 py-2 font-medium text-paper shadow-[0_12px_28px_-16px_rgba(141,82,53,0.65)] transition-all hover:-translate-y-px hover:bg-[#a7603f]"
            >
              Read the story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
