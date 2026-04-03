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
  "author": author->{ name, "slug": slug, image }
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

/** Single post by slug — includes full body */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
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

/** Used by generateStaticParams for /post/[slug] */
export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
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

/** Used by generateStaticParams for /author/[slug] */
export const allAuthorSlugsQuery = groq`
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
`

// ---------------------------------------------------------------------------
// Blog queries
// ---------------------------------------------------------------------------

/** Latest published blog post (for homepage) */
export const latestBlogPostQuery = groq`
  *[_type == "weeklyBlog" && isPublished == true] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    "author": author->{ name, "slug": slug }
  }
`

/** All published blog posts, newest first */
export const allBlogPostsQuery = groq`
  *[_type == "weeklyBlog" && isPublished == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    tags,
    "author": author->{ name, "slug": slug }
  }
`

/** Single blog post by slug — includes full content */
export const blogPostBySlugQuery = groq`
  *[_type == "weeklyBlog" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    slug,
    publishedAt,
    featuredImage,
    content,
    tags,
    "author": author->{ name, "slug": slug, image }
  }
`

/** Used by generateStaticParams for /blog/[slug] */
export const allBlogSlugsQuery = groq`
  *[_type == "weeklyBlog" && isPublished == true && defined(slug.current)]{ "slug": slug.current }
`
