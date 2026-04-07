// app/preview/wix/page.tsx
// Wix-compatible preview page for CMS editors
// Accessible from Wix dashboard via URL with token

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PreviewContent } from './PreviewContent';

export const metadata: Metadata = {
  title: 'Preview - Pulse Magazine',
  description: 'Preview content before publishing',
  robots: { index: false, follow: false },
};

interface SearchParams {
  token?: string;
  type?: 'blog' | 'event' | 'page';
  slug?: string;
  id?: string;
}

export default async function WixPreviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { token, type, slug, id } = params;

  // Validate preview token
  if (!token) {
    // No token - redirect to login
    redirect('/preview/login?redirect=/preview/wix');
  }

  // Token validation happens in PreviewContent component
  // This allows showing a helpful error rather than 404

  return (
    <PreviewContent
      token={token}
      contentType={type || 'page'}
      slug={slug}
      contentId={id}
    />
  );
}
