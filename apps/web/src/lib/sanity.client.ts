import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'
import { config, hasValidSanityConfig } from './sanity.config'

function sanitizeEnvValue(value: string | undefined) {
  return value?.trim() || undefined
}

function isValidSanityProjectId(value: string | undefined): value is string {
  return Boolean(value && /^[a-z0-9-]+$/.test(value))
}

const serverProjectId = sanitizeEnvValue(process.env.SANITY_PROJECT_ID) ?? config.projectId
const serverDataset = sanitizeEnvValue(process.env.SANITY_DATASET) ?? config.dataset

const hasValidServerSanityConfig = isValidSanityProjectId(serverProjectId)

// Re-export for convenience
export { config, hasValidSanityConfig }

// Public, fast, cache-friendly client for published content.
// Safe to use in both Server and Client Components (no token).
export const sanityClient = hasValidSanityConfig
  ? createClient({
      projectId: config.projectId!,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
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
  if (!hasValidServerSanityConfig) {
    return null
  }

  const { isEnabled } = await draftMode()

  return createClient({
    projectId: serverProjectId!,
    dataset: serverDataset,
    apiVersion: config.apiVersion,
    useCdn: !isEnabled,
    perspective: isEnabled ? 'drafts' : 'published',
    token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
  })
}

type SanityFetchClient = {
  fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>
}

export async function safeSanityFetch<T>(
  client: SanityFetchClient | null,
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
) {
  if (!client) {
    return fallback
  }

  try {
    return await client.fetch<T>(query, params)
  } catch {
    return fallback
  }
}
