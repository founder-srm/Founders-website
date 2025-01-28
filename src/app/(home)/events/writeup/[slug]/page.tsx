/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import type { Metadata, ResolvingMetadata } from 'next';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { getImageDimensions } from '@sanity/asset-utils';
import Image from 'next/image';
import {
  PortableText,
  type PortableTextComponentProps,
  type PortableTextBlock,
} from '@portabletext/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlignLeft, Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header1 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h1 className="text-4xl font-bold text-muted-foreground mb-6">{children}</h1>
);

const Header2 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h2 className="text-3xl font-semibold text-muted-foreground mb-5">
    {children}
  </h2>
);

const Header3 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
    {children}
  </h3>
);

const Header4 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h4 className="text-xl font-medium text-muted-foreground mb-4">{children}</h4>
);

const Header5 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h5 className="text-lg font-medium text-muted-foreground mb-3">{children}</h5>
);

const Header6 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h6 className="text-base font-medium text-muted-foreground mb-3">
    {children}
  </h6>
);

const BlockQuote = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => {
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  );
};

// Custom link component
const CustomLink = ({
  value,
  children,
}: { value?: { href: string }; children: React.ReactNode }) => {
  if (!value?.href) return null;
  return (
    <Link href={value.href} className="text-blue-600 hover:underline">
      {children}
    </Link>
  );
};

// Custom image component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomImage = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <div className="my-6">
      <Image
        src={urlFor(value).url()}
        alt={value.alt || ' '}
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  );
};

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

  const components = {
    block: {
      normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
        <p className="text-muted-foreground/80">{children}</p>
      ),
      h1: Header1,
      h2: Header2,
      h3: Header3,
      h4: Header4,
      h5: Header5,
      h6: Header6,
      blockquote: BlockQuote,
    },
    marks: {
      link: CustomLink,
    },
    types: {
      image: CustomImage,
    },
  };

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
              <PortableText value={event.content!} components={components} />
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
      <SanityLive />
    </section>
  );
}
