import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { allEventsQuery } from '@/lib/queries'
import { type SanityImageSource, urlFor } from '@/lib/sanity.image'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events from Pulse Literary & Arts Magazine.',
}

export const revalidate = 60

type Event = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  location?: string
  description?: string
  link?: string
  image?: SanityImageSource
}

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatEventTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function EventsPage() {
  const client = await getSanityServerClient()
  const events = await safeSanityFetch<Event[]>(client, allEventsQuery, {}, [])

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.date) >= now)
  const past = events.filter((e) => new Date(e.date) < now)

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Events</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {events.length === 0 ? (
        <div className="rounded border border-black/10 bg-white/60 px-8 py-14 text-center">
          <p className="font-display text-2xl text-ink">No upcoming events</p>
          <p className="mt-3 text-sm text-gray-500">
            Check back soon — events will appear here once they&rsquo;re added in the Studio.
          </p>
          <p className="mt-6 text-[0.7rem] uppercase tracking-widest text-gray-400">
            Stay In Tune &darr; Follow us on social media for the latest updates
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="mb-14">
              <h2 className="mb-6 font-display text-2xl text-ink">Upcoming</h2>
              <div className="space-y-6">
                {upcoming.map((event) => (
                  <article
                    key={event._id}
                    className="flex flex-col gap-5 rounded border border-black/10 bg-white/70 p-6 shadow-sm sm:flex-row"
                  >
                    {event.image && (
                      <div className="relative h-32 w-full overflow-hidden rounded sm:h-auto sm:w-40 sm:shrink-0">
                        <Image
                          src={urlFor(event.image).width(320).height(240).fit('crop').url()}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-widest text-gray-400">
                          {formatEventDate(event.date)} &bull; {formatEventTime(event.date)}
                          {event.location && ` &bull; ${event.location}`}
                        </p>
                        <h3 className="mt-1.5 font-display text-xl text-ink">{event.title}</h3>
                        {event.description && (
                          <p className="mt-2 text-sm leading-7 text-gray-600">{event.description}</p>
                        )}
                      </div>
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block w-fit rounded-full px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-nav)' }}
                        >
                          RSVP / More Info
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="mb-6 font-display text-2xl text-gray-400">Past Events</h2>
              <div className="space-y-4">
                {past.map((event) => (
                  <article
                    key={event._id}
                    className="flex items-center gap-5 rounded border border-black/8 bg-white/40 px-5 py-4 opacity-70"
                  >
                    <div className="flex-1">
                      <p className="text-[0.6rem] uppercase tracking-widest text-gray-400">
                        {formatEventDate(event.date)}
                        {event.location && ` · ${event.location}`}
                      </p>
                      <h3 className="mt-0.5 font-display text-base text-ink">{event.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
