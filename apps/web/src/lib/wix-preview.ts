// lib/wix-preview.ts
// Preview mode for CMS editors - fetches draft/unpublished content from Wix

import { cookies } from 'next/headers';
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { wixEventsV2 } from '@wix/events';

const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
const WIX_API_KEY = process.env.WIX_API_KEY || '';
const PREVIEW_SECRET = process.env.WIX_PREVIEW_SECRET || 'pulse-preview-2024';

// Types
export interface PreviewSession {
  isActive: boolean;
  editorName?: string;
  expiresAt: number;
}

/**
 * Verify preview token and return session info
 */
export async function verifyPreviewToken(token: string): Promise<PreviewSession | null> {
  try {
    // Simple token format: base64(editorName:timestamp:signature)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [editorName, timestampStr, signature] = decoded.split(':');
    
    if (!editorName || !timestampStr || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = generateSignature(editorName, timestampStr);
    if (signature !== expectedSignature) {
      return null;
    }

    // Check expiration (24 hours)
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }

    return {
      isActive: true,
      editorName,
      expiresAt: timestamp + 24 * 60 * 60 * 1000,
    };
  } catch {
    return null;
  }
}

/**
 * Generate preview token for an editor
 */
export function generatePreviewToken(editorName: string): string {
  const timestamp = Date.now().toString();
  const signature = generateSignature(editorName, timestamp);
  const token = Buffer.from(`${editorName}:${timestamp}:${signature}`).toString('base64');
  return token;
}

/**
 * Generate HMAC-style signature for token verification
 */
function generateSignature(editorName: string, timestamp: string): string {
  // Simple hash for demo - in production use proper HMAC
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
 * Check if preview mode is active
 */
export async function isPreviewMode(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const previewToken = cookieStore.get('wix_preview_token')?.value;
    if (!previewToken) return false;

    const session = await verifyPreviewToken(previewToken);
    return session?.isActive ?? false;
  } catch {
    return false;
  }
}

/**
 * Get preview session info
 */
export async function getPreviewSession(): Promise<PreviewSession | null> {
  try {
    const cookieStore = await cookies();
    const previewToken = cookieStore.get('wix_preview_token')?.value;
    if (!previewToken) return null;

    return verifyPreviewToken(previewToken);
  } catch {
    return null;
  }
}

/**
 * Initialize Wix client with preview capabilities
 */
function initializePreviewClient() {
  if (!WIX_API_KEY || !WIX_SITE_ID) {
    console.error('[wix-preview] Wix API credentials missing');
    return null;
  }

  try {
    return createClient({
      modules: { wixEventsV2 },
      auth: ApiKeyStrategy({
        apiKey: WIX_API_KEY,
        siteId: WIX_SITE_ID,
      }),
    });
  } catch (error) {
    console.error('[wix-preview] Failed to initialize client:', error);
    return null;
  }
}

/**
 * Fetch preview events (includes drafts)
 */
export async function fetchPreviewEvents() {
  const wix = initializePreviewClient();
  if (!wix) return [];

  try {
    // Use type assertion for SDK method access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventsModule = (wix as any).wixEventsV2;
    if (!eventsModule) return [];

    // Fetch all events including unpublished drafts
    const response = await eventsModule.queryEvents({
      // Include draft events
      includeDrafts: true,
    });

    return response?.events || [];
  } catch (error) {
    console.error('[wix-preview] Failed to fetch preview events:', error);
    return [];
  }
}

/**
 * Fetch a single event in preview mode
 */
export async function fetchPreviewEvent(eventId: string) {
  const wix = initializePreviewClient();
  if (!wix) return null;

  try {
    // Use type assertion for SDK method access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventsModule = (wix as any).wixEventsV2;
    if (!eventsModule) return null;

    const response = await eventsModule.getEvent({ eventId });
    return response?.event || null;
  } catch (error) {
    console.error(`[wix-preview] Failed to fetch preview event ${eventId}:`, error);
    return null;
  }
}
