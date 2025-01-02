import { sanityFetch } from '@/sanity/lib/live';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries';
// import type { Event } from '@/sanity/lib/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

interface Props {
  params: {
    slug: string;
  };
}

// export async function generateStaticParams() {
//   const { data: events } = await sanityFetch({ query: ALL_EVENTS_QUERY });

//   return events?.map((event: Event) => ({
//     slug: event.slug,
//   }));
// }

export default async function EventPage({ params }: Props) {
  const { data: event } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug: params.slug },
  });

  if (!event) return <div>Event not found</div>;

  return (
    <article className="container mx-auto py-12 max-w-4xl overflow-y-auto">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex gap-2 text-sm text-muted-foreground">
          <span>{event.label}</span>
          <span>•</span>
          <time>{event.published}</time>
        </div>
        <h1 className="mb-8 text-4xl font-bold">{event.title}</h1>
        <div className="mb-8 overflow-hidden rounded-lg">
          <Image
            src={urlFor(event.image).url()}
            alt={event.title}
            width={800}
            height={500}
            className="aspect-video object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none">
          <PortableText value={event.content} />
        </div>
      </div>
    </article>
  );
}
