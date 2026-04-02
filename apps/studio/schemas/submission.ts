import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'submission',
  title: 'Issue Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Submission Title',
      type: 'string',
      description: 'Title of the submitted piece.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from title.',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'issue',
      title: 'Target Issue',
      type: 'reference',
      description: 'Which issue is this submission for?',
      to: [{ type: 'issue' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'submitterName',
      title: 'Submitter Name',
      type: 'string',
      description: 'Name of the person submitting this piece.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'submitterEmail',
      title: 'Submitter Email',
      type: 'string',
      description: 'Email address for follow-up.',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'submissionType',
      title: 'Submission Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article/Essay', value: 'article' },
          { title: 'Poetry', value: 'poetry' },
          { title: 'Photography', value: 'photography' },
          { title: 'Artwork', value: 'artwork' },
          { title: 'Interview', value: 'interview' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Brief Description',
      type: 'text',
      rows: 3,
      description: 'Short summary or pitch for this submission.',
      validation: (r) => r.max(500).warning('Keep under 500 characters.'),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Full submission content (for written pieces).',
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
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      description: 'Additional files (PDFs, images, etc.).',
      of: [{ type: 'file' }],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      description: 'When this submission was received.',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    // Approval workflow fields
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Review', value: 'pending' },
          { title: 'Under Review', value: 'reviewing' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Needs Revision', value: 'revision' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'reference',
      description: 'Editor who reviewed this submission.',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed At',
      type: 'datetime',
      description: 'When the review decision was made.',
    }),
    defineField({
      name: 'reviewNotes',
      title: 'Review Notes',
      type: 'text',
      rows: 4,
      description: 'Internal notes about this submission (not visible to submitter).',
    }),
    defineField({
      name: 'feedbackToSubmitter',
      title: 'Feedback to Submitter',
      type: 'text',
      rows: 4,
      description: 'Feedback sent to the submitter (approval message or revision requests).',
    }),
    defineField({
      name: 'convertedToPost',
      title: 'Converted to Post',
      type: 'reference',
      description: 'If approved, link to the published post.',
      to: [{ type: 'post' }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      submitterName: 'submitterName',
      status: 'status',
      issue: 'issue.title',
    },
    prepare({ title, submitterName, status, issue }) {
      const statusEmoji: Record<string, string> = {
        pending: '⏳',
        reviewing: '👀',
        approved: '✅',
        rejected: '❌',
        revision: '📝',
      }
      return {
        title,
        subtitle: `${statusEmoji[status || 'pending']} ${submitterName}${issue ? ` → ${issue}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Submission Date, Newest',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'submittedAt', direction: 'desc' },
      ],
    },
  ],
})
