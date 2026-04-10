# Wix Editor Dashboard Setup Guide

## Overview
This guide configures your Wix site (pulse24.wixsite.com/pulse) as a streamlined editor dashboard that requires **zero dev maintenance**. Editors use Wix's native tools; content flows to Next.js via RSS.

**Prerequisite**: Wix Premium Core plan (no custom code, no API access)

---

## Step 1: Simplify the Navigation Menu

### Hide Public-Facing Items from Editor View
1. Go to **Site Menu** (left sidebar in Wix editor)
2. Identify pages that confuse editors (e.g., sample pages, unused templates)
3. **Hide from menu** (don't delete—in case needed later):
   - Click page → ⋮ → "Hide from menu"
   - Or set to "No link" in menu settings

### Create "Editor Quick Links" Menu
This lives in the sidebar/dashboard area, not the public nav:

| Link | Location in Wix | Purpose |
|------|-----------------|---------|
| **Manage Blog** | Dashboard → Blog → Manage Posts | Primary tool for editors |
| **Media Library** | Dashboard → Media → Site Files | Upload images here |
| **Blog Settings** | Dashboard → Blog → Settings | Categories, authors, SEO defaults |
| **Site Settings** | Dashboard → Settings → General Info | Site info, social links |

> **Note**: These are dashboard links—bookmark them, don't add to the public site menu.

---

## Step 2: Create Static Editor Guide Pages

These pages live on Wix but are **NOT linked** in the public navigation. Editors bookmark them directly.

### Page 1: `/editor-guide` (The Main Handbook)

**How to create:**
1. Wix Editor → Add Page → Name: "Editor Guide"
2. Page Settings → SEO → URL slug: `editor-guide`
3. **Hide from menu**: Page → ⋮ → "Hide from menu"

**Content to paste in:**

---

**PULSE EDITOR GUIDE**

**Quick Links (Bookmark These)**
- Manage Posts: [Wix Dashboard → Blog](https://manage.wix.com/dashboard/.../blog)
- Media Uploads: [Dashboard → Media](https://manage.wix.com/dashboard/.../media)

**Creating a Blog Post**
1. Click "Create Post"
2. **Title**: Descriptive, under 60 characters
3. **Featured Image**: Required! 1200x630px for best social sharing
4. **Category**: Pick from approved list only (see below)
5. **Content**: Write in Wix editor, formatting applies automatically
6. **Publish** or **Schedule**

**Approved Categories**
- Poetry
- Fiction
- Non-Fiction
- Interviews
- Reviews
- Announcements

**Image Requirements**
- Format: JPG or PNG
- Size: Under 2MB
- Dimensions: Minimum 1200px wide for featured images
- Naming: `descriptive-name.jpg` (no spaces, use hyphens)

**Slug Naming Convention**
Wix auto-generates slugs from title. Override if needed:
- Format: `yyyy-mm-dd-topic`
- Example: `2024-03-15-spring-poetry-contest`

**When Will It Appear on the Website?**
- Immediate: Your Wix site
- **5 minutes**: pulseliterary.com (RSS cache)

---

### Page 2: `/image-guide` (Visual Reference)

**Content:**
- Screenshot examples of good vs. bad featured images
- Size template overlay (1200x630 box)
- Note: "Images uploaded to Media Library appear in dropdown when adding featured image"

### Page 3: `/seo-checklist` (Pre-Publish)

**Checklist to copy/paste:**

```
☐ Featured image added and looks good in preview
☐ Category selected (not "Uncategorized")
☐ Author assigned (see Blog → Authors)
☐ Excerpt written (150 characters max)
☐ Slug is clean (no auto-generated gibberish)
☐ Publish date is correct (or scheduled)
```

---

## Step 3: Configure Blog Settings

### Set Up Categories
1. Dashboard → Blog → Settings → Categories
2. Create these exact categories (match your Next.js filters):
   - Poetry
   - Fiction
   - Non-Fiction
   - Interviews
   - Reviews
   - Announcements
3. **Delete default categories** like "General" to prevent misuse

### Set Up Authors
1. Dashboard → Blog → Settings → Authors
2. Add each editor/author:
   - Name
   - Bio (short)
   - Profile image (square, 400x400px)
3. These flow to your Next.js site via RSS

### SEO Defaults
1. Dashboard → Settings → SEO
2. Site name: "Pulse Literary Magazine"
3. Homepage description: Brief tagline
4. **Google Search Console**: Verify site and submit sitemap (Wix auto-generates)

---

## Step 4: Test the RSS Feed

Before handing off, verify the feed is working:

1. Open: `https://pulse24.wixsite.com/pulse/blog-feed.xml`
2. Check that:
   - Recent posts appear
   - Categories are populated
   - Author names show
   - Featured images have URLs

3. Check your Next.js site: `pulseliterary.com/blog`
4. Verify posts from Wix appear correctly

---

## Handoff Checklist for Editors

**Give editors these bookmarks:**
1. Wix Dashboard (login link)
2. Editor Guide page: `https://pulse24.wixsite.com/pulse/editor-guide`
3. Blog management: Direct link from Wix dashboard

**Communication:**
- "Make all blog edits in Wix, not on the main website"
- "Changes take 5 minutes to appear on pulseliterary.com"
- "For issues, check the Editor Guide page first"

---

## What You (the Dev) Don't Touch

✅ Editors handle all of this in Wix:
- Writing posts
- Scheduling
- Featured images
- Categories/tags
- Author assignments
- Basic SEO (excerpts, slugs)

❌ You only handle (in Next.js codebase):
- Site layout/design
- RSS parsing logic
- Non-blog content (magazine issues, etc.)

---

## Next Phase

Once this is set up and tested, move to **Phase 2: Maximize Wix Blog Features** (categories, scheduling, author profiles).
