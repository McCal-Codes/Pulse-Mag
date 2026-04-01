import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
}

// Public, fast, cache-friendly client for published content.
// Safe to use in both Server and Client Components (no token).
export const sanityClient = createClient({
  ...config,
  useCdn: true,
  perspective: 'published',
})

/**
 * Server-only client that automatically switches perspective based on Next.js draft mode.
 * - published mode: CDN on, no token
 * - draft mode: drafts perspective with read token
 */
export async function getSanityServerClient() {
  const { isEnabled } = await draftMode()

  return createClient({
    ...config,
    useCdn: !isEnabled,
    perspective: isEnabled ? 'drafts' : 'published',
    token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
  })
}
