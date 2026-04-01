import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Disable auto-updates to keep version pinned in package.json
  autoUpdates: false,
})
