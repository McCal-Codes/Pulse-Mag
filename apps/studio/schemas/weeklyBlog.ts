import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'weeklyBlog',
  title: 'Weekly Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Headline for this week\'s news update.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this blog post.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When this weekly update goes live.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'weekNumber',
      title: 'Week Number',
      type: 'number',
      description: 'Week number of the year (1-52). Used for organization.',
      validation: (r) => r.min(1).max(52),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year for this weekly update.',
      initialValue: new Date().getFullYear(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Header image for this week\'s news.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown in listings. Keep under 200 characters.',
      validation: (r) => r.max(200).warning('Keep excerpt under 200 characters.'),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Weekly news content with rich text and images.',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for this weekly update (e.g., "news", "announcements", "events").',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Make this weekly blog visible on the site.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      weekNumber: 'weekNumber',
      year: 'year',
      media: 'featuredImage',
    },
    prepare({ title, weekNumber, year, media }) {
      return {
        title,
        subtitle: weekNumber && year ? `Week ${weekNumber}, ${year}` : 'Weekly Update',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Publish Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Week Number',
      name: 'weekNumberAsc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: 'weekNumber', direction: 'desc' },
      ],
    },
  ],
})
