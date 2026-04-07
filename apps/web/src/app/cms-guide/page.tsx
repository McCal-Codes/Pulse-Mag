// app/cms-guide/page.tsx
// CMS Guide for editors managing content in Wix

import type { Metadata } from 'next';
import Link from 'next/link';
import { DiamondDivider } from '@/components/DiamondDivider';

export const metadata: Metadata = {
  title: 'CMS Guide for Editors',
  description: 'How to manage content in Pulse Magazine using Wix',
};

export default function CMSGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          CMS Guide for Editors
        </h1>
        <DiamondDivider className="mt-3" />
        <p className="mt-4 text-gray-600">
          How to manage blog posts and events for Pulse Literary & Arts Magazine
        </p>
      </div>

      {/* Quick Access */}
      <section className="mb-12 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="mb-4 font-display text-xl text-ink">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://pulse24.wixsite.com/pulse/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="font-display">Wix Dashboard</h3>
              <p className="text-xs text-gray-500">Manage all content</p>
            </div>
          </a>

          <a
            href="https://pulse24.wixsite.com/pulse/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-display">Blog Manager</h3>
              <p className="text-xs text-gray-500">Create & edit posts</p>
            </div>
          </a>

          <a
            href="https://pulse24.wixsite.com/pulse/events"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-display">Events Manager</h3>
              <p className="text-xs text-gray-500">Manage events & RSVPs</p>
            </div>
          </a>

          <Link
            href="/preview/login"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">👁️</span>
            <div>
              <h3 className="font-display">Preview Mode</h3>
              <p className="text-xs text-gray-500">See content before publishing</p>
            </div>
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-display">Live Blog</h3>
              <p className="text-xs text-gray-500">View published posts</p>
            </div>
          </Link>

          <Link
            href="/events"
            className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-all hover:bg-gray-50"
          >
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-display">Live Events</h3>
              <p className="text-xs text-gray-500">View published events</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Managing Blog Posts</h2>
        
        <div className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">1. Creating a New Post</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>Go to <a href="https://pulse24.wixsite.com/pulse/blog" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Wix Blog Manager</a></li>
              <li>Click &quot;Create Post&quot; or the + button</li>
              <li>Add a compelling title (this becomes the URL slug)</li>
              <li>Write your content using the Wix editor</li>
              <li>Add a featured image (recommended: 1200x630px)</li>
              <li>Select categories and add tags</li>
            </ol>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">2. Preview Before Publishing</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>Save your post as a draft in Wix</li>
              <li>Go to <Link href="/preview/login" className="text-blue-600 underline">Preview Mode</Link> on pulseliterary.com</li>
              <li>Navigate to the blog section to see how it will look</li>
              <li>Check formatting, images, and links</li>
              <li>Make edits in Wix if needed</li>
              <li>When ready, publish in Wix</li>
            </ol>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">3. Best Practices</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li><strong>Featured images:</strong> Use high-quality images, 1200x630px optimal</li>
              <li><strong>Categories:</strong> Choose relevant categories for organization</li>
              <li><strong>Tags:</strong> Add 3-5 relevant tags for discoverability</li>
              <li><strong>Excerpts:</strong> Write compelling summaries (shown in listings)</li>
              <li><strong>Schedule:</strong> You can schedule posts to publish automatically</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Managing Events</h2>
        
        <div className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">1. Creating an Event</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>Go to <a href="https://pulse24.wixsite.com/pulse/events" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Wix Events Manager</a></li>
              <li>Click &quot;Create Event&quot;</li>
              <li>Add event title, date, and time</li>
              <li>Set location (physical address or online link)</li>
              <li>Upload an event image/banner</li>
              <li>Write event description</li>
              <li>Configure RSVP or ticketing options</li>
            </ol>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">2. Event Types</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li><strong>Free Events:</strong> Just RSVPs, no payment required</li>
              <li><strong>Paid Events:</strong> Sell tickets through Wix Payments</li>
              <li><strong>Online Events:</strong> Add Zoom/streaming link as location</li>
              <li><strong>In-Person:</strong> Add full venue address with map</li>
            </ul>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="mb-3 font-display text-lg">3. RSVP & Ticketing</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Enable RSVP to collect attendee information</li>
              <li>Set capacity limits if venue has restricted seating</li>
              <li>Configure early bird pricing if applicable</li>
              <li>Add custom questions to RSVP form (dietary restrictions, etc.)</li>
              <li>Send automated confirmation emails</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Preview Mode Section */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Using Preview Mode</h2>
        
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <p className="mb-4 text-sm text-gray-700">
            Preview Mode lets you see exactly how content will appear on the live site 
            <strong>before</strong> publishing it. This is essential for checking formatting, 
            images, and overall appearance.
          </p>

          <h3 className="mb-3 font-display text-lg">How to Use Preview Mode:</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>
              <Link href="/preview/login" className="text-blue-600 underline">Go to Preview Login</Link>
            </li>
            <li>Enter your name and click &quot;Enter Preview Mode&quot;</li>
            <li>You&apos;ll see a yellow banner at the top confirming preview mode</li>
            <li>Navigate to any page (Blog, Events, etc.)</li>
            <li>Content synced from Wix will appear as it will look to visitors</li>
            <li>Exit preview mode when done by clicking the button in the banner</li>
          </ol>

          <div className="mt-4 rounded border border-yellow-300 bg-yellow-100 p-3 text-xs text-yellow-800">
            <strong>Note:</strong> Preview access expires after 24 hours for security.
            Simply log in again if needed.
          </div>
        </div>
      </section>

      {/* Important Reminders */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl text-ink">Important Reminders</h2>
        
        <div className="rounded-lg border border-red-100 bg-red-50 p-6">
          <ul className="list-disc space-y-3 pl-5 text-sm text-gray-700">
            <li>
              <strong>Public URL:</strong> Always share <code>pulseliterary.com</code> — 
              never share the Wix dashboard URL
            </li>
            <li>
              <strong>Sync Time:</strong> Changes in Wix appear on the live site within 
              5 minutes automatically
            </li>
            <li>
              <strong>Drafts:</strong> Content saved as drafts in Wix won&apos;t appear 
              until published — use Preview Mode to see drafts
            </li>
            <li>
              <strong>Images:</strong> Optimize images before uploading (compress to 
              under 500KB for faster loading)
            </li>
            <li>
              <strong>Mobile Check:</strong> Always check how content looks on mobile — 
              most visitors use phones
            </li>
          </ul>
        </div>
      </section>

      {/* Support */}
      <section>
        <h2 className="mb-6 font-display text-2xl text-ink">Need Help?</h2>
        
        <div className="rounded-lg border border-black/10 bg-white p-6 text-center">
          <p className="mb-4 text-gray-700">
            If you&apos;re having trouble with the CMS or need assistance:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📝 Content not appearing? Check that it&apos;s published in Wix</li>
            <li>🖼️ Images not loading? Verify the image URL is correct</li>
            <li>🔗 Links broken? Double-check URLs include https://</li>
            <li>⚡ Still stuck? Contact the site administrator</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
