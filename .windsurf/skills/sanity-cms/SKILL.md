---
name: sanity-cms
description: Working with Sanity CMS v3/v4 - schemas, queries, and studio
origin: ECC
---

# Sanity CMS

Guidance for Sanity headless CMS integration in Pulse-Mag.

## When to Use

- Defining content schemas in `apps/studio/schemas/`
- Writing GROQ queries for data fetching
- Configuring the Sanity Studio
- Setting up image rendering and Portable Text

## Architecture

```
apps/studio/
├── sanity.config.ts    # Studio configuration
├── sanity.cli.ts       # CLI configuration
└── schemas/
    ├── index.ts        # Schema exports
    ├── documents/      # Top-level types (article, author, page)
    └── objects/        # Reusable objects (blockContent, imageWithCaption)

apps/web/src/
└── lib/
    └── sanity.ts       # Client configuration
```

## Schema Patterns

### Document Types

```typescript
// schemas/documents/article.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent'  // Custom object type
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'imageWithCaption'  // Custom object type
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage'
    },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: author ? `by ${author}` : '',
        media
      }
    }
  }
})
```

### Object Types

```typescript
// schemas/objects/blockContent.ts
import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true }
    }),
    defineArrayMember({
      type: 'code'
    })
  ]
})
```

## Client Configuration

```typescript
// apps/web/src/lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,  // Use CDN for published content
  perspective: 'published'  // Only fetch published documents
})

// For preview mode (drafts)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts'
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}
```

## GROQ Queries

### Common Patterns

```typescript
// Fetch all published articles
const allArticles = await sanityClient.fetch(`
  *[_type == "article" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    "author": author->{ name, slug },
    publishedAt
  }
`)

// Single article with full content
const article = await sanityClient.fetch(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        "dimensions": asset->metadata.dimensions
      }
    },
    "coverImage": coverImage {
      asset->,
      caption
    },
    "author": author->{ name, bio, "image": image.asset->url },
    "tags": tags[]->{ name, slug },
    publishedAt
  }
`, { slug: params.slug })

// Fetch articles by tag
const taggedArticles = await sanityClient.fetch(`
  *[_type == "article" && $tag in tags[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt
  }
`, { tag: params.tag })

// Pagination
const paginated = await sanityClient.fetch(`
  *[_type == "article" && defined(publishedAt)] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug
  }
`, { start: 0, end: 10 })
```

## Portable Text Rendering

```tsx
// components/PortableText.tsx
'use client'

import { PortableText as PortableTextComponent } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

const components = {
  types: {
    image: ({ value }) => {
      return (
        <Image
          src={urlFor(value).width(800).height(500).url()}
          alt={value.alt || ''}
          width={800}
          height={500}
          className="rounded-lg"
        />
      )
    },
    code: ({ value }) => {
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{value.code}</code>
        </pre>
      )
    }
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    )
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      const target = !value.href.startsWith('/') ? '_blank' : undefined
      return (
        <a href={value.href} rel={rel} target={target} className="underline text-blue-600">
          {children}
        </a>
      )
    }
  }
}

export function PortableText({ value }) {
  return <PortableTextComponent value={value} components={components} />
}
```

## Image Handling

```tsx
// components/SanityImage.tsx
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface SanityImageProps {
  image: any
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function SanityImage({
  image,
  alt,
  width = 800,
  height = 500,
  className,
  priority
}: SanityImageProps) {
  if (!image?.asset) {
    return null
  }

  const imageUrl = urlFor(image).width(width).height(height).auto('format').url()

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
```

## Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01

# Server-only
SANITY_API_READ_TOKEN=your_read_token_for_previews
```

## Best Practices

1. **Use `defineType` and `defineField`** - Enables better TypeScript support
2. **Preview selections** - Always configure `preview` for better Studio UX
3. **Use references** - Link authors, tags as references, not embedded objects
4. **Hotspot images** - Enable `hotspot: true` for responsive cropping
5. **CDN for published** - Use `useCdn: true` for production reads
6. **Perspective API** - Use `'published'` for public, `'previewDrafts'` for drafts
7. **Image optimization** - Use `.auto('format')` for WebP/AVIF
8. **Revalidation** - Set appropriate `next: { revalidate }` for freshness
