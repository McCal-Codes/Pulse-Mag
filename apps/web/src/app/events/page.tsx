import type { Metadata } from 'next'
import Image from 'next/image'
import { DiamondDivider } from '@/components/DiamondDivider'
import { getUpcomingEvents, getPastEvents, type WixEvent } from '@/lib/wix-events'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events from Pulse Literary & Arts Magazine.',
}

export const revalidate = 300 // Revalidate every 5 minutes

function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function EventCard({ event, isPast = false }: { event: WixEvent; isPast?: boolean }) {
  return (
    <article
      className={`flex flex-col gap-5 rounded border p-6 shadow-sm sm:flex-row ${
        isPast
          ? 'border-black/8 bg-white/40 opacity-70'
          : 'border-black/10 bg-white/70'
      }`}
    >
      {/* Event Image */}
      {event.image && !isPast && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded sm:h-32 sm:w-32">
          <Image
            src={event.image.url}
            alt={event.image.alt || event.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Date & Location */}
          <p className={`uppercase tracking-widest text-gray-400 ${isPast ? 'text-[0.6rem]' : 'text-[0.65rem]'}`}>
            {formatEventDate(event.date)}
            {event.endDate && ` - ${formatEventDate(event.endDate)}`}
            {event.venue && ` · ${event.venue}`}
          </p>

          {/* Title */}
          <h3 className={`font-display text-ink ${isPast ? 'mt-0.5 text-base' : 'mt-1.5 text-xl'}`}>
            {event.title}
          </h3>

          {/* Description */}
          {event.description && !isPast && (
            <p className="mt-2 text-sm leading-7 text-gray-600">{event.description}</p>
          )}

          {/* Event Tags */}
          {event.categories && event.categories.length > 0 && !isPast && (
            <div className="mt-2 flex flex-wrap gap-2">
              {event.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Price Info */}
          {!isPast && !event.isFree && event.price && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              {event.price.min === event.price.max
                ? `$${event.price.min}${event.price.currency ? ` ${event.price.currency}` : ''}`
                : `$${event.price.min} - $${event.price.max}${event.price.currency ? ` ${event.price.currency}` : ''}`}
            </p>
          )}
          {!isPast && event.isFree && (
            <p className="mt-2 text-sm font-medium text-green-600">Free</p>
          )}
        </div>

        {/* Action Buttons */}
        {!isPast && (
          <div className="mt-4 flex flex-wrap gap-3">
            {event.rsvpLink && (
              <a
                href={event.rsvpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-fit rounded-full px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-nav)' }}
              >
                RSVP
              </a>
            )}
            {event.ticketLink && (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-fit rounded-full border border-current px-5 py-2 text-sm font-medium transition-all hover:bg-black/5"
                style={{ color: 'var(--color-nav)' }}
              >
                Get Tickets
              </a>
            )}
            {!event.rsvpLink && !event.ticketLink && event.status === 'UPCOMING' && (
              <span className="inline-block w-fit rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500">
                Coming Soon
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default async function EventsPage() {
  // Fetch events from Wix Events SDK
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ])

  const hasEvents = upcoming.length > 0 || past.length > 0

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Events</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {!hasEvents ? (
        <div className="rounded border border-black/10 bg-white/60 px-8 py-14 text-center">
          <p className="font-display text-2xl text-ink">No upcoming events</p>
          <p className="mt-3 text-sm text-gray-500">
            Check back soon — events will appear here once they&apos;re added in the Wix dashboard.
          </p>
          <p className="mt-6 text-[0.7rem] uppercase tracking-widest text-gray-400">
            Stay In Tune &darr; Follow us on social media for the latest updates
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <section className="mb-14">
              <h2 className="mb-6 font-display text-2xl text-ink">Upcoming Events</h2>
              <div className="space-y-6">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <section>
              <h2 className="mb-6 font-display text-2xl text-gray-400">Past Events</h2>
              <div className="space-y-4">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
