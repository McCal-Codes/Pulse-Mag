---
name: commit-message
description: Generate conventional commit messages for Pulse-Mag monorepo - tailored for Next.js + Sanity CMS projects with pnpm workspaces.
---

# Commit Message Generation for Pulse-Mag

Generate clear, conventional commit messages for this Next.js + Sanity CMS magazine monorepo.

## Quick Start

When you have staged changes:

```bash
git diff --cached --stat   # See what changed
git diff --cached          # See full diff
```

## Committing in Parts

To commit changes in logical groups (recommended for 5+ files):

```bash
# Stage specific directories

# 1. Sanity schemas first
git add apps/studio/
git commit -m "feat(studio): add event and siteSettings schemas"

# 2. Web app pages
git add apps/web/src/app/
git commit -m "feat(web): add events and join pages with styling"

# 3. Components
git add apps/web/src/components/
git commit -m "feat(ui): add DiamondDivider and update ArticleCard"

# 4. Lib and utilities
git add apps/web/src/lib/
git commit -m "refactor(lib): update queries for new schemas"

# 5. Styles and config
git add apps/web/src/styles/ .vscode/ .windsurf/
git commit -m "style(globals): update CSS and add dev configs"
```

**Key point**: `git commit` commits ALL staged files. Stage selectively to split commits.

## Commit Types by Change Pattern

| What Changed | Type | Example Message |
|--------------|------|-----------------|
| New feature/page | `feat` | `feat(issues): add issue archive page` |
| Bug fix | `fix` | `fix(api): resolve Sanity client error` |
| Documentation | `docs` | `docs(readme): update setup instructions` |
| Code refactoring | `refactor` | `refactor(queries): extract shared filters` |
| Performance | `perf` | `perf(images): optimize Sanity image loading` |
| Tests | `test` | `test(components): add ArticleCard tests` |
| Dependencies/build | `chore` | `chore(deps): update Next.js to 15.4` |
| Style/formatting | `style` | `style(css): fix Tailwind class order` |
| CI/CD | `ci` | `ci(vercel): add deploy preview config` |
| Sanity schema change | `schema` | `schema(article): add author reference` |

## Scope Selection for Pulse-Mag

Choose scope based on file paths in this monorepo:

| Files In | Scope | Example |
|----------|-------|---------|
| `apps/web/src/app/` | `web` or route name | `feat(web): add submit page` |
| `apps/web/src/app/about/` | `about` | `fix(about): update team section` |
| `apps/web/src/app/blog/` | `blog` | `feat(blog): add pagination` |
| `apps/web/src/app/author/` | `author` | `feat(author): add bio page` |
| `apps/web/src/app/events/` | `events` | `feat(events): add event calendar` |
| `apps/web/src/app/issues/` | `issues` | `feat(issues): add archive view` |
| `apps/web/src/app/join/` | `join` | `fix(join): correct form validation` |
| `apps/web/src/app/post/` | `post` | `feat(post): add related articles` |
| `apps/web/src/app/submit/` | `submit` | `feat(submit): add file upload` |
| `apps/web/src/api/` | `api` | `fix(api): handle webhook errors` |
| `apps/web/src/components/` | `ui` or component | `feat(ui): add DiamondDivider` |
| `apps/web/src/lib/` | `lib` or `queries` | `refactor(queries): simplify article fetch` |
| `apps/web/src/styles/` | `styles` | `style(styles): update globals` |
| `apps/studio/schemas/` | `schema` | `schema(article): add featured flag` |
| `apps/studio/` | `studio` | `chore(studio): update Sanity config` |
| `scripts/` | `scripts` | `feat(scripts): add model installer` |
| Root config | `config` | `chore(config): update pnpm-workspace` |
| Multiple areas | `*` or none | `feat: implement search across site` |

## Description Rules

- **Imperative mood**: "add" not "added", "fix" not "fixed"
- **No period**: End description without punctuation
- **Be specific**: `update component` → `add hover states to ArticleCard`
- **50 char max**: Keep subject line concise
- **What, not why**: Describe the change, not the motivation

## Quick Decision Tree

```
New page or feature? → feat
Fixing a bug? → fix
Documentation only? → docs
Improving load times? → perf
Restructuring code? → refactor
Adding tests? → test
Updating deps/pnpm? → chore
CSS/Tailwind changes? → style
Vercel/CI changes? → ci
Sanity content model? → schema
```

## Real Examples for This Repo

### Example 1: New component
```bash
git diff --cached --stat
# apps/web/src/components/ArticleCard.tsx | 85 +++++++++++++++++
```
**Analysis**: New component for article display
**Message**:
```
feat(ui): add ArticleCard component

- Display article thumbnail with Sanity image URL
- Show title, excerpt, and publication date
- Add hover animation for engagement
```

### Example 2: Sanity schema update
```bash
git diff --cached --stat
# apps/studio/schemas/article.ts | 25 +++++
```
**Analysis**: Adding field to article schema
**Message**:
```
schema(article): add featured boolean field

Enable editors to mark articles as featured for homepage
```

### Example 3: Bug fix in lib
```bash
git diff --cached --stat
# apps/web/src/lib/sanity.client.ts | 8 +++---
```
**Analysis**: Fix to Sanity client configuration
**Message**:
```
fix(lib): resolve client initialization error

Add fallback for missing SANITY_API_TOKEN env var
```

### Example 4: Page update
```bash
git diff --cached --stat
# apps/web/src/app/about/page.tsx | 45 +++++++++
```
**Analysis**: Updates to about page content
**Message**:
```
feat(about): add team member bios section

- Grid layout for team photos
- Modal for detailed bio view
```

### Example 5: Query optimization
```bash
git diff --cached --stat
# apps/web/src/lib/queries.ts | 30 +++++
```
**Analysis**: Groq query improvements
**Message**:
```
perf(queries): optimize article list fetch

Add projection to reduce payload size by 40%
```

### Example 6: Dependency update
```bash
git diff --cached --stat
# apps/web/package.json | 5 +++--
# pnpm-lock.yaml | 120 +++++++++
```
**Analysis**: Package updates
**Message**:
```
chore(deps): update Sanity packages to v4.22

- @sanity/client 7.20.0
- next-sanity 11.6.12
```

### Example 7: New API route
```bash
git diff --cached --stat
# apps/web/src/app/api/webhook/route.ts | 60 +++++++++
```
**Analysis**: New webhook handler
**Message**:
```
feat(api): add Sanity webhook handler

- Validate webhook signature
- Trigger ISR revalidation on publish
```

### Example 8: Style changes
```bash
git diff --cached --stat
# apps/web/src/app/globals.css | 20 +++
```
**Analysis**: CSS updates
**Message**:
```
style(globals): add custom typography scale

Define font sizes for article headings and body text
```

## Templates

### Simple Change (1 file)
```
<type>(<scope>): <what changed>
```
Example: `fix(ui): correct Navigation active state`

### Medium Change (2-5 files)
```
<type>(<scope>): <summary>

- <change detail 1>
- <change detail 2>
```
Example:
```
feat(issues): add pagination to archive

- Add page param handling in fetchIssues
- Create Pagination component
- Update issues page layout
```

### Cross-App Changes
```
<type>: <summary>

<app-specific changes>
```
Example:
```
feat: implement author profile system

Web:
- Add author page with bio and articles
- Link author names to profile pages

Studio:
- Add author schema with photo and bio fields
- Create author document type
```

### Breaking Change
```
<type>(<scope>)!: <summary>

BREAKING CHANGE: <description>
```
Example:
```
feat(queries)!: migrate to Sanity Perspectives

BREAKING CHANGE: Requires SANITY_API_VERSION="vX"
Update environment variables for all deployments
```

## Common Mistakes

| Bad | Good | Why |
|-----|------|-----|
| `updated the about page` | `feat(about): add team section` | Imperative, specific |
| `fixed bug.` | `fix(api): handle null response` | No period, specific |
| `css changes` | `style(globals): update color tokens` | Descriptive scope |
| `WIP on sanity` | `schema(article): add category field` | Clear intent |
| `stuff` | `refactor(lib): extract image helpers` | Specific what |
| `test` | `test(components): verify ArticleCard render` | Descriptive scope |

## One-Shot Command

```bash
git diff --cached --stat && echo "---" && git diff --cached
```

Use this output with the skill to generate your message.
