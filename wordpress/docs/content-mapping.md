# Pulse Magazine Content Mapping

This document maps existing content concepts and WXR entities to the new WordPress-native model.

## Source Inputs

- WXR **Vercel parity seed** (checked in, no PHP required): `wordpress/data/pulse-vercel-parity.WordPress.xml`
- WXR **site snapshot** (optional): `wordpress/data/pulseliterarymagazine.WordPress.2026-04-14.xml`
- Existing app references:
  - `apps/studio/schemas`
  - `apps/web/src/app`
  - `apps/web/src/lib/types.ts`

## Existing Content Concepts (Reference)

- `issue` (title, season, status, issueNumber, summary, windowText, statusNote, pdfFile, coverImage, publishedAt)
- `weeklyBlog` (title, slug, publishedAt, author, featuredImage, excerpt, content, tags, isPublished)
- `event` (title, slug, date, location, description, link, image)
- `author` (name, slug, image, role, bio, links)
- Static pages (`about`, `join`, `submit`, landing pages)

## Target WordPress Model

### Post Types

- `post` (native): editorial/blog content migrated from `weeklyBlog`
- `page` (native): static pages (`about`, `join`, `submit`, info pages)
- `issue` (custom): magazine issue catalog and CTA details
- `event` (custom): events and deadlines
- `author_profile` (custom, optional): only if editor profiles should be independent from WP users

### Taxonomies

- `category` (native): broad editorial categories
- `post_tag` (native): tags for blog posts
- `section` (custom): magazine sections (poetry, prose, visual art, etc.)
- `issue_volume` (custom): seasonal/volume grouping
- `topic` (custom): thematic descriptors used across post types

### Meta Fields

- `issue`
  - `_pulse_issue_season`
  - `_pulse_issue_status` (`current`, `upcoming`, `archived`)
  - `_pulse_issue_number`
  - `_pulse_issue_summary`
  - `_pulse_issue_window_text`
  - `_pulse_issue_status_note`
  - `_pulse_issue_pdf_url`
- `event`
  - `_pulse_event_date`
  - `_pulse_event_location`
  - `_pulse_event_link`
  - `_pulse_event_summary`

## WXR Import Mapping Rules

- WXR `post` -> WP `post`
- WXR `page` -> WP `page`
- WXR `attachment` -> WP media library attachment
- Imported categories/tags -> native `category` and `post_tag`
- Imported authors -> map by email/login to existing users; create missing users as editor-contributor accounts

## Open Mapping Decisions

- Keep `author_profile` CPT only if editorial team needs profile pages separate from WP user profiles.
- If WXR contains custom post types from old plugins/themes, map unknown types into:
  - nearest supported CPT (`issue`, `event`) when fields align, or
  - draft `post` with `_pulse_legacy_type` meta for manual review.

## Freeze and Cutover Policy

- During final sync window:
  - no schema field changes
  - no menu structure overhauls
  - no permalink changes
- Delta import should only include newly published or modified content since the previous dry-run import.