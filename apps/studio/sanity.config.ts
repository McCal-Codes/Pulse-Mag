import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const singletonTypes = new Set(['homepageSettings', 'editorialGuide', 'siteSettings'])
const manualListTypes = new Set(['weeklyBlog'])

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
              .child(S.document().schemaType('editorialGuide').documentId('editorialGuide')),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Homepage Settings')
              .id('homepageSettings')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            S.divider(),
            S.listItem()
              .title('Blog')
              .id('weeklyBlogList')
              .child(
                S.documentTypeList('weeklyBlog')
                  .title('Blog Posts')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Events')
              .id('eventList')
              .child(
                S.documentTypeList('event')
                  .title('Events')
                  .defaultOrdering([{ field: 'date', direction: 'asc' }])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter((listItem) => {
              const id = listItem.getId() ?? ''
              return !singletonTypes.has(id) && !manualListTypes.has(id) && id !== 'event'
            }),
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
