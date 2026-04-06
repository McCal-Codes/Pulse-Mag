// lib/wix-rss.ts
// Parse Wix blog RSS feed for headless CMS integration
// Site: https://pulse24.wixsite.com/pulse

const WIX_RSS_URLS = [
  'https://pulse24.wixsite.com/pulse/blog-feed.xml',
  'https://pulse24.wixsite.com/pulse/blog/rss',
  'https://pulse24.wixsite.com/pulse/feed',
]

export interface WixRSSPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  link: string
  featuredImage?: string
  categories: string[]
  author?: string
}

export async function fetchWixRSSPosts(): Promise<WixRSSPost[]> {
  for (const url of WIX_RSS_URLS) {
    try {
      console.log(`Trying RSS URL: ${url}`)
      const response = await fetch(url, {
        next: { revalidate: 300 },
      })

      if (response.ok) {
        const xml = await response.text()
        const posts = parseRSS(xml)
        if (posts.length > 0) {
          console.log(`Success with ${url}: ${posts.length} posts found`)
          return posts
        }
      }
    } catch (error) {
      console.error(`Failed with ${url}:`, error)
    }
  }
  
  return []
}

function parseRSS(xml: string): WixRSSPost[] {
  const items: WixRSSPost[] = []
  
  // Extract items using regex (lightweight parser)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const itemsMatch = [...xml.matchAll(itemRegex)]
  
  for (const itemMatch of itemsMatch) {
    const itemXml = itemMatch[1]
    
    const title = extractTag(itemXml, 'title') || 'Untitled'
    const link = extractTag(itemXml, 'link') || ''
    const pubDate = extractTag(itemXml, 'pubDate') || ''
    const description = extractTag(itemXml, 'description') || ''
    const content = extractTag(itemXml, 'content:encoded') || description
    const creator = extractTag(itemXml, 'dc:creator') || ''
    
    // Extract categories
    const categoryMatches = [...itemXml.matchAll(/<category>([^<]*)<\/category>/g)]
    const categories = categoryMatches.map(m => m[1]).filter(Boolean)
    
    // Try to find featured image
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/)
    const featuredImage = imgMatch ? imgMatch[1] : undefined
    
    // Generate slug from link or title
    const slug = link.split('/').pop()?.replace(/\/$/, '') || 
                 title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    items.push({
      id: extractTag(itemXml, 'guid') || link,
      title,
      slug,
      excerpt: stripHtml(description).slice(0, 200) + '...',
      content,
      date: pubDate,
      link,
      featuredImage,
      categories,
      author: creator,
    })
  }
  
  return items
}

function extractTag(xml: string, tagName: string): string | null {
  // Handle CDATA: <title><![CDATA[Title Here]]></title>
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i')
  const cdataMatch = xml.match(cdataRegex)
  if (cdataMatch) return cdataMatch[1].trim()
  
  // Standard tag: <title>Title Here</title>
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export async function getWixRSSPostBySlug(slug: string): Promise<WixRSSPost | null> {
  const posts = await fetchWixRSSPosts()
  return posts.find(p => p.slug === slug) || null
}
