import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Issue Title',
      type: 'string',
      description: 'The name of this issue. E.g. "Spring 2025" or "Vol. 3: New Voices".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The URL path for this issue page (e.g. /issue/spring-2025). Auto-generated from the title.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'issueNumber',
      title: 'Issue Number',
      type: 'number',
      description: 'The sequential issue number. Used for ordering and display.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'date',
      description: 'When this issue was (or will be) published.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'The cover image for this issue. Displayed on the issue page and any issue listings.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the cover image for screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'An editorial note or summary for this issue. Shown at the top of the issue page.',
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      description: 'The articles included in this issue. You can also assign posts to an issue from within the post itself.',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'issueNumber', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `Issue #${subtitle}` : '',
        media,
      }
    },
  },
})
