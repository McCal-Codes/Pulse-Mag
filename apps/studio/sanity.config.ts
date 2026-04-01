import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const singletonTypes = new Set(['homepageSettings'])

export default defineConfig({
  name: 'gf-magazine',
  title: 'GF Magazine Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage Settings')
              .id('homepageSettings')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId() ?? '')
            ),
          ]),
    }),
    // Vision lets you run GROQ queries directly in the Studio — useful during development
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
