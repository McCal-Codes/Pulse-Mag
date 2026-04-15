# Editor Guardrails

This document defines safe editing boundaries for non-technical staff in the block editor.

## Goal

Allow editors to update content confidently without breaking layout structure.

## Guardrail Strategy

- Keep global design tokens in `theme/pulse-mag/theme.json`.
- Use registered patterns in `theme/pulse-mag/inc/patterns.php` for repeated sections.
- Apply block locking on structural wrappers:
  - `lock.move = true`
  - `lock.remove = true`
- Permit content edits inside locked structures:
  - headings
  - paragraph copy
  - links and CTA labels

## What Editors Can Change

- Post/page/issue/event titles and body content
- Excerpts and featured images
- Taxonomy assignments (category/tag/section/topic)
- Menu labels and destination links

## What Editors Should Not Change

- Template structure under `theme/pulse-mag/templates/`
- Global typography/color tokens in `theme.json`
- Pattern wrapper block hierarchy
- Plugin source in `plugins/pulse-mag-core/`

## Safe Customization Process

1. Duplicate existing page content in Draft mode.
2. Replace text/media within existing pattern blocks only.
3. Preview on desktop and mobile before publish.
4. If layout changes are needed, escalate to maintainer workflow.

## Escalation Rule

Any request that requires moving/removing structural blocks must be treated as a theme change, not an editorial change.