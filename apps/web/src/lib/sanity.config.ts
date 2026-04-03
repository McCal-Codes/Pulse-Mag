// Client-safe Sanity config — no next/headers import.
// Use this in Client Components and in sanity.image.ts.

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
