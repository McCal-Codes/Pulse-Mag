// lib/preview-actions.ts
// Server Actions for preview mode management
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const PREVIEW_SECRET = process.env.WIX_PREVIEW_SECRET || 'pulse-preview-2024';

/**
 * Generate preview token for an editor
 */
function generatePreviewToken(editorName: string): string {
  const timestamp = Date.now().toString();
  const signature = generateSignature(editorName, timestamp);
  const token = Buffer.from(`${editorName}:${timestamp}:${signature}`).toString('base64');
  return token;
}

/**
 * Generate HMAC-style signature for token verification
 */
function generateSignature(editorName: string, timestamp: string): string {
  const data = `${editorName}:${timestamp}:${PREVIEW_SECRET}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Enable preview mode
 */
export async function enablePreview(formData: FormData) {
  const editor = formData.get('editor') as string || 'CMS Editor';
  const redirectTo = formData.get('redirect') as string || '/preview/dashboard';
  
  const token = generatePreviewToken(editor);
  
  const cookieStore = await cookies();
  cookieStore.set('wix_preview_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  redirect(redirectTo);
}

/**
 * Disable preview mode
 */
export async function disablePreview() {
  const cookieStore = await cookies();
  cookieStore.delete('wix_preview_token');
  redirect('/');
}
