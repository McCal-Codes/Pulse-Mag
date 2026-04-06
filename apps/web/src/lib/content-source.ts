// lib/content-source.ts
// This abstraction lets you switch between Sanity and WordPress without changing components

export type ContentSource = 'sanity' | 'wordpress'

const CURRENT_SOURCE: ContentSource = process.env.CONTENT_SOURCE as ContentSource || 'sanity'

export function getContentSource(): ContentSource {
  return CURRENT_SOURCE
}

export function isWordPress(): boolean {
  return CURRENT_SOURCE === 'wordpress'
}

export function isSanity(): boolean {
  return CURRENT_SOURCE === 'sanity'
}

// Usage in components:
// import { isWordPress } from '@/lib/content-source'
// const client = isWordPress() ? wordpressClient : sanityClient
