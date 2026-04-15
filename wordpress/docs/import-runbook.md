# Import Runbook

## Inputs

- **Vercel parity seed (recommended for a clean structure):** `wordpress/data/pulse-vercel-parity.WordPress.xml` — mirrors `apps/web` routes (pages, sample posts, one `issue`, one `event`). You do **not** need PHP; the file is checked in. Activate **Pulse Mag Core** before import so `issue` and `event` post types exist.
- **Full site snapshot (optional):** `wordpress/data/pulseliterarymagazine.WordPress.2026-04-14.xml` (WordPress 6.9.4 export from Hostinger staging).
- WP install path (example): `C:\sites\pulse-wp`
- Run commands from repository root (`Pulse-Mag/`) so script paths resolve as `wordpress/tools/...` and the WXR path resolves as `wordpress/data/...`.

To **regenerate** the parity WXR after editing `wordpress/tools/generate-vercel-parity-wxr.php`, run `php wordpress/tools/generate-vercel-parity-wxr.php` (PHP CLI required).

## Preflight

```powershell
wp --path="C:\sites\pulse-wp" core is-installed
wp --path="C:\sites\pulse-wp" plugin is-installed wordpress-importer
wp --path="C:\sites\pulse-wp" plugin activate wordpress-importer
```

## Migration pipeline (Phase 4)

The script implements a **two-step pipeline** aligned with the migration plan:

1. **Pass 1:** Import WXR with `--authors=create` (content + author mapping).
2. **Pass 2:** `wp media regenerate` plus rewrite flush and cache flush (media metadata and derivatives; avoids a second full WXR import that would duplicate posts).

## Run

```powershell
# From repository root (adjust -WpPath to your Local / staging WordPress root)
# Vercel-parity seed (clean routes + sample CPTs):
pwsh -File wordpress/tools/import-wxr.ps1 `
  -WpPath "C:\sites\pulse-wp" `
  -WxrPath "$PWD\wordpress\data\pulse-vercel-parity.WordPress.xml" `
  -Force

# Or full Hostinger snapshot:
# -WxrPath "$PWD\wordpress\data\pulseliterarymagazine.WordPress.2026-04-14.xml"
```

## Validate

```powershell
pwsh -File wordpress/tools/validate-import.ps1 -WpPath "C:\sites\pulse-wp"
pwsh -File wordpress/tools/cutover-smoke-test.ps1 -BaseUrl "https://staging.example.com"
pwsh -File wordpress/tools/cutover-smoke-test.ps1 -BaseUrl "https://staging.example.com" -Paths @("/","/issues/","/events/","/blog/","/about/")
```

## Author Mapping

- Pre-create known users before import where possible.
- Pass 1 uses `--authors=create` once. A second WXR import is **not** run (prevents duplicate posts).
- Script blocks import when the target already has content unless `-Force` is provided.
- Review user list:

```powershell
wp --path="C:\sites\pulse-wp" user list --fields=ID,user_login,user_email,roles
```

## Post-Import Manual Checks

- Open and verify:
  - home page
  - issues archive
  - events archive
  - blog archive
  - about page
- Confirm:
  - menu assignment
  - featured images present
  - no critical slug collisions

## WP-CLI Update Safety (Ops)

Use one-at-a-time updates for mission-critical components:

```powershell
wp --path="C:\sites\pulse-wp" plugin list --update=available
wp --path="C:\sites\pulse-wp" plugin update plugin-slug
wp --path="C:\sites\pulse-wp" theme list --update=available
wp --path="C:\sites\pulse-wp" theme update theme-slug
```

