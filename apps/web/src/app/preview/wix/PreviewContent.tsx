// app/preview/wix/PreviewContent.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PreviewContentProps {
  token: string;
  contentType: 'blog' | 'event' | 'page';
  slug?: string;
  contentId?: string;
}

interface PreviewData {
  isValid: boolean;
  editorName?: string;
  content?: unknown;
  error?: string;
}

export function PreviewContent({ token, contentType, slug, contentId }: PreviewContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    async function validateAndLoad() {
      try {
        // Validate token and load preview data
        const response = await fetch('/api/preview/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, type: contentType, slug, id: contentId }),
        });

        const data = await response.json();
        setPreviewData(data);
      } catch {
        setPreviewData({
          isValid: false,
          error: 'Failed to load preview. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }

    validateAndLoad();
  }, [token, contentType, slug, contentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">👁️</div>
          <p className="text-yellow-800">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!previewData?.isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50 px-4">
        <div className="max-w-md rounded-lg border border-yellow-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-2 font-display text-xl text-ink">Preview Access Required</h1>
          <p className="mb-6 text-sm text-gray-600">
            {previewData?.error || 'Invalid or expired preview token. Please request a new preview link.'}
          </p>
          <Link
            href="/preview/login"
            className="inline-block rounded-full px-6 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-nav)' }}
          >
            Get Preview Access
          </Link>
        </div>
      </div>
    );
  }

  // Valid preview - show content in iframe or redirect to actual page with preview mode
  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 border-b-2 border-dashed border-yellow-500 bg-yellow-100 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">👁️</span>
            <div>
              <span className="font-semibold text-yellow-900">WIX PREVIEW MODE</span>
              {previewData.editorName && (
                <span className="ml-2 text-sm text-yellow-700">
                  - {previewData.editorName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-yellow-700">
              Viewing: {contentType}
              {slug && ` / ${slug}`}
            </span>

            <button
              onClick={() => router.push('/')}
              className="rounded border border-yellow-600 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content - Iframe to actual page */}
      <div className="h-[calc(100vh-60px)] w-full">
        <PreviewIframe
          contentType={contentType}
          slug={slug}
          contentId={contentId}
          token={token}
        />
      </div>
    </div>
  );
}

function PreviewIframe({
  contentType,
  slug,
  contentId,
  token,
}: {
  contentType: string;
  slug?: string;
  contentId?: string;
  token: string;
}) {
  // Construct the URL to preview
  let previewUrl = '/';

  if (contentType === 'blog' && slug) {
    previewUrl = `/blog/${slug}`;
  } else if (contentType === 'event' && contentId) {
    previewUrl = `/events`;
  } else if (contentType === 'page' && slug) {
    previewUrl = `/${slug}`;
  }

  // Add preview token as query parameter
  const urlWithToken = `${previewUrl}${previewUrl.includes('?') ? '&' : '?'}preview_token=${token}`;

  return (
    <iframe
      src={urlWithToken}
      className="h-full w-full border-0"
      title="Content Preview"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    />
  );
}
