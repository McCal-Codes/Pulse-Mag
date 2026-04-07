// app/preview/login/page.tsx
// Login page for CMS editors to access preview mode

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DiamondDivider } from '@/components/DiamondDivider';
import { isPreviewMode } from '@/lib/wix-preview';
import { enablePreview } from '@/lib/preview-actions';

export const metadata: Metadata = {
  title: 'CMS Preview Login',
  description: 'Login to preview content before publishing',
  robots: { index: false, follow: false },
};

export default async function PreviewLoginPage() {
  // If already in preview mode, redirect to dashboard
  const isPreview = await isPreviewMode();
  if (isPreview) {
    redirect('/preview/dashboard');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-lg border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-4xl">👁️</span>
          <h1 className="mt-4 font-display text-2xl text-ink">CMS Preview</h1>
          <DiamondDivider className="mx-auto mt-3" />
          <p className="mt-4 text-sm text-gray-600">
            Preview how content looks on the live site before publishing.
          </p>
        </div>

        <form action={enablePreview} className="space-y-4">
          <input type="hidden" name="redirect" value="/preview/dashboard" />
          <div>
            <label htmlFor="editor" className="mb-1 block text-sm font-medium text-gray-700">
              Editor Name
            </label>
            <input
              type="text"
              id="editor"
              name="editor"
              placeholder="Your name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-nav)' }}
          >
            Enter Preview Mode
          </button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="mb-3 font-display text-sm text-ink">What you can do:</h2>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Preview blog posts from Wix before publishing</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>See how events will appear on the site</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Test links, images, and formatting</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Share preview with team members</span>
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Preview access expires after 24 hours.
        </p>
      </div>
    </div>
  );
}
