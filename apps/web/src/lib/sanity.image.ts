import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { config } from './sanity.client'

const imageBuilder = createImageUrlBuilder(config)

/**
 * Build a Sanity image URL with the image-url builder.
 *
 * Usage: urlFor(post.mainImage).width(800).height(600).url()
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}
