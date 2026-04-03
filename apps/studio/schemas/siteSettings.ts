import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'welcomeText',
      title: 'Welcome Text',
      type: 'text',
      rows: 4,
      description: 'The paragraph shown in the Welcome section on the homepage.',
    }),
    defineField({
      name: 'editorQuote',
      title: 'Editor Quote',
      type: 'text',
      rows: 3,
      description: 'A quote from the current Editor-in-Chief shown on the About page.',
    }),
    defineField({
      name: 'editorQuoteAttribution',
      title: 'Quote Attribution',
      type: 'string',
      description: 'e.g. "Jane Smith, editor-in-chief"',
    }),
    defineField({
      name: 'submissionWindowOpen',
      title: 'Submission Window Opens',
      type: 'string',
      description: 'e.g. "October 1st"',
    }),
    defineField({
      name: 'submissionWindowClose',
      title: 'Submission Window Closes',
      type: 'string',
      description: 'e.g. "January 31st"',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'blueskyUrl',
      title: 'Bluesky URL',
      type: 'url',
    }),
    defineField({
      name: 'pinterestUrl',
      title: 'Pinterest URL',
      type: 'url',
    }),
    defineField({
      name: 'emailAddress',
      title: 'Contact Email',
      type: 'string',
      description: 'Shown in the footer and contact sections.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
