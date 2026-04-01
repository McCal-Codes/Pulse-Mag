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
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'issueNumber',
      title: 'Issue Number',
      type: 'number',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'date',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
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
