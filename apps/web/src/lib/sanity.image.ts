import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { config, hasValidSanityConfig } from './sanity.config'

/**
 * Build a Sanity image URL with the image-url builder.
 *
 * Usage: urlFor(post.mainImage).width(800).height(600).url()
 */
export function urlFor(source: SanityImageSource) {
  if (!hasValidSanityConfig || !config.projectId) {
    throw new Error('Sanity image configuration is missing')
  }

  return createImageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  }).image(source)
}

/** Alias for urlFor — used in client components */
export const urlForImage = urlFor

export type { SanityImageSource }
