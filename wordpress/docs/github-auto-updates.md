# GitHub Auto-Updates (No ZIP Imports)

This runbook standardizes update delivery for custom Pulse WordPress packages:

- `pulse-mag-core` (plugin)
- `pulse-seo` (plugin)
- `pulse-flipbook` (plugin)
- `pulse-mag-theme` (theme)

## 1) Metadata headers (Git Updater)

Package entry files must include Git Updater metadata:

- Plugins:
  - `GitHub Plugin URI: https://github.com/McCal-Codes/<repo>`
  - `Primary Branch: main`
- Theme (`style.css`):
  - `GitHub Theme URI: https://github.com/McCal-Codes/pulse-mag-theme`
  - `Primary Branch: main`

## 2) Version and tag policy

- Use semantic versioning (`MAJOR.MINOR.PATCH`).
- Keep package `Version` header equal to the release tag version.
- Tag release commits with package-prefixed annotated tags (example: `pulse-seo-v0.2.1`).
- GitHub Actions publishes one package release per tag in the target package repo as `vX.Y.Z`.

Recommended release cadence:

- `PATCH`: bugfixes and safe maintenance updates.
- `MINOR`: new backwards-compatible features.
- `MAJOR`: breaking changes requiring explicit rollout notes.

## 3) Release ZIP shape guardrail

Release assets must install to one clean top-level folder:

- `pulse-mag-core/`
- `pulse-seo/`
- `pulse-flipbook/`
- `pulse-mag/` (from `pulse-mag-theme` repository)

Validate ZIP structure before publishing:

```powershell
pwsh -File wordpress/tools/validate-github-release-zips.ps1
```

For externally-downloaded release assets:

```powershell
pwsh -File wordpress/tools/validate-github-release-zips.ps1 -ZipMap @{
  "pulse-mag-core" = "C:\releases\pulse-mag-core-v0.1.2.zip"
  "pulse-seo" = "C:\releases\pulse-seo-v0.2.1.zip"
  "pulse-flipbook" = "C:\releases\pulse-flipbook-v0.1.2.zip"
  "pulse-mag" = "C:\releases\pulse-mag-v0.2.1.zip"
}
```

## 4) Git Updater configuration

1. Install and activate **Git Updater** in WordPress.
2. Open `Settings -> Git Updater`.
3. If repositories are private, add a GitHub PAT with minimum read-only repo scope.
4. Run Git Updater refresh and verify all four packages are detected.
5. Enable auto-updates for those packages after smoke tests pass.

## 5) Smoke test before broad auto-updates

Run a controlled test for one plugin and one theme release:

1. Bump package `Version`.
2. Create annotated tag and GitHub Release.
3. Confirm update appears in `Dashboard -> Updates` (or package detail view).
4. Apply update.
5. Verify package remains active and key paths still load:
   - Plugins active, no fatal errors in admin.
   - Theme active and front page renders expected layout.
6. Repeat once for another package type (plugin/theme pair).

## 6) Automated publish on tag (GitHub Actions)

This repo includes workflow:

- `.github/workflows/publish-wordpress-packages.yml`

It publishes package updates to `pulse-mag-core`, `pulse-seo`, `pulse-flipbook`, and `pulse-mag-theme` and writes release notes with a changelog derived from commits that touched each package path.

### Required repo secret/variable

- Secret: `WP_PACKAGE_REPO_TOKEN` (GitHub PAT with repo write access to package repos)
- Optional variable: `WP_PACKAGE_OWNER` (defaults to current repo owner)

### Tag formats that trigger publish

- `pulse-mag-core-vX.Y.Z`
- `pulse-seo-vX.Y.Z`
- `pulse-flipbook-vX.Y.Z`
- `pulse-mag-theme-vX.Y.Z`

Example:

```bash
git tag -a pulse-seo-v0.2.2 -m "Release pulse-seo v0.2.2"
git push origin pulse-seo-v0.2.2
```

That single tag push syncs the package repo and creates/updates release `v0.2.2` with changelog notes.

## 7) Ongoing release checklist

For every release:

1. Version bump in package header.
2. Commit and tag (`vX.Y.Z`) on matching commit.
3. Push package tag (`pulse-<package>-vX.Y.Z`) to trigger automated publish and release notes.
4. Validate detection in WordPress.
5. Apply update in staging before production rollout.
