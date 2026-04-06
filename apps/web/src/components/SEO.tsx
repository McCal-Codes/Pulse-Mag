import type { Metadata } from 'next'

interface PageSEOProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
  author?: string
  image?: string
  keywords?: string[]
}

export function generateSEO({
  title,
  description,
  path,
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  image,
  keywords = [],
}: PageSEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulsemag.org'
  const fullUrl = `${siteUrl}${path}`
  const imageUrl = image || `${siteUrl}/og-image.jpg`

  return {
    title: `${title} | Pulse Literary & Arts Magazine`,
    description,
    keywords: ['literary magazine', 'arts', 'student publication', 'Point Park University', ...keywords],
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type,
      siteName: 'Pulse Literary & Arts Magazine',
      title,
      description,
      url: fullUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@pulsemag',
      creator: author ? `@${author.replace(/\s+/g, '').toLowerCase()}` : '@pulsemag',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// JSON-LD Structured Data Components
export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pulse Literary & Arts Magazine',
    alternateName: 'Pulse Magazine',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pulsemag.org',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pulsemag.org'}/logo.png`,
    },
    sameAs: [
      'https://instagram.com/pulselitmag',
      'https://twitter.com/pulsemag',
    ],
    description: 'Annual multimedia literary and arts magazine led by students at Point Park University.',
    foundingDate: '2024',
    memberOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Point Park University',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface ArticleStructuredDataProps {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  modifiedAt?: string
  authorName: string
  authorUrl?: string
  category?: string
}

export function ArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedAt,
  modifiedAt,
  authorName,
  authorUrl,
  category = 'Literature',
}: ArticleStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    url,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pulse Literary & Arts Magazine',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pulsemag.org'}/logo.png`,
      },
    },
    articleSection: category,
    inLanguage: 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface WebPageStructuredDataProps {
  title: string
  description: string
  url: string
  image?: string
  modifiedAt?: string
}

export function WebPageStructuredData({
  title,
  description,
  url,
  image,
  modifiedAt,
}: WebPageStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    image: image ? {
      '@type': 'ImageObject',
      url: image,
    } : undefined,
    dateModified: modifiedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Pulse Literary & Arts Magazine',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
