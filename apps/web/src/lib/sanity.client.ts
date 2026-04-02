import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'

function sanitizeEnvValue(value: string | undefined) {
  return value?.trim() || undefined
}

function isValidSanityProjectId(value: string | undefined): value is string {
  return Boolean(value && /^[a-z0-9-]+$/.test(value))
}

const projectId = sanitizeEnvValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
const dataset = sanitizeEnvValue(process.env.NEXT_PUBLIC_SANITY_DATASET) ?? 'production'
const apiVersion = sanitizeEnvValue(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? '2024-01-01'

export const config = {
  projectId,
  dataset,
  apiVersion,
}

export const hasValidSanityConfig = isValidSanityProjectId(projectId)

// Public, fast, cache-friendly client for published content.
// Safe to use in both Server and Client Components (no token).
export const sanityClient = hasValidSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

/**
 * Server-only client that automatically switches perspective based on Next.js draft mode.
 * - published mode: CDN on, no token
 * - draft mode: drafts perspective with read token
 */
export async function getSanityServerClient() {
  if (!hasValidSanityConfig) {
    return null
  }

  const { isEnabled } = await draftMode()

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !isEnabled,
    perspective: isEnabled ? 'drafts' : 'published',
    token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
  })
}
