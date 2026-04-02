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
const serverProjectId = sanitizeEnvValue(process.env.SANITY_PROJECT_ID) ?? projectId
const serverDataset = sanitizeEnvValue(process.env.SANITY_DATASET) ?? dataset
const apiVersion = sanitizeEnvValue(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? '2024-01-01'

export const config = {
  projectId,
  dataset,
  apiVersion,
}

export const hasValidSanityConfig = isValidSanityProjectId(projectId)
const hasValidServerSanityConfig = isValidSanityProjectId(serverProjectId)

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
  if (!hasValidServerSanityConfig) {
    return null
  }

  const { isEnabled } = await draftMode()

  return createClient({
    projectId: serverProjectId,
    dataset: serverDataset,
    apiVersion,
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
