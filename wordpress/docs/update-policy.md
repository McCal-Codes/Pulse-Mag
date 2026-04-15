# Theme and Plugin Update Policy

This policy applies to all WordPress maintenance for Pulse Magazine.

## Core Principles

- Backup-first: no updates without fresh DB + uploads backup.
- Stage-first: test in staging before production.
- Manual-critical: mission-critical components are updated manually, one at a time.
- Rollback-ready: every update window has a tested restore path.

## Classification

### Mission-Critical (Manual Only)

- Active theme (`pulse-mag`)
- Core publishing plugins (editorial workflow, forms, SEO, caching, security)
- Any plugin with custom integration or shortcode reliance

### Low-Risk (Auto or Batched Manual)

- Utility plugins with limited frontend/admin impact
- Non-critical helper plugins with strong maintenance history

## Standard Update Workflow

1. Review available updates and changelogs.
2. Create fresh backup (DB + uploads + plugin/theme snapshot).
3. Apply update in staging only.
4. Run validation:
   - `wordpress/tools/validate-import.ps1` (if relevant to content model changes)
   - `wordpress/tools/cutover-smoke-test.ps1` against staging
   - manual critical-path check (home, issues, events, blog, about, forms)
5. If pass, apply same update in production during low-traffic window.
6. Re-run smoke test and monitor logs.

## Rollback Drill Procedure (Monthly)

1. Choose one plugin/theme update scenario in staging.
2. Apply update and deliberately trigger rollback.
3. Restore previous snapshot or prior package version.
4. Validate that:
   - site returns to healthy state
   - key pages load
   - editor workflow still functions
5. Record drill duration and lessons learned.

## Emergency Rollback Triggers

- Fatal PHP errors post-update
- White screen/admin lockout
- Critical template breakage on top pages
- Core publishing workflow blocked for editors

## Ownership

- Primary: technical maintainer
- Backup: designated admin publisher
- Communication: rollback owner and escalation contact documented before each update window

## Core/Theme/Plugin Governance Matrix

- Core minor updates
  - Cadence: weekly review window
  - Mode: auto or batched manual
  - Approval: technical maintainer
  - Validation: smoke test + admin login check
  - Rollback SLA: 30 minutes
- Core major updates
  - Cadence: planned release window only
  - Mode: manual
  - Approval: technical maintainer + admin publisher
  - Validation: full critical-path + editorial workflow check
  - Rollback SLA: immediate on critical failure
- Mission-critical plugins/themes
  - Cadence: staged, one-at-a-time
  - Mode: manual
  - Approval: technical maintainer
  - Validation: changelog review + staging test + smoke + manual checks
  - Rollback SLA: immediate on blocker
- Low-risk utility plugins
  - Cadence: weekly or bi-weekly
  - Mode: auto permitted
  - Approval: technical maintainer
  - Validation: smoke test
  - Rollback SLA: same maintenance window
