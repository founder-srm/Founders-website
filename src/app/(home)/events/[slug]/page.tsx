import { sanityFetch } from '@/sanity/lib/live';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

type Params = Promise<{ slug: string }>;

export const revalidate = 3600; // revalidate every hour

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { data: event } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug: slug },
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
            src={urlFor(event.image || '').url()}
            alt={event.title || ''}
            width={800}
            height={500}
            className="aspect-video object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none">
          {/* biome-ignore lint/style/noNonNullAssertion: Static rendered page, will always have content */}
          <PortableText value={event.content!} />
        </div>
      </div>
    </article>
  );
}
