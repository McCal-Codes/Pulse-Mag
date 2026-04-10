# Pulse-Mag Project Rules

> AI assistant working on Pulse-Mag should follow these conventions.

---

## Project Overview

**Pulse Literary & Arts Magazine** - Next.js 15 + React 19 + Sanity CMS + Tailwind CSS
- **Production**: https://pulseliterary.com
- **Repository**: `i:\Programing\Projects\Pulse-Mag`
- **Monorepo**: pnpm workspaces (`apps/web`, `apps/studio`)

---

## Code Patterns

### Data Fetching (Sanity)
```typescript
// Always use optional chaining with fallback
const posts = await sanityClient?.fetch<Post[]>(allPostsQuery) ?? []

// Revalidation settings
export const revalidate = 60  // Dynamic content (blog, events)
export const revalidate = 3600  // Static content (about, submit)
```

### Error Handling
```typescript
// Graceful fallbacks - never crash the page
const data = await fetchData().catch(() => fallbackData)
```

### Types & Interfaces
- Use types from `@/lib/types.ts`
- Extend Sanity types with `Resolved<T, K>` for dereferenced fields
- No `any` types (use `unknown` if necessary)

---

## File Organization

| Directory | Purpose |
|-----------|---------|
| `src/app/**/page.tsx` | Route pages |
| `src/components/*.tsx` | Shared components |
| `src/lib/queries.ts` | Sanity GROQ queries |
| `src/lib/types.ts` | TypeScript interfaces |
| `src/lib/sanity.client.ts` | Sanity client config |
| `src/styles/globals.css` | Tailwind theme + custom CSS |

---

## Styling Conventions

### Theme Tokens (Always use these)
```css
/* Brand Colors */
var(--color-ink)        /* #0B140E - Primary text */
var(--color-accent)     /* #3D1419 - Accent/maroon */
var(--color-nav)        /* #121B13 - Dark green */

/* Paper Tones */
var(--color-paper)      /* #F4F1EC - Background */
var(--color-paper-soft) /* #E8E5E0 - Secondary bg */

/* Fonts */
font-family: var(--font-display)  /* Playfair Display - headings */
font-family: var(--font-body)    /* Libre Baskerville - body */
```

### Tailwind Patterns
```tsx
// Container
className="mx-auto max-w-5xl px-6 py-14"

// Card
className="rounded-xl border border-black/10 bg-white/70 shadow-[0_8px_32px_-12px_rgba(158,114,114,0.2)]"

// Text hierarchy
className="font-display text-4xl tracking-tight text-ink"  /* H1 */
className="font-display text-2xl text-ink"                  /* H2 */
className="text-sm leading-7 text-gray-600"                /* Body */
```

---

## Content Architecture

### Content Types (Sanity)
| Type | Usage |
|------|-------|
| `weeklyBlog` | Blog posts (/blog, /blog/[slug]) |
| `event` | Events (/events) |
| `issue` | Magazine issues (/issues) |
| `author` | Team/staff (/about/team) |
| `homepageSettings` | Featured content (homepage) |
| `siteSettings` | Global config |

### Migration Status
- ✅ **Complete**: All content migrated from Wix to Sanity
- ✅ **Removed**: Wix code deleted (Phase 1 complete)
- ⏸️ **Deferred**: Image optimization (Phase 3 - after next deployment)

---

## Deployment Workflow

See `.planning/deployment-workflow.md` for full details.

**Quick Summary**:
```
dev → staging → main (never skip staging!)
```

**Pre-deploy checks**:
1. `pnpm type-check` passes
2. `pnpm lint` has < 100 errors  
3. `pnpm build:web` succeeds
4. Staging preview URL tested

---

## Environment Variables

### Required
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually "production" |
| `SANITY_API_READ_TOKEN` | Server-only token (Viewer role) |
| `SANITY_PREVIEW_SECRET` | For draft preview mode |
| `NEXT_PUBLIC_SITE_URL` | https://pulseliterary.com |
| `CLOUDINARY_CLOUD_NAME` | PDF flipbook images |
| `CLOUDINARY_API_KEY` | Cloudinary access |
| `CLOUDINARY_API_SECRET` | Server-only |

### Security Rules
- ✅ Use `NEXT_PUBLIC_` only for browser-safe values
- ❌ Never expose API keys, tokens, or secrets with `NEXT_PUBLIC_`
- ✅ Server-only vars: `SANITY_API_READ_TOKEN`, `CLOUDINARY_API_SECRET`

---

## Common Tasks

### Add New Page
1. Create `src/app/new-page/page.tsx`
2. Add metadata with `export const metadata: Metadata = {...}`
3. Set revalidate: `export const revalidate = 60`
4. Add to sitemap in `src/app/sitemap.ts`

### Add Sanity Query
1. Add GROQ query to `src/lib/queries.ts`
2. Update `src/lib/types.ts` if new fields
3. Use in page: `await sanityClient?.fetch(query) ?? fallback`

### Fix Build Error
1. `pnpm type-check` - find TypeScript errors
2. `rm -rf .next apps/web/.next` - clear cache if stale
3. Check for broken imports (especially after file moves)

---

## What NOT to Do

- ❌ Don't use Wix integration (code removed)
- ❌ Don't hardcode `localhost` references
- ❌ Don't commit `.env.local` (it's gitignored)
- ❌ Don't skip staging verification before production
- ❌ Don't use `console.log` in production code (use `console.error` for errors)

---

## Useful Commands

```bash
# Development
pnpm dev:web        # Start Next.js dev server
pnpm dev:studio     # Start Sanity Studio

# Quality checks
pnpm type-check     # TypeScript check
pnpm lint           # ESLint check
pnpm build:web      # Production build locally

# Deployment (see deployment-workflow.md)
git checkout staging && git merge dev && git push
git checkout main && git merge staging && git push
```

---

## Resources

- **Sanity Studio**: `apps/studio/` - Content management
- **Deployment Guide**: `.planning/deployment-workflow.md`
- **Cleanup Status**: `.planning/cleanup-plan.md`
- **Vercel Dashboard**: Check project settings online
