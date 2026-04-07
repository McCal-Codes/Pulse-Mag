import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  description: 'Writer and contributor profiles. Create an author before assigning them to posts.',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'The author\'s display name as it will appear on articles and the author page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The URL path for the author page (e.g. /author/jane-smith). Auto-generated from the name.',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Headshot or profile photo. Square images work best — at least 400×400px.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'E.g. "Portrait of Jane Smith". Used by screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'Optional job title or role shown under the author\'s name. E.g. "Senior Contributor" or "Music Editor".',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'A short biography (2–4 sentences) shown on the author page and next to articles. You can add links.',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'twitter',
      title: 'X / Twitter Handle',
      type: 'string',
      description: 'Username without the @ symbol. E.g. "pulsewriter". Shown as a link on the author page.',
    }),
    defineField({
      name: 'website',
      title: 'Personal Website',
      type: 'url',
      description: 'Optional link to the author\'s personal site or portfolio.',
    }),
    defineField({
      name: 'pronoun',
      title: 'Pronouns',
      type: 'string',
      description: 'e.g. "they/them", "she/her", "he/him". Used on the team page.',
    }),
    defineField({
      name: 'lookingFor',
      title: 'Looking For in Submissions',
      type: 'text',
      rows: 3,
      description: 'A sentence or two describing what this editor seeks in submissions. Shown on the team page.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ?? 'Author', media }
    },
  },
})
