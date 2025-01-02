import { sanityFetch } from '@/sanity/lib/live';
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries';
import type { Event } from '@/sanity/lib/sanity.types';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

export default async function EventsPage() {
  const { data: events } = await sanityFetch({ query: ALL_EVENTS_QUERY });

  return (
    <div className="container py-24">
      <h1 className="mb-12 text-3xl font-bold">All Events</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event: Event) => (
          <Link
            key={event._id}
            href={`/events/${event.slug}`}
            className="group"
          >
            <div className="overflow-hidden rounded-lg">
              <Image
                src={urlFor(event.image).url()}
                alt={event.title}
                width={400}
                height={300}
                className="aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {event.label} • {event.published}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-muted-foreground">{event.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
