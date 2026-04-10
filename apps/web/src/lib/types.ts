import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageSource } from '@/lib/sanity.image'

// ---------------------------------------------------------------------------
// Base Types
// ---------------------------------------------------------------------------

export interface Slug {
  current: string
}

export interface Author {
  _id: string
  name: string
  slug?: Slug
  image?: SanityImageSource
  role?: string
  bio?: string
  pronoun?: string
  lookingFor?: string
  twitter?: string
  website?: string
}

// ---------------------------------------------------------------------------
// Post Types
// ---------------------------------------------------------------------------

export interface Post {
  _id: string
  title: string
  slug: Slug
  excerpt?: string
  mainImage?: SanityImageSource
  publishedAt?: string
  body?: PortableTextBlock[]
  author?: Author
}

export type PostWithBody = Post & {
  body: PortableTextBlock[]
}

// ---------------------------------------------------------------------------
// Blog Types
// ---------------------------------------------------------------------------

export interface BlogPost {
  _id: string
  title: string
  slug: Slug
  excerpt?: string
  featuredImage?: SanityImageSource
  publishedAt: string
  tags?: string[]
  author?: Pick<Author, 'name' | 'slug'>
  content?: PortableTextBlock[]
}

// ---------------------------------------------------------------------------
// Event Types
// ---------------------------------------------------------------------------

export interface Event {
  _id: string
  title: string
  slug: Slug
  date: string
  location?: string
  description?: string
  link?: string
  image?: SanityImageSource
}

// ---------------------------------------------------------------------------
// Issue Types
// ---------------------------------------------------------------------------

export interface Issue {
  _id: string
  title: string
  slug: string
  season: string
  status: 'current' | 'upcoming' | 'archived'
  issueNumber?: number
  summary: string
  windowText?: string
  statusNote?: string
  pdfUrl?: string
  coverImage?: SanityImageSource
  publishedAt?: string
}

// ---------------------------------------------------------------------------
// Settings Types
// ---------------------------------------------------------------------------

export interface SiteSettings {
  welcomeText?: string
  editorQuote?: string
  editorQuoteAttribution?: string
  submissionWindowOpen?: string
  submissionWindowClose?: string
  instagramUrl?: string
  linkedinUrl?: string
  blueskyUrl?: string
  pinterestUrl?: string
  emailAddress?: string
}

export interface HomepageSettings {
  heroText?: string
  featuredPost?: Post
  featuredPosts?: Post[]
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

export type PortableTextValue = PortableTextBlock[]

// Helper type for GROQ query results with resolved references
export type Resolved<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends { _ref: string } | null | undefined
    ? NonNullable<T[P]>
    : T[P]
}
