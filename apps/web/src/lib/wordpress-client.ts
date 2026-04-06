// lib/wordpress-client.ts
// WordPress GraphQL client - connects to existing WP site
// Site: https://mediumaquamarine-dog-147416.hostingersite.com/

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://mediumaquamarine-dog-147416.hostingersite.com/graphql'

interface WPGraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function fetchFromWP<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    const response = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`WP GraphQL error: ${response.status}`)
    }

    const json: WPGraphQLResponse<T> = await response.json()
    
    if (json.errors) {
      console.error('WP GraphQL errors:', json.errors)
      return null
    }

    return json.data || null
  } catch (error) {
    console.error('Failed to fetch from WordPress:', error)
    return null
  }
}

// Example query for posts
export const getAllPostsQuery = `
  query GetAllPosts {
    posts(first: 100) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            slug
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`

export const getPostBySlugQuery = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
          slug
          description
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`
