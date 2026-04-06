// lib/wix-events.ts
// Wix Events SDK integration - supports event listings, RSVPs, and ticket sales
// Site: https://pulse24.wixsite.com/pulse

import { createClient, OAuthStrategy, ApiKeyStrategy } from '@wix/sdk';
import { events } from '@wix/events';

// Environment variables
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
const WIX_API_KEY = process.env.WIX_API_KEY || '';

// Client types based on authentication method
let client: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Wix client with API key authentication
 * This is the recommended approach for server-side usage
 */
function initializeClient() {
  if (client) return client;

  // Check if credentials are set
  if (!WIX_API_KEY || !WIX_SITE_ID) {
    console.error('[wix-events] Wix API credentials missing. Check WIX_API_KEY and WIX_SITE_ID in .env.local');
    return null;
  }

  try {
    client = createClient({
      modules: { events },
      auth: ApiKeyStrategy({
        apiKey: WIX_API_KEY,
        siteId: WIX_SITE_ID,
      }),
    });

    return client;
  } catch (error) {
    console.error('[wix-events] Failed to initialize Wix client:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Event Types
// ---------------------------------------------------------------------------

export interface WixEvent {
  id: string;
  title: string;
  slug: string;
  description?: string;
  date: string; // ISO date string
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  venue?: string;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELED';
  image?: {
    url: string;
    alt?: string;
  };
  rsvpLink?: string;
  ticketLink?: string;
  capacity?: number;
  attendees?: number;
  isFree: boolean;
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  categories?: string[];
  tags?: string[];
}

export interface RSVPForm {
  eventId: string;
  name: string;
  email: string;
  guests?: number;
  message?: string;
}

// ---------------------------------------------------------------------------
// Event Queries
// ---------------------------------------------------------------------------

/**
 * Fetch all events from Wix Events
 * Supports filtering by status (upcoming, past, etc.)
 */
export async function getWixEvents(): Promise<WixEvent[]> {
  const wix = initializeClient();
  if (!wix) {
    console.warn('[wix-events] Client not initialized, returning empty events list');
    return [];
  }

  try {
    const response = await wix.events.listEvents({
      // Fetch all events, we'll filter by date in the component
      // This gives us more control over display logic
    });

    // Map Wix SDK response to our interface
    const wixEvents = response.events || [];
    
    return wixEvents.map(mapWixEventToInterface);
  } catch (error) {
    console.error('[wix-events] Failed to fetch events:', error);
    return [];
  }
}

/**
 * Fetch a single event by ID or slug
 */
export async function getWixEventById(eventId: string): Promise<WixEvent | null> {
  const wix = initializeClient();
  if (!wix) return null;

  try {
    const response = await wix.events.getEvent(eventId);
    return response?.event ? mapWixEventToInterface(response.event) : null;
  } catch (error) {
    console.error(`[wix-events] Failed to fetch event ${eventId}:`, error);
    return null;
  }
}

/**
 * Fetch upcoming events (events with date >= now)
 */
export async function getUpcomingEvents(): Promise<WixEvent[]> {
  const events = await getWixEvents();
  const now = new Date().toISOString();
  
  return events
    .filter(e => e.date >= now && e.status !== 'CANCELED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Fetch past events (events with date < now)
 */
export async function getPastEvents(): Promise<WixEvent[]> {
  const events = await getWixEvents();
  const now = new Date().toISOString();
  
  return events
    .filter(e => e.date < now || e.status === 'ENDED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first
}

// ---------------------------------------------------------------------------
// RSVP Operations
// ---------------------------------------------------------------------------

/**
 * Submit an RSVP for an event
 * Returns success status and any error message
 */
export async function submitRSVP(form: RSVPForm): Promise<{ success: boolean; error?: string }> {
  const wix = initializeClient();
  if (!wix) {
    return { success: false, error: 'Wix client not initialized' };
  }

  try {
    await wix.events.rsvpToEvent({
      eventId: form.eventId,
      rsvp: {
        contactId: undefined, // Will be created/looked up by email
        email: form.email,
        name: form.name,
        guests: form.guests || 1,
        message: form.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[wix-events] RSVP submission failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'RSVP submission failed' 
    };
  }
}

/**
 * Check if RSVP is available for an event
 */
export async function isRSVPEnabled(eventId: string): Promise<boolean> {
  const wix = initializeClient();
  if (!wix) return false;

  try {
    const response = await wix.events.getEvent(eventId);
    return response?.event?.rsvpStatus === 'ENABLED' || false;
  } catch (error) {
    console.error(`[wix-events] Failed to check RSVP status for ${eventId}:`, error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Ticket Operations (if using Wix Tickets)
// ---------------------------------------------------------------------------

/**
 * Check if ticket sales are enabled for an event
 */
export async function isTicketSalesEnabled(eventId: string): Promise<boolean> {
  const wix = initializeClient();
  if (!wix) return false;

  try {
    const response = await wix.events.getEvent(eventId);
    return response?.event?.ticketSalesStatus === 'SALE_ACTIVE' || false;
  } catch (error) {
    console.error(`[wix-events] Failed to check ticket status for ${eventId}:`, error);
    return false;
  }
}

/**
 * Get ticket information for an event
 */
export async function getEventTickets(eventId: string) {
  const wix = initializeClient();
  if (!wix) return null;

  try {
    const response = await wix.events.listTickets({ eventId });
    return response.tickets || [];
  } catch (error) {
    console.error(`[wix-events] Failed to fetch tickets for ${eventId}:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map Wix SDK event format to our interface
 */
function mapWixEventToInterface(event: any): WixEvent {
  // Extract date from Wix format (could be scheduled or immediate)
  const date = event.scheduling?.config?.startDate || event.date;
  const endDate = event.scheduling?.config?.endDate;

  // Build location string from venue details
  const location = event.location?.name || event.venue?.name;
  const address = event.location?.address;

  // Determine status based on date and Wix status
  let status: WixEvent['status'] = 'UPCOMING';
  if (event.status === 'CANCELED') {
    status = 'CANCELED';
  } else if (event.status === 'ENDED' || (endDate && new Date(endDate) < new Date())) {
    status = 'ENDED';
  } else if (date && new Date(date) <= new Date()) {
    status = 'ONGOING';
  }

  // Build image URL from Wix format
  const image = event.mainImage?.url || event.coverImage?.url;

  // Determine pricing info
  const isFree = !event.registration?.tickets || event.registration?.tickets?.length === 0;
  const tickets = event.registration?.tickets || [];
  const prices = tickets.map((t: any) => t.price?.value).filter((p: number | undefined) => p !== undefined);

  return {
    id: event.id,
    title: event.title,
    slug: event.slug || event.id,
    description: event.description,
    date,
    endDate,
    location: location ? {
      name: location,
      address: address?.formatted,
      city: address?.city,
      country: address?.country,
    } : undefined,
    venue: location,
    status,
    image: image ? { url: image, alt: event.title } : undefined,
    rsvpLink: event.registration?.rsvp?.url,
    ticketLink: event.registration?.tickets?.[0]?.url,
    capacity: event.registration?.capacity,
    attendees: event.registration?.registeredCount,
    isFree,
    price: prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: tickets[0]?.price?.currency,
    } : undefined,
    categories: event.categories?.map((c: any) => c.name) || [],
    tags: event.tags || [],
  };
}

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format event time for display
 */
export function formatEventTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
