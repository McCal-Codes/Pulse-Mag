import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity.client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com'

  const staticRoutes = [
    '', '/about', '/about/team', '/issues', '/news', '/blog', '/events', '/submit', '/join',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch dynamic blog posts from Sanity
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    if (sanityClient) {
      const posts = await sanityClient.fetch<Array<{ slug: string; publishedAt: string }>>(
        `*[_type == "weeklyBlog" && isPublished == true && defined(slug.current)] { "slug": slug.current, publishedAt }`
      )
      blogEntries = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // Graceful fallback - sitemap will still work without blog posts
  }

  // Fetch dynamic issues from Sanity
  let issueEntries: MetadataRoute.Sitemap = []
  try {
    if (sanityClient) {
      const issues = await sanityClient.fetch<Array<{ slug: string; _updatedAt: string }>>(
        `*[_type == "issue"] { "slug": slug.current, _updatedAt }`
      )
      issueEntries = issues.map((issue) => ({
        url: `${baseUrl}/issues/${issue.slug}`,
        lastModified: new Date(issue._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // Graceful fallback - sitemap will still work without issues
  }

  // Fetch dynamic events from Sanity
  let eventEntries: MetadataRoute.Sitemap = []
  try {
    if (sanityClient) {
      const events = await sanityClient.fetch<Array<{ slug: string; date: string }>>(
        `*[_type == "event" && defined(slug.current)] { "slug": slug.current, date }`
      )
      eventEntries = events.map((event) => ({
        url: `${baseUrl}/events`,
        lastModified: new Date(event.date),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // Graceful fallback - sitemap will still work without events
  }

  return [...staticEntries, ...blogEntries, ...issueEntries, ...eventEntries] as MetadataRoute.Sitemap
}
