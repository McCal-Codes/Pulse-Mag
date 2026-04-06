# Pulse-Mag

A modern headless CMS magazine built with Next.js 15, React 19, and Sanity.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **CMS**: [Sanity](https://www.sanity.io/) v3/v4 with custom schemas
- **Monorepo**: pnpm workspaces
- **Deployment**: [Vercel](https://vercel.com/)
- **Monitoring**: [Sentry](https://sentry.io/)

## Quick Start

### Prerequisites

- Node.js 24.x
- pnpm 10.x (`corepack enable` or `npm i -g pnpm`)

### Setup

```bash
# 1. Clone and install
pnpm install

# 2. Configure environment
cp apps/web/.env.local.example apps/web/.env.local
# Edit with your Sanity project ID and dataset

# 3. Start development
pnpm dev
```

This runs both apps concurrently:
- **Web**: http://localhost:3000 (Next.js frontend)
- **Studio**: http://localhost:3333 (Sanity CMS)

## Project Structure

```
pulse-mag/
├── apps/
│   ├── web/                 # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/        # App Router pages
│   │   │   ├── components/ # React components
│   │   │   └── lib/        # Utilities, Sanity client
│   │   └── package.json
│   └── studio/              # Sanity CMS
│       ├── schemas/        # Content models
│       └── sanity.config.ts
├── .windsurf/              # AI assistant context
│   ├── CLAUDE.md          # Project guidance
│   ├── WORKING-CONTEXT.md # Active work tracking
│   └── skills/            # Knowledge modules
└── package.json           # Root workspace config
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run web + studio concurrently |
| `pnpm dev:web` | Web app only |
| `pnpm dev:studio` | Sanity studio only |
| `pnpm build` | Build web app |
| `pnpm build:studio` | Build studio |
| `pnpm lint` | ESLint check |
| `pnpm format` | Prettier format |
| `pnpm type-check` | TypeScript check both packages |

## Environment Variables

### apps/web/.env.local

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_token
```

### apps/studio/.env

```
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

## Content Model

### Documents

- **Article** - Magazine articles with rich content, images, authors
- **Author** - Writers with bio, avatar, social links
- **Category** - Taxonomy for organizing articles
- **Tag** - Flexible tagging system
- **Page** - Static pages (about, contact, etc.)

### Key Features

- **Portable Text** - Rich content with images, code blocks, embeds
- **Image Pipeline** - Automatic optimization with hotspot/crop
- **References** - Linked authors, categories, tags
- **Previews** - Real-time draft preview in Studio

## Development

### Using Skills

This repo includes Windsurf/Claude skills for consistent development:

- `/nextjs-app-router` - Next.js 15 App Router patterns
- `/sanity-cms` - Sanity schema and query patterns
- `/commit-message` - Conventional commit format

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with import sorting
- **Linting**: ESLint with Next.js config
- **Commits**: Conventional commits (`feat:`, `fix:`, etc.)

## Deployment

### Vercel

Both apps deploy to Vercel:

1. **Web**: Production build with static export
2. **Studio**: Serverless deployment

Configure environment variables in Vercel dashboard.

### Manual Deploy

```bash
# Deploy studio
pnpm --filter studio deploy

# Build web
pnpm build
# Upload dist to hosting
```

## Documentation

- [CLAUDE.md](.windsurf/CLAUDE.md) - AI assistant context and conventions
- [WORKING-CONTEXT.md](.windsurf/WORKING-CONTEXT.md) - Active work tracking
- [Skill: Next.js App Router](.windsurf/skills/nextjs-app-router/SKILL.md)
- [Skill: Sanity CMS](.windsurf/skills/sanity-cms/SKILL.md)

## License

Private - All rights reserved.