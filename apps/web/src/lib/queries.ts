import { groq } from 'next-sanity'

// ---------------------------------------------------------------------------
// Reusable field fragment — keeps queries DRY without a heavy abstraction
// ---------------------------------------------------------------------------
const postFields = groq`
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  "author": author->{ name, slug, image },
  "categories": categories[]->{ title, slug }
`

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** All published posts, newest first */
export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${postFields}
  }
`

/** Single post by slug — includes full body and issue reference */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body,
    "issue": issue->{ title, issueNumber, slug }
  }
`

/** Homepage settings singleton — resolves references inline */
export const homepageSettingsQuery = groq`
  *[_type == "homepageSettings"][0] {
    heroText,
    "featuredPost": featuredPost->{ ${postFields} },
    "featuredPosts": featuredPosts[]->{ ${postFields} }
  }
`

/** All posts in a given category (matched by slug) */
export const postsByCategoryQuery = groq`
  *[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
    ${postFields}
  }
`

/** Used by generateStaticParams for /post/[slug] */
export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`

/** Used by generateStaticParams for /category/[slug] */
export const allCategorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`

/** Category metadata by slug — used by generateMetadata */
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    title,
    description
  }
`
