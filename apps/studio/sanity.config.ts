import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const singletonTypes = new Set(['homepageSettings', 'editorialGuide'])

// Document types to filter from automatic list (we'll add them manually)
const manualListTypes = new Set(['weeklyBlog', 'submission'])

export default defineConfig({
  name: 'pulse-magazine',
  title: 'Pulse Magazine Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Editorial Guide')
              .id('editorialGuide')
              .icon(() => '📖')
              .child(S.document().schemaType('editorialGuide').documentId('editorialGuide')),
            S.divider(),
            S.listItem()
              .title('Homepage Settings')
              .id('homepageSettings')
              .icon(() => '🏠')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            S.divider(),
            S.listItem()
              .title('Weekly Blog')
              .id('weeklyBlogList')
              .icon(() => '📰')
              .child(
                S.documentTypeList('weeklyBlog')
                  .title('Weekly Blog Posts')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Submissions')
              .id('submissionList')
              .icon(() => '📥')
              .child(
                S.list()
                  .title('Issue Submissions')
                  .items([
                    S.listItem()
                      .title('Pending Review')
                      .id('submissionsPending')
                      .icon(() => '⏳')
                      .child(
                        S.documentTypeList('submission')
                          .title('Pending Submissions')
                          .filter('_type == "submission" && status == "pending"')
                      ),
                    S.listItem()
                      .title('Under Review')
                      .id('submissionsReviewing')
                      .icon(() => '👀')
                      .child(
                        S.documentTypeList('submission')
                          .title('Under Review')
                          .filter('_type == "submission" && status == "reviewing"')
                      ),
                    S.listItem()
                      .title('Needs Revision')
                      .id('submissionsRevision')
                      .icon(() => '📝')
                      .child(
                        S.documentTypeList('submission')
                          .title('Needs Revision')
                          .filter('_type == "submission" && status == "revision"')
                      ),
                    S.listItem()
                      .title('Approved')
                      .id('submissionsApproved')
                      .icon(() => '✅')
                      .child(
                        S.documentTypeList('submission')
                          .title('Approved Submissions')
                          .filter('_type == "submission" && status == "approved"')
                      ),
                    S.listItem()
                      .title('Rejected')
                      .id('submissionsRejected')
                      .icon(() => '❌')
                      .child(
                        S.documentTypeList('submission')
                          .title('Rejected Submissions')
                          .filter('_type == "submission" && status == "rejected"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Submissions')
                      .id('submissionsAll')
                      .icon(() => '📋')
                      .child(S.documentTypeList('submission').title('All Submissions')),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => {
                const id = listItem.getId() ?? ''
                return !singletonTypes.has(id) && !manualListTypes.has(id)
              }
            ),
          ]),
    }),
    visionTool(),
  ],

  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !singletonTypes.has(item.templateId))
        : prev,
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action === 'publish' || action === 'discardChanges' || action === 'restore'
          )
        : prev,
  },

  schema: {
    types: schemaTypes,
  },
})
