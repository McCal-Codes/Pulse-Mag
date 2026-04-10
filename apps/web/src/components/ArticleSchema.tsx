import type { BlogPost } from '@/lib/types'
import { urlFor } from '@/lib/sanity.image'

interface ArticleSchemaProps {
  post: BlogPost
  url: string
}

export function ArticleSchema({ post, url }: ArticleSchemaProps) {
  // Get image URL from Sanity image source
  const imageUrl = post.featuredImage 
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : 'https://pulseliterary.com/logo.png'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt?.slice(0, 160) || 'Read the latest from Pulse Magazine.',
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Pulse Magazine',
      url: 'https://pulseliterary.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pulseliterary.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
