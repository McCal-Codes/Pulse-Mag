# Pulse-Mag Cleanup & Optimization Plan

## Current State
- ✅ TypeScript build passing
- ✅ ESLint errors reduced by 85%
- ✅ Sanity CMS migration complete (migrated from Wix)
- ✅ Wix legacy code removed (Phase 1 complete)
- ✅ Events page using Sanity (Phase 2 complete)
- ✅ Vercel deployment workflow documented
- ⚠️ Image optimization disabled (deferred to next deployment)
- ⚠️ Some minor lint issues remaining

---

## Phase 1: Legacy Code Removal (Priority: High)
**Goal**: Remove unused Wix integration files
**Impact**: Cleaner codebase, faster builds, reduced bundle size

### Files to Delete
1. `apps/web/src/lib/wix-rss.ts` - RSS parser (replaced by Sanity)
2. `apps/web/src/lib/wix-client.ts` - Wix API client (unused)
3. `apps/web/src/lib/wix-events.ts` - Wix Events SDK (unused)
4. `apps/web/src/lib/wix-preview.ts` - Wix preview mode (unused)
5. `apps/web/src/lib/wordpress-client.ts` - WordPress client (unused)
6. `apps/web/src/lib/wordpress-queries.ts` - WordPress queries (unused)
7. `apps/web/src/app/test-wix/page.tsx` - Test page (unused)
8. `apps/web/src/app/test-wp/page.tsx` - Test page (unused)

### Verification
- [ ] Build passes after deletion
- [ ] No broken imports
- [ ] Blog page still works (now using Sanity)

---

## Phase 2: Content Integration (Priority: High)
**Goal**: Connect Events page to Sanity CMS
**Impact**: Dynamic events, no placeholder content

### Tasks
1. Update `apps/web/src/app/events/page.tsx`
   - Replace hardcoded Google Calendar embed
   - Fetch events from Sanity `event` schema
   - Handle empty state gracefully

2. Update `apps/web/src/lib/queries.ts`
   - Add events query (upcoming and past)

3. Update `apps/web/src/lib/types.ts`
   - Verify Event type matches Sanity schema

---

## Phase 3: Performance & SEO (Priority: Medium)
**Goal**: Enable production optimizations
**Impact**: Faster page loads, better SEO

### Tasks
1. Enable image optimization
   - File: `apps/web/src/next.config.ts`
   - Change `unoptimized: true` to `false`
   - Add remotePatterns for Sanity CDN

2. Remove console.log statements
   - Files: Search for `console.log` in production code
   - Keep `console.error` for actual errors

3. Add loading states
   - Blog page skeleton
   - Events page skeleton

---

## Phase 4: Code Quality (Priority: Medium)
**Goal**: Fix remaining lint/TypeScript issues
**Impact**: Clean codebase, type safety

### Tasks
1. Fix unused variables
   - `apps/web/src/app/join/page.tsx:8` - `APPLICATION_ACTION`

2. Type the `any` in Flipbook
   - `apps/web/src/components/Flipbook.tsx:51`
   - Replace `React.useRef<any>` with proper type

3. Fix `<img>` usage in Flipbook
   - Either use Next.js Image with loader, or add eslint-disable comment
   - Cloudinary images need special handling

---

## Phase 5: Testing & Verification (Priority: High)
**Goal**: Ensure everything works after changes
**Impact**: Stable production deployment

### Checklist
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` has < 100 errors
- [ ] `pnpm build:web` succeeds
- [ ] All pages render without errors:
  - [ ] Home `/`
  - [ ] Blog `/blog`
  - [ ] Blog post `/blog/[slug]`
  - [ ] Events `/events`
  - [ ] Issues `/issues`
  - [ ] About `/about`
  - [ ] Submit `/submit`
  - [ ] Join `/join`

---

## Decision Points

### Q1: Do you want to keep the Wix code as reference?
- **Option A**: Delete it all (cleanest)
- **Option B**: Move to `archive/` folder (keeps history)

### Q2: Events page approach?
- **Option A**: Simple list from Sanity (recommended)
- **Option B**: Keep Google Calendar embed + add Sanity overlay
- **Option C**: Full event detail pages

### Q3: Image optimization timeline?
- **Option A**: Enable now (may need testing with Sanity CDN)
- **Option B**: Enable after deployment (safer)

---

## Recommended Execution Order

**Round 1** (Can do now):
1. Delete Wix legacy files
2. Fix Events page placeholder

**Round 2** (After Round 1 verified):
3. Enable image optimization
4. Fix remaining lint issues

**Round 3** (Before next deployment):
5. Full testing checklist
6. Deploy to staging
