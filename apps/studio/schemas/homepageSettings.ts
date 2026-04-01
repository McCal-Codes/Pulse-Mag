import { defineType, defineField } from 'sanity'

// Singleton document — only one instance should exist.
// To enforce this, add a custom structure in sanity.config.ts if needed.
export default defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredPost',
      title: 'Hero Post',
      description: 'The large featured post displayed at the top of the homepage.',
      type: 'reference',
      to: [{ type: 'post' }],
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured Posts Grid',
      description: 'Up to 6 posts shown in the grid below the hero.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'heroText',
      title: 'Hero Text',
      description: 'Optional tagline shown on the homepage.',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'heroText' },
    prepare({ title }) {
      return { title: title ?? 'Homepage Settings' }
    },
  },
})
