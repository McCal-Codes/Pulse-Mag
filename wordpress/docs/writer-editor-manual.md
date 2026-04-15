# Pulse Writer + Editor Manual

This is the day-to-day guide for editorial staff publishing in the WordPress site.

## Who this is for

- Writers submitting drafts
- Section editors reviewing content
- Managing editors scheduling and publishing

## Quick roles

- Writer: drafts content and responds to edits
- Editor: reviews quality, readiness, and SEO fields
- Publisher/Admin: final publish authority and release checks

## What to publish where

- `Post` = Pulse News article (`/blog/`)
- `Issue` = annual issue entry (`/issues/`)
- `Event` = readings/workshops/calendar items (`/events/`)
- `Page` = evergreen pages (`/about/`, `/submit/`, `/join/`)

## Writer workflow (every draft)

1. Go to **Dashboard -> Posts** (or **Issues/Events**) and click **Add New**.
2. Add:
   - clear headline
   - short excerpt/summary
   - featured image (with alt text)
   - body content using existing patterns/blocks only
3. Complete sidebar settings:
   - category/section (if applicable)
   - tags (only meaningful tags)
4. In **Pulse SEO** box:
   - optional SEO title override (keep concise)
   - optional SEO description override
   - noindex only if instructed by editor
5. Click **Save Draft**, then notify editor for review.

## Editor review checklist (before publish)

- Title is specific and readable (no clickbait, no all-caps)
- Excerpt matches article intent and tone
- Featured image is present, appropriate, and has alt text
- Internal links work and open correctly
- Dates, names, and credits are accurate
- Pulse SEO fields are sensible:
  - title not overlong
  - description clear and human-readable
  - noindex only when intended
- Content appears correctly in preview

## Issue publishing workflow

1. Open **Issues -> Add New**.
2. Fill required issue fields in meta boxes:
   - season
   - issue status (`upcoming`, `current`, `archived`)
   - issue number
   - summary
   - PDF URL
3. Add cover image and alt text.
4. Status transitions:
   - new issue starts as `upcoming`
   - on launch day set new issue to `current`
   - set previous `current` issue to `archived`
5. Publish and verify:
   - issue appears in `/issues/`
   - issue detail page loads correctly

## Event publishing workflow

1. Open **Events -> Add New**.
2. Add event date, location, and RSVP/link fields.
3. Add short summary + featured image.
4. Publish and verify event appears in `/events/`.

## Scheduling and release

1. Use **Publish -> Immediately -> Schedule** for timed releases.
2. After publish, run a 2-minute smoke check:
   - page URL loads
   - appears in archive
   - header/footer navigation works
   - social preview image/title present when shared

## Safe editing rules (important)

- Do not delete shared template structure blocks.
- Prefer editing text/media inside existing patterns.
- Avoid adding custom HTML unless approved.
- Keep one source of truth: update content in WordPress, not in old systems.

## Common fixes

- Archive/page 404: go to **Settings -> Permalinks** and click **Save Changes**.
- Layout looks wrong: clear cache and hard refresh.
- SEO output duplicate warning: ensure only one SEO plugin is active for metadata output.
- Missing image in social preview: set featured image or default OG image in Pulse SEO settings.

## Escalate when

- Slugs or permalinks are changed globally
- Theme templates are edited in Site Editor and layout breaks
- Plugin updates change behavior
- Redirect loops or recurring 404s appear

## Weekly editorial cadence (recommended)

- Monday: assign drafts
- Wednesday: editing pass + revision requests
- Friday: schedule/publish + archive verification
- Monthly: check stale pages/events and update or archive
