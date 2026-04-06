---
name: commit-message
description: Generate conventional commit messages for Pulse-Mag monorepo
origin: ECC
---

# Conventional Commits

Generate commit messages following the Conventional Commits specification, tailored for Pulse-Mag's Next.js + Sanity monorepo structure.

## When to Use

- Staging changes with `git add`
- Preparing commit messages
- Writing PR descriptions

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Use For | Example |
|------|---------|---------|
| `feat` | New features | feat(web): add article carousel |
| `fix` | Bug fixes | fix(studio): resolve slug validation |
| `docs` | Documentation | docs: update README setup |
| `style` | Formatting | style(web): fix tailwind class order |
| `refactor` | Code restructuring | refactor(web): simplify data fetching |
| `perf` | Performance | perf(web): optimize image loading |
| `test` | Tests | test(web): add article page tests |
| `chore` | Maintenance | chore: update dependencies |
| `ci` | CI/CD | ci: add vercel deploy workflow |
| `content` | CMS content | content: add seed articles |

## Scopes

| Scope | Package | Examples |
|-------|---------|----------|
| `web` | apps/web | Components, pages, API routes |
| `studio` | apps/studio | Schemas, desk structure |
| `lib` | shared lib | Utilities, types, config |
| `deps` | dependencies | Package updates |
| *(none)* | root | Root-level changes |

## Examples

```
feat(web): add article detail page with portable text

- Add [slug]/page.tsx route
- Create PortableText component
- Add loading and error states

fix(studio): correct article preview selection

Preview now shows author name and cover image
properly instead of empty values.

refactor(web): extract article queries to lib/queries.ts

Centralize all GROQ queries for easier maintenance
and type generation.

content: add sample authors and articles

Seed data for development environment with
diverse content types.

chore(deps): bump next-sanity to 11.6.13

Resolves image URL builder type issues.
```

## Body Guidelines

- Use imperative mood ("add" not "added")
- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Separate paragraphs with blank lines

## Breaking Changes

```
feat(web)!: migrate to Next.js 15 App Router

BREAKING CHANGE: Pages Router support removed.
All routes must use App Router conventions.
```

## Co-authors

```
feat(web): implement real-time preview

Co-authored-by: Jane Doe <jane@example.com>
```
