import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },

  autoUpdates: false,

  // Allow Vite to serve files from the project root on any drive (e.g. exFAT I: drive)
  // https://vite.dev/config/server-options.html#server-fs-allow
  vite: (config) => ({
    ...config,
    server: {
      ...config.server,
      fs: {
        allow: ['..'],
      },
    },
  }),
})
