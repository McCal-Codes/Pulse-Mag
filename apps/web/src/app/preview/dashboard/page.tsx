// app/preview/dashboard/page.tsx
// Preview dashboard for CMS editors

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DiamondDivider } from '@/components/DiamondDivider';
import { getPreviewSession } from '@/lib/wix-preview';
import { getUpcomingEvents, getPastEvents } from '@/lib/wix-events';
import { disablePreview } from '@/lib/preview-actions';

export const metadata: Metadata = {
  title: 'CMS Preview Dashboard',
  description: 'Preview content before publishing',
  robots: { index: false, follow: false },
};

export default async function PreviewDashboardPage() {
  // Verify preview mode is active
  const session = await getPreviewSession();
  if (!session?.isActive) {
    redirect('/preview/login');
  }

  // Fetch current content
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm text-yellow-800">
          <span>👁️</span>
          <span>Preview Mode Active</span>
          <span className="text-yellow-600">({session.editorName})</span>
        </div>
        <h1 className="font-display text-3xl text-ink">CMS Preview Dashboard</h1>
        <DiamondDivider className="mx-auto mt-3" />
      </div>

      {/* Quick Links */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-ink">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/events"
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md"
          >
            <span className="text-2xl">📅</span>
            <h3 className="mt-2 font-display text-lg">Events Page</h3>
            <p className="text-sm text-gray-600">Preview how events look live</p>
          </Link>

          <Link
            href="/blog"
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md"
          >
            <span className="text-2xl">📝</span>
            <h3 className="mt-2 font-display text-lg">Blog Page</h3>
            <p className="text-sm text-gray-600">Preview blog posts from Wix</p>
          </Link>

          <a
            href="https://pulse24.wixsite.com/pulse/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md"
          >
            <span className="text-2xl">⚙️</span>
            <h3 className="mt-2 font-display text-lg">Wix Dashboard</h3>
            <p className="text-sm text-gray-600">Edit content in Wix</p>
          </a>

          <a
            href="https://pulse24.wixsite.com/pulse/events"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md"
          >
            <span className="text-2xl">🎉</span>
            <h3 className="mt-2 font-display text-lg">Wix Events</h3>
            <p className="text-sm text-gray-600">Manage events in Wix</p>
          </a>
        </div>
      </section>

      {/* Events Status */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-ink">Events Status</h2>
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-lg text-green-700">
                {upcomingEvents.length} Upcoming Events
              </h3>
              <p className="text-sm text-gray-600">
                Events currently visible on the site
              </p>
              {upcomingEvents.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <li key={event.id} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="truncate">{event.title}</span>
                    </li>
                  ))}
                  {upcomingEvents.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{upcomingEvents.length - 3} more...
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-display text-lg text-gray-600">
                {pastEvents.length} Past Events
              </h3>
              <p className="text-sm text-gray-600">
                Archived events still visible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-ink">How to Preview Content</h2>
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-700">
            <li>
              <strong>Edit content in Wix:</strong> Go to the Wix Dashboard to create or edit blog posts and events.
            </li>
            <li>
              <strong>Save as draft:</strong> Content saved as draft won&apos;t be visible to the public, but you can preview it here.
            </li>
            <li>
              <strong>Preview on this site:</strong> Use the Quick Links above to see how content will look on pulseliterary.com.
            </li>
            <li>
              <strong>Publish when ready:</strong> Once satisfied, publish the content in Wix to make it live.
            </li>
          </ol>
        </div>
      </section>

      {/* Exit Preview */}
      <div className="flex justify-center">
        <form action={disablePreview}>
          <button
            type="submit"
            className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300"
          >
            Exit Preview Mode
          </button>
        </form>
      </div>
    </div>
  );
}
