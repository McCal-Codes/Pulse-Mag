import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

// Only wrap with Sentry when a DSN is configured — keeps local dev lean
export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Suppress build output in local dev; CI stays verbose
      silent: process.env.NODE_ENV !== 'production',

      // Upload a larger set of source maps to get better stack traces
      widenClientFileUpload: true,

      // Route Sentry requests through /monitoring to avoid ad-blockers
      tunnelRoute: '/monitoring',

      // Hide source maps from the client bundle
      hideSourceMaps: true,

      // Remove Sentry SDK debug logging from production bundles
      disableLogger: true,

      // Capture Vercel Cron Monitor heartbeats automatically
      automaticVercelMonitors: true,
    })
  : nextConfig
