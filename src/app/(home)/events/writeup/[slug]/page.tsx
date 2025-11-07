/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from 'date-fns';
import { AlignLeft, ArrowLeft, Calendar } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PortableTextWrapper } from '@/components/mdx/PortableTextWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { urlFor } from '@/sanity/lib/image';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries';

type Params = Promise<{ slug: string }>;

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { slug } = await params;

  const { data: event } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug: slug },
  });

  const previousImages = (await parent).openGraph?.images || [];

  const image = event?.image ? urlFor(event.image).url() : previousImages[0];
  return {
    title: event?.title,
    description: event?.summary,
    creator: 'Founders Club',
    publisher: 'Founders Club',
    authors: [
      {
        name: event?.author?.name || 'Founders Club',
        url: `https://www.thefoundersclub.in/events/writeup/${slug}`,
      },
    ],
    openGraph: {
      images: [image, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@foundersclubsrm',
      title: event?.title || '',
      description: event?.summary || '',
      creator: '@foundersclubsrm',
      images: {
        url: `${image}`,
        alt: `Preview image for ${event?.title}`,
      },
    },
  };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { data: event } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug: slug },
  });

  if (!event) return <div>Event not found</div>;

  return (
    <section className="py-12 w-full flex flex-col items-center">
      <div className="container">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="relative grid-cols-3 gap-20 lg:grid">
          <div className="lg:col-span-2">
            <div>
              <Badge variant="outline">{event.label}</Badge>
              <h1 className="mt-3 text-3xl font-extrabold">{event.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {event.summary}
              </p>
              <div className="mb-8 mt-8 overflow-hidden rounded-lg">
                <Image
                  src={urlFor(event.image || '').url()}
                  alt={event.title || ''}
                  width={800}
                  height={500}
                  className="aspect-video object-cover"
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* biome-ignore lint/style/noNonNullAssertion: Content always present */}
              <PortableTextWrapper value={event.content!} />
            </div>
          </div>

          <div className="sticky top-8 hidden h-fit space-y-3 lg:block">
            {event.author && (
              <div className="p-6 rounded-lg">
                <h3 className="mb-4 font-semibold">Written by</h3>
                <div className="flex items-center gap-2 md:gap-4">
                  <Avatar className="size-10">
                    <AvatarImage src={urlFor(event.author.image || '').url()} />
                    <AvatarFallback>
                      {event.author.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium md:text-base">
                      {event.author.name}
                    </p>
                    {event.author.title && (
                      <p className="text-sm text-muted-foreground md:text-base">
                        {event.author.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <h3 className="mb-4 font-semibold">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {event.published
                      ? format(new Date(event.published), 'MMMM d, yyyy')
                      : 'No date'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <span className="flex items-center gap-2 text-sm">
                <AlignLeft className="h-4 w-4" />
                On this page
              </span>
              <nav className="mt-4 text-sm">
                <ul className="space-y-2">
                  {event.content
                    ?.filter((block: any) => block.style?.startsWith('h'))
                    .map((heading: any, index: number) => (
                      <li key={index}>
                        <span className="block py-1 text-muted-foreground transition-colors duration-200 hover:text-primary">
                          {heading.children[0].text}
                        </span>
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
