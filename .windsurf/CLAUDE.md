# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project Overview

**Pulse-Mag** is a headless CMS magazine website built with:
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **CMS**: Sanity v3/v4 with custom schemas
- **Monorepo**: pnpm workspaces with `apps/web` and `apps/studio`

## Architecture

```
apps/
├── web/           # Next.js frontend (port 3000)
│   ├── src/       # App Router, components, lib
│   └── next.config.ts
└── studio/        # Sanity CMS (port 3333)
    └── schemas/   # Content types, documents, objects
```

## Key Commands

```bash
# Development (runs both)
pnpm dev                    # Concurrent web + studio
pnpm dev:web               # Web only
pnpm dev:studio            # Studio only

# Building
pnpm build                 # Build web
pnpm build:studio          # Build studio
pnpm build:web            # Alias for build

# Quality
pnpm lint                  # ESLint across repo
pnpm lint:fix              # Auto-fix
pnpm format                # Prettier write
pnpm format:check          # Prettier check
pnpm type-check            # TypeScript both packages
```

## Stack Details

| Package | Version | Notes |
|---------|---------|-------|
| Next.js | 15.3.8 | App Router, static export |
| React | 19.1.0 | Latest stable |
| Sanity | 3.75/4.22 | Studio v3, client v7 |
| Tailwind | 4.1.3 | PostCSS plugin |
| TypeScript | 5.7.3 | Strict mode |

## Development Notes

- **Package Manager**: pnpm 10.32.1 (enforced via packageManager field)
- **Node**: 24.x required
- **Peer deps**: Sanity allows React 18 || 19 (configured in root package.json)
- **Sentry**: Error tracking configured for web app
- **Vercel**: Deployment target for both apps

## Code Style

- **Formatting**: Prettier with import sorting (@ianvs/prettier-plugin-sort-imports)
- **Linting**: ESLint 9 with Next.js config, Prettier integration
- **Imports**: Sorted automatically (builtin → external → internal → sibling)
- **Types**: Strict TypeScript, noImplicitAny enabled

## Sanity Integration

- Client uses `@sanity/client` v7 with CDN distribution
- Images via `@sanity/image-url`
- Portable Text rendered with `@portabletext/react`
- Studio schemas define: articles, authors, categories, tags, pages

## Skills

Use these skills when working on related areas:

| Context | Skill |
|---------|-------|
| Next.js App Router | `/nextjs-app-router` |
| Sanity schemas | `/sanity-cms` |
| Tailwind v4 | `/tailwind-v4` |
| React Server Components | `/react-server-components` |

See `.windsurf/skills/` for detailed guidance.
