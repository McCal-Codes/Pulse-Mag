# WordPress migration documentation

Maps the migration plan phases to files in this folder.

| Phase | Topic | Document |
| ----- | ----- | -------- |
| 0 | Content mapping and freeze | [content-mapping.md](content-mapping.md) |
| 1 | Foundation and local setup | [local-dev.md](local-dev.md) |
| 2 | Content model notes | [content-mapping.md](content-mapping.md) |
| 3 | Theme UX and editor boundaries | [editor-guardrails.md](editor-guardrails.md), [classic-to-block-theme.md](classic-to-block-theme.md) |
| 4 | Import and validation (WP-CLI) | [import-runbook.md](import-runbook.md) |
| 5 | Operations and updates | [update-policy.md](update-policy.md), [editorial-sop.md](editorial-sop.md), [writer-editor-manual.md](writer-editor-manual.md) |
| 6 | QA and cutover | [qa-uat.md](qa-uat.md), [cutover-checklist.md](cutover-checklist.md) |
| 7 | Handoff | [handoff.md](handoff.md) |
| Audit | Standards gap review | [standards-gap-audit.md](standards-gap-audit.md) |
| Ops | GitHub no-ZIP updates | [github-auto-updates.md](github-auto-updates.md) |

Scripts live in `../tools/` (from repo root: `wordpress/tools/`).
