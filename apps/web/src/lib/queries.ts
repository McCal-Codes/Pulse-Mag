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
  "author": author->{ name, "slug": slug, image },
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

/** Author profile by slug — includes bio and social links */
export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    role,
    bio,
    twitter,
    website
  }
`

/** All posts by a given author (matched by _id) */
export const postsByAuthorQuery = groq`
  *[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
    ${postFields}
  }
`

/** Latest published weekly blog */
export const latestWeeklyBlogQuery = groq`
  *[_type == "weeklyBlog" && isPublished == true] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    weekNumber,
    year,
    featuredImage
  }
`

/** All open issues accepting submissions */
export const openIssuesQuery = groq`
  *[_type == "issue" && defined(slug.current)] | order(issueNumber desc) {
    _id,
    title,
    slug,
    issueNumber,
    description,
    publishedAt,
    coverImage
  }
`

/** Used by generateStaticParams for /author/[slug] */
export const allAuthorSlugsQuery = groq`
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
`
