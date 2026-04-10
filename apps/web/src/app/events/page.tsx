import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity.client'
import { allEventsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import type { Event } from '@/lib/types'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events from Pulse Literary & Arts Magazine. Join us for readings, workshops, and community gatherings.',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isUpcoming(dateString: string) {
  return new Date(dateString) >= new Date()
}

export const revalidate = 60

export default async function EventsPage() {
  const events = await sanityClient?.fetch<Event[]>(allEventsQuery) ?? []
  
  const upcomingEvents = events.filter(e => isUpcoming(e.date))
  const pastEvents = events.filter(e => !isUpcoming(e.date)).reverse()

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-[var(--color-nav)] sm:text-5xl">
          Events
        </h1>
        <DiamondDivider className="mt-3" />
        <p className="mt-4 text-gray-600">
          Join us for readings, workshops, and community gatherings.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No events scheduled at this time.</p>
          <p className="text-sm text-gray-400 mt-2">
            Check back soon for upcoming readings and workshops.
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-8 font-display text-2xl text-ink">Upcoming Events</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <article
                    key={event._id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-shadow hover:shadow-lg"
                  >
                    {event.image && (
                      <div className="relative aspect-[2/1] overflow-hidden">
                        <Image
                          src={urlFor(event.image).width(800).height(400).url()}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 text-sm text-gray-400">
                        <time dateTime={event.date}>
                          {formatDate(event.date)} at {formatTime(event.date)}
                        </time>
                      </div>
                      <h3 className="font-display text-xl text-ink group-hover:text-[var(--color-nav)]">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                      )}
                      {event.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                          {event.description}
                        </p>
                      )}
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-sm font-medium text-[var(--color-nav)] hover:underline"
                        >
                          RSVP / More Info →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="mb-8 font-display text-2xl text-ink">Past Events</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <article
                    key={event._id}
                    className="flex gap-4 rounded-lg border border-black/10 bg-white/50 p-4 opacity-80"
                  >
                    {event.image && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={urlFor(event.image).width(160).height(160).url()}
                          alt={event.title}
                          fill
                          className="object-cover grayscale"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">
                        <time dateTime={event.date}>{formatDate(event.date)}</time>
                      </div>
                      <h3 className="mt-1 font-display text-base text-ink">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="mt-1 text-xs text-gray-500">{event.location}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Contact */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          Want to propose an event? Contact us at{' '}
          <a
            href="mailto:editor@pulseliterary.com"
            className="underline hover:text-[var(--color-nav)]"
          >
            editor@pulseliterary.com
          </a>
        </p>
      </div>
    </div>
  )
}
