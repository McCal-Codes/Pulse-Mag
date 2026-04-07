// app/api/preview/validate/route.ts
// API route to validate preview tokens and return preview data

import { NextRequest, NextResponse } from 'next/server';
import { verifyPreviewToken } from '@/lib/wix-preview';
import { fetchWixRSSPosts } from '@/lib/wix-rss';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, type, slug, id } = body;

    // Verify the token
    const session = await verifyPreviewToken(token);
    
    if (!session?.isActive) {
      return NextResponse.json({
        isValid: false,
        error: 'Invalid or expired preview token',
      }, { status: 401 });
    }

    // Fetch content based on type
    let content = null;

    if (type === 'blog' && slug) {
      // Try to fetch the specific blog post
      try {
        const posts = await fetchWixRSSPosts();
        content = posts.find((p) => p.slug === slug) || null;
      } catch {
        content = null;
      }
    }

    return NextResponse.json({
      isValid: true,
      editorName: session.editorName,
      content,
      type,
      slug,
      id,
    });
  } catch {
    return NextResponse.json({
      isValid: false,
      error: 'Failed to validate preview token',
    }, { status: 500 });
  }
}
