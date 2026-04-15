# Changelog

All notable changes to this project are documented in this file.

## 0.2.8 - 2026-04-15

- Added a block-native submit guidelines accordion pattern and wired it into the Submit page template.
- Rebuilt the Team page around live `author_profile` query cards and added a dedicated `single-author_profile` template.
- Improved team and author presentation styles for profile cards, metadata labels, and author detail layout consistency.

## 0.2.6 - 2026-04-15

- Replaced remaining `wp:html` usage in template parts, templates, and patterns with native Gutenberg blocks for better editor portability.
- Removed inline style payloads from theme templates/patterns and moved spacing/layout/radius behavior into reusable CSS classes.
- Upgraded parity import seed content to mirror Vercel page and editorial structure more closely, including kicker/lead/CTA composition for sample posts, issues, and events.

## 0.2.5 - 2026-04-15

- Improved header structure and interaction polish (wordmark framing, nav active states, refined mobile menu control).
- Fixed footer social link rendering by removing conflicting logos-only style from the social links block.
- Expanded template parity for event/issue archives and single content layouts to better match Vercel page composition.
- Added native `pulse/issue-flipbook` block placement in `single-issue` template for stable issue reader rendering.

## 0.2.4 - 2026-04-15

- Synced WordPress theme color tokens and Gutenberg palette to the current Vercel source token set for consistent brand rendering.
- Expanded template parity work across `home`, `archive`, and key page templates using shared spacing, typography rhythm, and interaction utilities.
- Improved blog/news presentation structure to better match the Vercel featured-plus-grid composition.

## 0.2.3 - 2026-04-15

- Added a Vercel parity refinement pass for typography rhythm, section spacing, and button interaction consistency.
- Upgraded WordPress `home` and `archive` templates to a featured-plus-grid blog presentation aligned with the Vercel news/blog layout.
- Refined page templates for `about`, `team`, `submit`, `join`, and `news` with reusable pattern-driven sections and consistent visual framing.
- Improved overall editor experience by preserving Gutenberg-native structure while matching production design more closely.

