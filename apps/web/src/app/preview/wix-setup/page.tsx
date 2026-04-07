// app/preview/wix-setup/page.tsx
// Setup instructions for integrating preview with Wix dashboard

import type { Metadata } from 'next';
import Link from 'next/link';
import { DiamondDivider } from '@/components/DiamondDivider';

export const metadata: Metadata = {
  title: 'Wix Preview Setup Guide',
  description: 'How to set up preview in Wix dashboard',
  robots: { index: false, follow: false },
};

export default function WixSetupPage() {
  const previewBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulseliterary.com';

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Wix Preview Integration
        </h1>
        <DiamondDivider className="mt-3" />
        <p className="mt-4 text-gray-600">
          Enable CMS editors to preview content directly from the Wix dashboard
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="mb-4 font-display text-xl text-ink">How It Works</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            CMS editors can preview how content will look on <strong>pulseliterary.com</strong> 
            before publishing, directly from the Wix dashboard.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Editor creates content in Wix (blog post or event)</li>
            <li>Clicks &quot;Preview&quot; button in Wix dashboard</li>
            <li>Opens preview URL showing how it will look on the live site</li>
            <li>Can share preview link with team members for review</li>
          </ol>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Setup Instructions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">1. Get Your Preview URL</h3>
            <p className="mb-3 text-sm text-gray-700">
              Base preview URL for your site:
            </p>
            <code className="block rounded bg-gray-100 p-3 text-sm">
              {previewBaseUrl}/preview/wix
            </code>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">2. Create a Wix Dashboard Button</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>
                Go to your Wix dashboard:{' '}
                <a 
                  href="https://pulse24.wixsite.com/pulse/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  pulse24.wixsite.com/pulse/dashboard
                </a>
              </li>
              <li>Navigate to <strong>Settings → Developer Tools → Custom Apps</strong></li>
              <li>Click &quot;Add Custom App&quot;</li>
              <li>Name it &quot;Preview on Pulse Site&quot;</li>
              <li>Set the app URL to: <code className="rounded bg-gray-100 px-1">{previewBaseUrl}/preview/wix</code></li>
              <li>Choose where to display it (recommended: Blog and Events sections)</li>
              <li>Save the app</li>
            </ol>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">3. Alternative: Add Preview Links</h3>
            <p className="mb-3 text-sm text-gray-700">
              If custom apps are not available on your Wix plan, add these links as bookmarks 
              or quick links in your browser:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>
                <strong>General Preview:</strong>{' '}
                <code className="rounded bg-gray-100 px-1">{previewBaseUrl}/preview/login</code>
              </li>
              <li>
                <strong>Events Preview:</strong>{' '}
                <code className="rounded bg-gray-100 px-1">{previewBaseUrl}/events</code>
              </li>
              <li>
                <strong>Blog Preview:</strong>{' '}
                <code className="rounded bg-gray-100 px-1">{previewBaseUrl}/blog</code>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Using Preview */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Using the Preview</h2>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-3 font-display text-lg">For CMS Editors:</h3>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-700">
            <li>
              <strong>Create content in Wix:</strong> Write your blog post or create an event 
              as usual in the Wix dashboard.
            </li>
            <li>
              <strong>Save as draft:</strong> Do not publish yet - keep it as a draft while reviewing.
            </li>
            <li>
              <strong>Open preview:</strong> Click the &quot;Preview on Pulse Site&quot; button 
              (or visit the preview URL).
            </li>
            <li>
              <strong>Enter preview mode:</strong> Enter your name on the login page and click 
              &quot;Enter Preview Mode&quot;.
            </li>
            <li>
              <strong>Review content:</strong> Navigate to see how it will appear on the live site.
            </li>
            <li>
              <strong>Make edits:</strong> Return to Wix to make any needed changes.
            </li>
            <li>
              <strong>Publish:</strong> When satisfied, publish in Wix to make it live.
            </li>
          </ol>

          <div className="mt-4 rounded border border-yellow-300 bg-yellow-100 p-3 text-xs text-yellow-800">
            <strong>Tip:</strong> Preview mode lasts 24 hours. If you close the browser, 
            simply visit <Link href="/preview/login" className="underline">/preview/login</Link> again to reactivate.
          </div>
        </div>
      </section>

      {/* Direct Preview URLs */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Direct Preview URLs</h2>

        <div className="rounded-lg border border-black/10 bg-white p-6">
          <p className="mb-4 text-sm text-gray-700">
            These URLs can be used to preview specific content directly:
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Events Page</span>
              <code className="text-xs">{previewBaseUrl}/events</code>
            </div>
            <div className="flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Blog Page</span>
              <code className="text-xs">{previewBaseUrl}/blog</code>
            </div>
            <div className="flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Home Page</span>
              <code className="text-xs">{previewBaseUrl}/</code>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Note: When accessing these URLs, you&apos;ll need to activate preview mode first 
            at <Link href="/preview/login" className="underline">/preview/login</Link>
          </p>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Troubleshooting</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-2 font-display text-base">Preview not showing my latest changes?</h3>
            <p className="text-sm text-gray-700">
              The site updates every 5 minutes. Wait a moment and refresh, or try clearing 
              your browser cache.
            </p>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-2 font-display text-base">Can&apos;t access preview mode?</h3>
            <p className="text-sm text-gray-700">
              Make sure you&apos;re visiting <code className="rounded bg-gray-100 px-1">{previewBaseUrl}</code>, 
              not the Wix site URL. The preview only works on the actual pulseliterary.com site.
            </p>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-2 font-display text-base">Want to share preview with others?</h3>
            <p className="text-sm text-gray-700">
              Send them to <Link href="/preview/login" className="text-blue-600 underline">/preview/login</Link>. 
              Anyone with the link can enter preview mode - no password required, just enter a name.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Guide */}
      <div className="flex justify-center">
        <Link
          href="/cms-guide"
          className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300"
        >
          ← Back to CMS Guide
        </Link>
      </div>
    </div>
  );
}
