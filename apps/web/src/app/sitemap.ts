import { sanityClient } from '@/lib/sanity.client'
import { allPostSlugsQuery, allBlogPostsQuery, siteSettingsQuery } from '@/lib/queries'

async function getAllRoutes() {
  if (!sanityClient) {
    console.warn('Sitemap: Sanity client not available')
    return { posts: [], blogPosts: [], staticRoutes: [] }
  }

  try {
    const [posts, blogPosts] = await Promise.all([
      sanityClient.fetch(allPostSlugsQuery, {}, { cache: 'no-store' }),
      sanityClient.fetch(allBlogPostsQuery, {}, { cache: 'no-store' }),
    ])

    return {
      posts: posts || [],
      blogPosts: blogPosts || [],
      staticRoutes: [
        '',
        '/about',
        '/about/team',
        '/issues',
        '/news',
        '/blog',
        '/events',
        '/submit',
        '/join',
      ],
    }
  } catch (error) {
    console.error('Sitemap: Error fetching routes:', error)
    return { posts: [], blogPosts: [], staticRoutes: [
      '', '/about', '/submit', '/join', '/issues', '/blog', '/events'
    ]}
  }
}

export default async function Sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com'
  const { posts, blogPosts, staticRoutes } = await getAllRoutes()

  const routes = [
    // Static routes
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    })),

    // Post pages
    ...posts.map((post: { slug: string; publishedAt?: string; modifiedAt?: string }) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.modifiedAt || post.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),

    // Blog/News posts
    ...blogPosts.map((post: { slug: { current: string }; publishedAt?: string }) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: post.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })),

    // News route (alias for blog)
    ...blogPosts.map((post: { slug: { current: string }; publishedAt?: string }) => ({
      url: `${baseUrl}/news/${post.slug.current}`,
      lastModified: post.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`
}
