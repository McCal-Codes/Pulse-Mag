import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Only initialise when a DSN is present — safe to omit in local dev
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 100% of transactions in dev, reduce in production as needed
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  // Session replay: capture all replays on error, 10% of normal sessions
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  debug: false,
})
