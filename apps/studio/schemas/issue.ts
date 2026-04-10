import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Magazine Issue',
  type: 'document',
  description: 'Magazine issues with PDF uploads. Create an issue here, then upload the PDF file.',
  fields: [
    defineField({
      name: 'title',
      title: 'Issue Title',
      type: 'string',
      description: 'The theme or title of this issue (e.g., "Signal / Noise").',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for this issue.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'season',
      title: 'Season / Date',
      type: 'string',
      description: 'e.g., "Summer 2026", "Autumn 2025"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current publication status of this issue.',
      options: {
        list: [
          { title: 'Current issue', value: 'current' },
          { title: 'Coming soon', value: 'upcoming' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'upcoming',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'issueNumber',
      title: 'Issue Number',
      type: 'number',
      description: 'Issue number for display (e.g., 01, 02). Auto-increments if not set.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'A short description of the issue theme and content.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'windowText',
      title: 'Submission Window',
      type: 'string',
      description: 'e.g., "Open for pitches through June 20" or "Reading window announced in July"',
    }),
    defineField({
      name: 'statusNote',
      title: 'Status Note',
      type: 'string',
      description: 'Additional status info, e.g., "Brief and reading package publishing soon."',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload the magazine issue PDF here. This will be available for the flipbook viewer.',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Optional cover image for the issue.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the cover image.',
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When this issue was or will be published.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      season: 'season',
      status: 'status',
      media: 'coverImage',
    },
    prepare({ title, season, status, media }) {
      const statusLabels: Record<string, string> = {
        current: 'Current',
        upcoming: 'Upcoming',
        archived: 'Archived',
      }
      return {
        title: title ?? 'Untitled Issue',
        subtitle: `${season ?? 'No season'} · ${statusLabels[status ?? 'upcoming']}`,
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
      title: 'Issue Number',
      name: 'issueNumberAsc',
      by: [{ field: 'issueNumber', direction: 'asc' }],
    },
  ],
})
