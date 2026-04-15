# Local Development Setup

## Requirements

- WordPress 6.5+
- PHP 8.1+ (**must be on `PATH` as `php`**, or pass `-PhpPath` to the verifier below)
- WP-CLI
- MySQL/MariaDB

## Verify plugin PHP syntax (optional)

From the repo root:

```powershell
pwsh -File wordpress/tools/verify-php-plugins.ps1
```

If `php` is not found, install PHP or point to your LocalWP/Laragon `php.exe`:

```powershell
pwsh -File wordpress/tools/verify-php-plugins.ps1 -PhpPath "C:\path\to\php.exe"
```

## Vercel-parity pages (Local preview)

From the repo, create/update WordPress **pages** that match Vercel routes (`/about`, `/submit`, `/join`, `/about/team`, `/blog`, `/news`). Requires **PHP CLI** (use “Open site shell” in Local if `php` is not on your PATH):

```powershell
php "I:\Programing\Projects\Pulse-Mag\wordpress\tools\create-vercel-parity-pages.php" `
  --wp-path="C:\Users\YOU\Local Sites\YOURSITE\app\public" `
  --set-reading
```

`--set-reading` sets **Home** as the static front page and **Pulse News** (`/blog`) as the posts page. Omit that flag if you only want pages created. Then **Settings → Permalinks → Save**.

## Setup Steps

1. Create a local WordPress install (or use existing staging clone).
2. Copy:
   - `wordpress/theme/pulse-mag` -> `wp-content/themes/pulse-mag`
   - `wordpress/plugins/pulse-mag-core` -> `wp-content/plugins/pulse-mag-core`
3. Activate theme and plugin:
   - `wp --path="C:\path\to\wp" theme activate pulse-mag`
   - `wp --path="C:\path\to\wp" plugin activate pulse-mag-core`
4. Import content using `wordpress/tools/import-wxr.ps1` with `wordpress/data/pulse-vercel-parity.WordPress.xml` (Vercel-like seed) or the Hostinger snapshot — pass `-WxrPath` as in `docs/import-runbook.md`. PHP is not required; only WP-CLI + PowerShell.
5. Run `wordpress/tools/validate-import.ps1`.

## Notes

- This migration workspace intentionally avoids changes to `apps/web` and `apps/studio`.
