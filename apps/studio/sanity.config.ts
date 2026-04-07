import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const singletonTypes = new Set(['homepageSettings', 'editorialGuide', 'siteSettings'])

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
            // Editorial Guide - pinned at top
            S.listItem()
              .title('Editorial Guide')
              .id('editorialGuide')
              .icon(() => '📖')
              .child(S.document().schemaType('editorialGuide').documentId('editorialGuide')),
            
            S.divider(),
            
            // Site Settings Group
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .icon(() => '⚙️')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Homepage Settings')
              .id('homepageSettings')
              .icon(() => '🏠')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            
            S.divider(),
            
            // Literary Content (Sanity)
            S.listItem()
              .title('Magazine Content')
              .id('magazineContent')
              .icon(() => '📚')
              .child(
                S.list()
                  .title('Magazine Content')
                  .items([
                    S.listItem()
                      .title('Authors')
                      .id('authors')
                      .icon(() => '✍️')
                      .child(S.documentTypeList('author').title('Authors')),
                    S.listItem()
                      .title('Posts')
                      .id('posts')
                      .icon(() => '📝')
                      .child(
                        S.documentTypeList('post')
                          .title('Posts')
                          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Events')
                      .id('events')
                      .icon(() => '📅')
                      .child(
                        S.documentTypeList('event')
                          .title('Events')
                          .defaultOrdering([{ field: 'date', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('Pages')
                      .id('pages')
                      .icon(() => '📄')
                      .child(S.documentTypeList('page').title('Pages')),
                  ])
              ),
            
            // Blog Content (Wix-synced)
            S.listItem()
              .title('Blog (Wix)')
              .id('weeklyBlogList')
              .icon(() => '🌐')
              .child(
                S.documentTypeList('weeklyBlog')
                  .title('Blog Posts')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            
            S.divider(),
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
