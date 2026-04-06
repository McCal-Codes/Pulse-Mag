---
name: nextjs-app-router
description: Best practices for Next.js 15 App Router with React 19
origin: ECC
---

# Next.js 15 App Router

Guidance for building with Next.js 15 App Router, React 19, and Tailwind CSS 4.

## When to Use

- Creating new routes in `apps/web/src/app/`
- Working with React Server Components
- Implementing data fetching patterns
- Configuring caching and revalidation

## Key Patterns

### Route Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home route
├── layout.types.ts     # Shared types
├── globals.css         # Global styles
├── (routes)/           # Route groups (no URL segment)
│   └── blog/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
└── api/                # Route handlers
    └── route.ts
```

### Server Components (Default)

Use Server Components for:
- Data fetching
- Database queries
- CMS integration (Sanity)
- Static rendering

```tsx
// app/page.tsx - Server Component by default
import { sanityClient } from '@/lib/sanity'

export default async function HomePage() {
  const articles = await sanityClient.fetch(`*[_type == "article"]`)

  return (
    <main>
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </main>
  )
}
```

### Client Components

Mark explicitly with `'use client'` for:
- Browser APIs
- React hooks (useState, useEffect)
- Event handlers
- Client-side libraries

```tsx
'use client'

import { useState } from 'react'

export function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      {likes} likes
    </button>
  )
}
```

### Data Fetching

Use async/await directly in Server Components:

```tsx
// Cache by default, revalidate hourly
export const revalidate = 3600

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  return <div>{json.title}</div>
}
```

For Sanity specifically, use the cached client:

```tsx
import { sanityClient } from '@/lib/sanity'

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0]`,
    { slug }
  )

  if (!article) {
    notFound()
  }

  return <Article content={article} />
}
```

### Error Handling

Use `notFound()` for 404s, `error.tsx` for error boundaries:

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}
```

## Caching Strategy

| Approach | Use For | Example |
|----------|---------|---------|
| `fetch()` with `cache: 'force-cache'` | Static data | Blog posts |
| `fetch()` with `revalidate: N` | Semi-dynamic | Article feed |
| `fetch()` with `cache: 'no-store'` | Real-time | User dashboard |
| `sanityClient.fetch()` with `next: { revalidate: N }` | CMS content | Sanity articles |

## Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  // Use slug for data fetching
}

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type == "article"]{ "slug": slug.current }`)
  return slugs.map((s) => ({ slug: s.slug }))
}
```

## Metadata

Export `metadata` object or `generateMetadata` function:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pulse Magazine',
  description: 'Curated stories that matter',
  openGraph: {
    images: ['/og-image.jpg']
  }
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  return {
    title: article.title,
    description: article.excerpt
  }
}
```

## Best Practices

1. **Keep Server Components as default** - Only use `'use client'` when needed
2. **Fetch data in the component that uses it** - Let Next.js deduplicate requests
3. **Use TypeScript strictly** - Enable all strict flags
4. **Leverage parallel fetching** - Fetch unrelated data in parallel
5. **Handle errors at boundaries** - Use error.tsx for graceful degradation
