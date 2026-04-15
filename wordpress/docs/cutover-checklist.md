# Cutover Checklist

## Pre-Cutover (T-48h)

- Confirm staging import dry run passed
- Confirm content freeze window with editorial team
- Export backup:
  - DB snapshot
  - uploads snapshot
  - plugin/theme zip snapshot
- Confirm redirects mapping for changed slugs
- Confirm rollback owner and communication channel

## Cutover Day

- Enable content freeze
- Export final WXR (delta or full)
- Run `wordpress/tools/import-wxr.ps1` against production target
- Run `wordpress/tools/validate-import.ps1`
- Run smoke test:
  - `pwsh -File wordpress/tools/cutover-smoke-test.ps1 -BaseUrl "https://production.example.com" -Paths @("/","/issues/","/events/","/blog/","/about/")`
- Manually verify critical URLs:
  - Home
  - Issues archive + latest issue
  - Events archive
  - Blog archive + latest post
  - About
- Verify menu locations and footer links
- Verify sitemap and robots
- Switch DNS/domain

## Rollback Criteria

- Missing critical content types
- Broken primary navigation
- Widespread media failures on key pages
- Fatal rendering errors on top traffic templates
- Smoke test non-pass status for any critical URL
- Editorial workflow blocked (cannot draft/review/publish)

## Go-Live Pass/Fail Gate

### PASS (proceed with DNS/live confirmation)

- Import + validation scripts complete without errors.
- Smoke test returns acceptable status for all critical URLs.
- Manual critical URL review passes.
- Menus/sitemap/robots checks pass.
- Editorial publish workflow test passes.

### FAIL (execute rollback)

- Any critical URL fails smoke test.
- Any fatal PHP/runtime error in frontend or admin.
- Missing key content entities in issue/event/post archives.
- Editors cannot complete draft -> review -> publish.

## Rollback Steps

1. Restore pre-cutover DB snapshot.
2. Restore pre-cutover uploads snapshot.
3. Revert DNS to previous records.
4. Re-open content editing only after incident review.