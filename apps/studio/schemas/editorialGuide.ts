import { defineType, defineField } from 'sanity'

// Singleton — one instance, pinned at top of Studio.
// Admins write onboarding instructions here; all team members can read them.
// Fields are readOnly for non-admins so writers can't accidentally change the guide.
export default defineType({
  name: 'editorialGuide',
  title: 'Editorial Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      description: 'The heading shown at the top of this guide.',
      readOnly: ({ currentUser }) =>
        !currentUser?.roles.some((r) => r.name === 'administrator'),
      initialValue: 'Welcome to Pulse Magazine Studio',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'A short welcome shown before the sections.',
      readOnly: ({ currentUser }) =>
        !currentUser?.roles.some((r) => r.name === 'administrator'),
      initialValue:
        'This guide covers everything you need to publish on Pulse Magazine. Read through the sections below before creating your first post.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Onboarding sections — expand each one to read.',
      type: 'array',
      readOnly: ({ currentUser }) =>
        !currentUser?.roles.some((r) => r.name === 'administrator'),
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'body',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
      initialValue: [
        {
          _type: 'section',
          _key: 'getting-started',
          heading: '1. Getting Started',
          body: [
            {
              _type: 'block',
              _key: 'gs-1',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: 'gs-1-span',
                  text: 'Before you write your first post, create your Author profile. Go to Authors in the left sidebar and add your name, a headshot, your role (e.g. "Staff Writer"), and a short bio. Once your Author exists, you can be credited on articles.',
                },
              ],
            },
          ],
        },
        {
          _type: 'section',
          _key: 'writing-a-post',
          heading: '2. Writing a Post',
          body: [
            {
              _type: 'block',
              _key: 'wp-intro',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-intro-s', text: 'Go to Posts in the sidebar and click the pencil icon to create a new post. Fill in each field:' }],
            },
            {
              _type: 'block',
              _key: 'wp-1',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-1-s', marks: ['strong'], text: 'Title' }, { _type: 'span', _key: 'wp-1-s2', text: ' — The article headline. Keep it under 80 characters.' }],
            },
            {
              _type: 'block',
              _key: 'wp-2',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-2-s', marks: ['strong'], text: 'Slug' }, { _type: 'span', _key: 'wp-2-s2', text: ' — The URL for this post. Click "Generate" to auto-fill it from the title. Only edit if you need a cleaner URL.' }],
            },
            {
              _type: 'block',
              _key: 'wp-3',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-3-s', marks: ['strong'], text: 'Main Image' }, { _type: 'span', _key: 'wp-3-s2', text: ' — The cover photo. Upload, then drag the circle to set the focal point. Always fill in the Alt Text field.' }],
            },
            {
              _type: 'block',
              _key: 'wp-4',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-4-s', marks: ['strong'], text: 'Author and Publish Date' }, { _type: 'span', _key: 'wp-4-s2', text: ' — Set both before publishing so the front page and bylines stay accurate.' }],
            },
            {
              _type: 'block',
              _key: 'wp-5',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-5-s', marks: ['strong'], text: 'Excerpt' }, { _type: 'span', _key: 'wp-5-s2', text: ' — 2–3 sentences that appear on article cards and in search results. This is not shown in the article body.' }],
            },
            {
              _type: 'block',
              _key: 'wp-6',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-6-s', marks: ['strong'], text: 'Body' }, { _type: 'span', _key: 'wp-6-s2', text: ' — The full article. Use the toolbar to add headings (H2/H3), bold, italic, links, and inline images.' }],
            },
            {
              _type: 'block',
              _key: 'wp-7',
              style: 'normal',
              children: [{ _type: 'span', _key: 'wp-7-s', text: 'When you\'re ready, click ' }, { _type: 'span', _key: 'wp-7-s2', marks: ['strong'], text: 'Publish' }, { _type: 'span', _key: 'wp-7-s3', text: ' in the top-right corner. The post goes live immediately.' }],
            },
          ],
        },
        {
          _type: 'section',
          _key: 'image-guidelines',
          heading: '3. Image Guidelines',
          body: [
            {
              _type: 'block',
              _key: 'ig-1',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ig-1-s', marks: ['strong'], text: 'Size' }, { _type: 'span', _key: 'ig-1-s2', text: ' — Main images should be at least 1200×630px. JPG or WebP format. Avoid text on images.' }],
            },
            {
              _type: 'block',
              _key: 'ig-2',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ig-2-s', marks: ['strong'], text: 'Alt Text' }, { _type: 'span', _key: 'ig-2-s2', text: ' — Always describe the image (e.g. "Two musicians performing on a small stage"). This is required for accessibility and SEO.' }],
            },
            {
              _type: 'block',
              _key: 'ig-3',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ig-3-s', marks: ['strong'], text: 'Hotspot' }, { _type: 'span', _key: 'ig-3-s2', text: ' — After uploading, click the image to open the hotspot editor. Drag the circle to the subject\'s face or the focal point. This controls how the image crops on mobile.' }],
            },
            {
              _type: 'block',
              _key: 'ig-4',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ig-4-s', marks: ['strong'], text: 'In-body images' }, { _type: 'span', _key: 'ig-4-s2', text: ' — Can include an optional Caption that appears below the image in the article.' }],
            },
            {
              _type: 'block',
              _key: 'ig-5',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ig-5-s', marks: ['strong'], text: 'Rights' }, { _type: 'span', _key: 'ig-5-s2', text: ' — Only upload images you have the rights to use. Unsplash, your own photography, or licensed stock only.' }],
            },
          ],
        },
        {
          _type: 'section',
          _key: 'issue-briefs',
          heading: '4. Issue Briefs',
          body: [
            {
              _type: 'block',
              _key: 'ci-1',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ci-1-s', marks: ['strong'], text: 'Issue briefs' }, { _type: 'span', _key: 'ci-1-s2', text: ' — Pulse now organizes editorial planning through issue briefs on the public Issues page. Use that page for theme and timing context instead of internal category tags.' }],
            },
            {
              _type: 'block',
              _key: 'ci-2',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ci-2-s', marks: ['strong'], text: 'Post structure' }, { _type: 'span', _key: 'ci-2-s2', text: ' — Posts no longer carry category or issue fields in Studio. Keep the title, slug, author, publish date, excerpt, and body clean and editorially precise.' }],
            },
            {
              _type: 'block',
              _key: 'ci-3',
              style: 'normal',
              children: [{ _type: 'span', _key: 'ci-3-s', text: 'If a piece belongs to a seasonal package, coordinate with an editor so it can be surfaced on the homepage or Issues page when the brief goes live.' }],
            },
          ],
        },
        {
          _type: 'section',
          _key: 'homepage',
          heading: '5. The Homepage',
          body: [
            {
              _type: 'block',
              _key: 'hp-1',
              style: 'normal',
              children: [{ _type: 'span', _key: 'hp-1-s', text: 'The homepage is controlled from Homepage Settings in the sidebar. Only editors manage this — do not change it without checking with your editor first.' }],
            },
            {
              _type: 'block',
              _key: 'hp-2',
              style: 'normal',
              children: [{ _type: 'span', _key: 'hp-2-s', marks: ['strong'], text: 'Hero Post' }, { _type: 'span', _key: 'hp-2-s2', text: ' — The large feature at the top of the page. One post at a time.' }],
            },
            {
              _type: 'block',
              _key: 'hp-3',
              style: 'normal',
              children: [{ _type: 'span', _key: 'hp-3-s', marks: ['strong'], text: 'Featured Posts grid' }, { _type: 'span', _key: 'hp-3-s2', text: ' — Up to 6 posts shown below the hero. Changes go live as soon as you click Publish.' }],
            },
          ],
        },
        {
          _type: 'section',
          _key: 'publishing-checklist',
          heading: '6. Before You Publish — Checklist',
          body: [
            {
              _type: 'block',
              _key: 'pc-1',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-1-s', text: '☐  Title is final and under 80 characters' }],
            },
            {
              _type: 'block',
              _key: 'pc-2',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-2-s', text: '☐  Slug has been generated' }],
            },
            {
              _type: 'block',
              _key: 'pc-3',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-3-s', text: '☐  Main image uploaded with alt text and hotspot set' }],
            },
            {
              _type: 'block',
              _key: 'pc-4',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-4-s', text: '☐  Author and Publish Date are set' }],
            },
            {
              _type: 'block',
              _key: 'pc-5',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-5-s', text: '☐  Excerpt written (2–3 sentences)' }],
            },
            {
              _type: 'block',
              _key: 'pc-6',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-6-s', text: '☐  Body proofread — check spelling, links, and headings' }],
            },
            {
              _type: 'block',
              _key: 'pc-7',
              style: 'normal',
              children: [{ _type: 'span', _key: 'pc-7-s', text: '☐  Editor has approved the piece' }],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Editorial Guide' }
    },
  },
})
