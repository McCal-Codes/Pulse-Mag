# Classic theme → block theme (Pulse Mag)

This project ships a **block theme** (`wordpress/theme/pulse-mag/`): HTML templates, `theme.json`, Site Editor, and no PHP template hierarchy for layout. If your site still looks like a Hostinger/Astra/Elementor starter, you are almost certainly still on a **classic** (or hybrid) theme, not Pulse Mag.

External references (same mental model WordPress.org uses; good for editors and hosts):

- [How to Switch from a Classic Theme to a Block Theme in WordPress](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/) — Jetpack
- [WordPress Block Themes: Development Tutorial for Beginners](https://jetpack.com/resources/wordpress-block-themes/) — Jetpack

Official course (optional deeper dive): [How to switch from a classic to a block theme](https://learn.wordpress.org/tutorial/how-to-switch-from-a-classic-to-a-block-theme/) — Learn WordPress

---

## What block themes do (per Jetpack’s overview)

Block themes tie layout to **blocks** everywhere: headers, footers, and page templates are edited in the **Site Editor** (**Appearance → Editor**), not only in the post editor. **Full Site Editing (FSE)** brings together the Site Editor, **Styles** (global colors/typography), **templates** and **template parts**, **block patterns**, and developer defaults in **`theme.json`**. That is how Pulse Mag is structured: `templates/`, `parts/`, `theme.json`, and `inc/patterns.php`.

---

## Switching checklist (aligned with Jetpack’s classic → block article)

Apply these on **staging first**, then production.

1. **Staging** — Try the switch on a clone or staging URL before the live domain ([Jetpack](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/)).

2. **Preserve legacy pieces** — Block themes do not use classic **widgets** the same way. Copy anything you need from widget areas. Save **Additional CSS** from the Customizer, snippets from the old theme’s `functions.php` / `style.css`, and any tracking or embed code you still need ([Jetpack](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/)).

3. **Plugins and builders** — Page builders and plugins that assume the **Customizer**, classic menus only, or theme-specific shortcodes may conflict or do nothing until you replace that workflow with blocks or supported plugins ([Jetpack](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/)). For Pulse, plan to **deactivate** builder-driven “canvas” homepages so WordPress can render `front-page.html`.

4. **Activate Pulse Mag** — **Appearance → Themes** → activate **Pulse Mag** from `wp-content/themes/pulse-mag` (upload or sync from this repo first).

5. **Site Editor** — Use **Appearance → Editor** to confirm **Templates** (e.g. Front Page, single issue) and **Template parts** (header/footer) match what you want. Global look lives under **Styles** in the editor; defaults come from `theme.json` ([Jetpack block themes article](https://jetpack.com/resources/wordpress-block-themes/)).

6. **Reading settings** — Set **Settings → Reading** (static front page vs posts page) so the front page matches your cutover plan; see `import-runbook.md` and `README.md` in this folder.

7. **Content in the editor** — Older posts may open inside a **Classic** block; use **Convert to blocks** where you want native blocks ([Jetpack](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/)).

8. **Cleanup** — Remove themes and plugins you no longer need after the cutover ([Jetpack](https://jetpack.com/resources/wordpress-switch-from-classic-to-block-theme/)).

---

## Pulse-specific reminders

- **Pulse Mag Core** (and flipbook/SEO if you use them) should be active **before** importing CPT-heavy WXR so `issue` and `event` resolve correctly (`docs/import-runbook.md`).
- Canonical route-aligned seed: `wordpress/data/pulse-vercel-parity.WordPress.xml`.
- If the **Site Editor** shows an old layout, WordPress may have **saved template overrides** in the database (customized copies of theme templates). Compare **Appearance → Editor** with the files in `theme/pulse-mag/templates/`; reset or re-sync templates if needed (see [Site Editing Templates](https://developer.wordpress.org/block-editor/explanations/architecture/full-site-editing-templates/) in the Block Editor handbook).

---

## Summary

Jetpack’s two articles together state the product shape: **block themes + FSE** replace much of the classic **Customizer + widgets + PHP templates** workflow. Pulse Mag follows that model; switching hosts or imports without activating this theme will not show the Vercel-aligned design.
