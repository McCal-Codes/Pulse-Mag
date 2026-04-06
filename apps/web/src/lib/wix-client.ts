// lib/wix-client.ts
// Wix CMS API client - connects to Wix site
// Site: https://pulse24.wixsite.com/pulse

const WIX_API_URL = 'https://www.wixapis.com'
const WIX_SITE_ID = process.env.WIX_SITE_ID || ''
const WIX_API_KEY = process.env.WIX_API_KEY || ''

export async function fetchFromWix<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    // Check if credentials are set
    if (!WIX_API_KEY || !WIX_SITE_ID) {
      console.error('Wix API credentials missing. Check WIX_API_KEY and WIX_SITE_ID in .env.local - wix-client.ts:16')
      return null
    }

    const url = `${WIX_API_URL}${endpoint}`
    
    console.log(`Fetching from Wix: ${url} - wix-client.ts:22`)
    console.log(`Site ID: ${WIX_SITE_ID?.substring(0, 8)}... - wix-client.ts:23`)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': WIX_API_KEY,
        'wix-site-id': WIX_SITE_ID,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Wix API error: ${response.status} ${response.statusText} - wix-client.ts:38`)
      console.error(`Error details: ${errorText} - wix-client.ts:39`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch from Wix: - wix-client.ts:46', error)
    return null
  }
}

// Blog posts - try Data API instead of CMS API
export async function getWixBlogPosts() {
  // Try multiple endpoints for compatibility
  const endpoints = [
    '/cms/v1/blog/posts',
    '/wix-data/v1/items/query',
    '/v1/blog/posts',
  ]
  
  for (const endpoint of endpoints) {
    console.log(`Trying endpoint: ${endpoint} - wix-client.ts:61`)
    const result = await fetchFromWix<{ posts?: WixBlogPost[]; dataItems?: any[] }>(endpoint, {
      method: endpoint.includes('query') ? 'POST' : 'GET',
      body: endpoint.includes('query') ? JSON.stringify({
        dataCollectionId: 'BlogPosts',
        query: {}
      }) : undefined
    })
    
    if (result && (result.posts || result.dataItems)) {
      console.log(`Success with endpoint: ${endpoint} - wix-client.ts:71`)
      return { posts: result.posts || result.dataItems || [] }
    }
  }
  
  return null
}

export async function getWixBlogPostBySlug(slug: string) {
  return fetchFromWix<{ post: WixBlogPost }>(`/cms/v1/blog/posts/${slug}`)
}

// Wix Data collections (for custom content)
export async function getWixCollectionItems(collectionName: string) {
  return fetchFromWix<{ items: any[] }>(`/cms/v1/collections/${collectionName}/items`)
}

// Types
export interface WixBlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  publishedDate: string
  modifiedDate?: string
  featuredImage?: {
    url: string
    alt?: string
  }
  author?: {
    id: string
    name: string
    bio?: string
    avatar?: string
  }
  categories?: string[]
  tags?: string[]
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'
}
