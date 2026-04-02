import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient, getSanityServerClient } from '@/lib/sanity.client'
import { postsByCategoryQuery, allCategorySlugsQuery, categoryBySlugQuery } from '@/lib/queries'
import { PostGrid } from '@/components/PostGrid'

// In Next.js 15, params is a Promise — always await it
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  if (!sanityClient) {
    return []
  }

  const slugs: Array<{ slug: string }> = await sanityClient.fetch(allCategorySlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) return {}

  const { slug } = await params
  const category = await sanityServerClient.fetch(categoryBySlugQuery, { slug })

  return {
    title: category?.title ?? slug,
    description: category?.description ?? `Posts tagged with ${slug}`,
  }
}

export const revalidate = 60

export default async function CategoryPage({ params }: Props) {
  const sanityServerClient = await getSanityServerClient()
  if (!sanityServerClient) notFound()

  const { slug } = await params
  const [posts, category] = await Promise.all([
    sanityServerClient.fetch(postsByCategoryQuery, { slug }),
    sanityServerClient.fetch(categoryBySlugQuery, { slug }),
  ])

  if (!posts || posts.length === 0) notFound()

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-14">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Category</p>
        <h1 className="font-serif text-4xl font-bold text-ink capitalize">
          {category?.title ?? slug}
        </h1>
        {category?.description && (
          <p className="mt-3 text-gray-500 max-w-xl">{category.description}</p>
        )}
      </header>

      <PostGrid posts={posts} />
    </section>
  )
}
