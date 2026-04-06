// Simple static sitemap - avoids Sanity client issues
// TODO: Add dynamic post routes once Sanity integration is debugged

export default async function Sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com'

  const staticRoutes = [
    '', '/about', '/about/team', '/issues', '/news', '/blog', '/events', '/submit', '/join',
  ]

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

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
