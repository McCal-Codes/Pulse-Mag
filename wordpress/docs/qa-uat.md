# QA and UAT Plan

## Functional QA

- Verify templates render with no fatal errors:
  - `index`, `home`, `page`, `single`, `archive`
  - `archive-issue`, `single-issue`, `archive-event`, `single-event`
- Verify custom post types visible in admin and on frontend.
- Verify taxonomies editable and assignable.

## Editorial UAT Scenarios

1. Author creates draft post and submits for review.
2. Editor updates and schedules publish.
3. Editor publishes issue with required metadata.
4. Editor publishes event with date/location/link.
5. Admin updates menu and confirms visibility.

## Acceptance Criteria

- Team can publish without developer intervention.
- Site navigation and key content archives are stable.
- Import pipeline can be re-run repeatably.
- Cutover checklist is executable in one session.
