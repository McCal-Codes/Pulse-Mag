# Pulse Magazine WordPress Workspace

This folder contains the isolated WordPress migration implementation for Pulse Magazine.

## Structure

- `theme/pulse-mag/` - custom block theme
- `plugins/pulse-mag-core/` - custom plugin for CPTs, taxonomies, meta, roles, and workflow defaults
- `plugins/pulse-seo/` - custom SEO plugin mirroring Vercel/Sanity metadata behavior
- `plugins/pulse-flipbook/` - custom issue flipbook plugin (PDF.js powered)
- `docs/` - migration, operations, QA, and handoff docs
- `data/` - WordPress WXR files for import: **Vercel-route parity seed** (`pulse-vercel-parity.WordPress.xml`, no PHP needed — import this file directly), and optional **site snapshot** (`pulseliterarymagazine.WordPress.2026-04-14.xml`)
- `tools/` - WP-CLI automation scripts for import/validation/cutover; `verify-php-plugins.ps1` checks PHP syntax when `php` is on PATH (or pass `-PhpPath`); `create-vercel-parity-pages.php` seeds pages matching Vercel routes (run with `--wp-path` to your Local `app\public` folder)

## Guardrails

- Changes in this workspace must not modify existing app files under:
  - `apps/web`
  - `apps/studio`

## Quick Start

1. Install WordPress in your local/staging environment.
2. Copy/symlink theme and plugin from this folder into `wp-content`.
3. Activate:
   - Theme: `Pulse Mag`
   - Plugin: `Pulse Mag Core`
4. From the repo root, import `wordpress/data/pulse-vercel-parity.WordPress.xml` (or the Hostinger snapshot) with `pwsh -File wordpress/tools/import-wxr.ps1` (see `docs/import-runbook.md`). PHP is not required for import.
5. Validate with `wordpress/tools/validate-import.ps1` and runbooks in `wordpress/docs/`.

## Staging still looks like Astra / a demo / not the Vercel layout?

The Hostinger-style site (page builders, imported starter templates) is **not** this theme. **Pulse Mag** must be the active theme, or you will keep seeing the old design.

1. Upload or sync `wordpress/theme/pulse-mag` into `wp-content/themes/pulse-mag`.
2. **Appearance → Themes → Activate** “Pulse Mag”. Deactivate builders/themes that override templates (e.g. Elementor canvas on the homepage).
3. **Settings → Reading**: set **Homepage** to a static page if you use the bundled front page template, or confirm **Your latest posts** if that matches your plan (the theme’s `front-page.html` applies when a static front page is assigned and that page uses the front-page template).
4. **Appearance → Editor**: confirm **Templates → Front Page** is the Pulse layout (welcome hero, issue query, news grid). Clear any host caching.

After activation, typography uses the Vercel-aligned serif stack with local/system fallbacks (no external Google Fonts dependency).

For a **classic → block** mental model and checklist (with external references), see `docs/classic-to-block-theme.md` — it summarizes [Jetpack’s block theme overview](https://jetpack.com/resources/wordpress-block-themes/) and [switching guide](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/) in Pulse-specific terms.

## Editorial Team Docs

- Daily writer/editor guide: `wordpress/docs/writer-editor-manual.md`
- Ops workflow baseline: `wordpress/docs/editorial-sop.md`
- GitHub release auto-updates (no ZIP imports): `wordpress/docs/github-auto-updates.md`

