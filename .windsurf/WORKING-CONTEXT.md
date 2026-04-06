# WORKING-CONTEXT.md

Last updated: 2026-04-06

## Purpose

Track active work, blockers, and next steps for Pulse-Mag development.

## Current Truth

- Default branch: `main`
- Monorepo structure stable (apps/web + apps/studio)
- Both apps deploy to Vercel
- Sentry monitoring active on web app

## Current Constraints

- React version mismatch: web uses React 19, studio uses React 18
- Studio pinned to Sanity v3 (v4 available for client packages)
- No automated tests currently configured

## Active Queues

### Product
- [ ] Content modeling refinements
- [ ] Article publishing workflow
- [ ] SEO optimization

### Technical
- [ ] Add test suite (Vitest + React Testing Library)
- [ ] Storybook for component documentation
- [ ] CI/CD pipeline (GitHub Actions)

### Content
- [ ] Seed data for development
- [ ] Sample articles and authors

## Completed Recently

- [x] Initial monorepo setup with pnpm workspaces
- [x] Next.js 15 + React 19 migration
- [x] Tailwind CSS 4 upgrade
- [x] Sentry integration
- [x] Sanity client integration
- [x] **Repository audit with ECC standards** (Grade B+)
- [x] **Fixed type duplication** - Created `src/lib/types.ts` with shared types
- [x] **Added error boundaries** - Created `error.tsx` and `global-error.tsx`
- [x] **Built custom PortableText component** - Proper types, custom serializers

## Update Rule

Keep this file focused on current sprint and blockers. Archive completed work to CHANGELOG.md once no longer shaping execution.
