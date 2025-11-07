import { format } from 'date-fns';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { urlFor } from '@/sanity/lib/image';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import {
  ALL_EVENTS_QUERY,
  EVENT_SETTINGS_QUERY,
} from '@/sanity/lib/queries';
import { FilterableEventsGrid } from './FilterableEventsGrid';

const categories = [
  'All',
  'Webinar',
  'Bootcamp',
  'TriumphTalk',
  'Foundathon',
  'OpenHouse',
  'Workshop',
];

export const revalidate = 3600;

export const metadata = {
  title: 'Events | Our Latest Events',
  description: 'Exploring the cutting edge of entrepreneurship and tech',
};

export default async function EventsPage() {
  const { data: allEvents } = await sanityFetch({ query: ALL_EVENTS_QUERY });
  const { data: eventSettings } = await sanityFetch({
    query: EVENT_SETTINGS_QUERY,
  });

  // Use featured event from settings, or fallback to first event
  const featuredEvent = eventSettings?.featuredEvent || allEvents?.[0];

  return (
    <section className="py-16 sm:py-24 md:py-32 w-full flex flex-col items-center">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header Section  Server Rendered */}
        <div className="mb-8 md:mb-14 lg:mb-16">
          <p className="text-wider mb-2 sm:mb-4 text-sm font-medium text-muted-foreground">
            Latest Insights
          </p>
          <h1 className="mb-3 sm:mb-4 w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
            Our Events
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Exploring the cutting edge of entrepreneurship and tech
          </p>
        </div>

        {/* Featured Post */}
        {featuredEvent && (
          <div className="mb-8 sm:mb-12 block">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
              Featured Post
            </h2>

            <Link
              href={`/events/writeup/${featuredEvent.slug}`}
              aria-label={`View details of ${featuredEvent.title}`}
              className="group relative overflow-hidden rounded-xl flex flex-col sm:block cursor-pointer"
            >
              <Image
                src={urlFor(featuredEvent.image || '/placeholder.svg').url()}
                alt={featuredEvent.title || ''}
                width={1200}
                height={600}
                className="aspect-[2/1] w-full object-cover transition duration-300 group-hover:opacity-50 group-hover:scale-105"
              />

              <div className="sm:absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="sm:absolute bottom-0 p-4 sm:p-6 text-black sm:text-white">
                  <div className="mb-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {featuredEvent.type}
                  </div>
                  <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {featuredEvent.title}
                  </h3>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 text-muted-foreground">
                    {featuredEvent.summary}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Image
                      src={urlFor(
                        featuredEvent.author?.image || '/placeholder.svg'
                      ).url()}
                      alt={featuredEvent.author?.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {featuredEvent.author?.name}
                    </span>
                    <span className="text-xs sm:text-sm text-white/30">•</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {featuredEvent.published
                        ? format(
                            new Date(featuredEvent.published),
                            'MMMM d, yyyy'
                          )
                        : 'No date'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white text-6xl font-semibold px-4 text-center">
                Click to view the full article
              </div>
            </Link>
          </div>
        )}

        {/* Client Component for Interactive Filtering - PPR */}
        <FilterableEventsGrid events={allEvents} categories={categories} />

        {/* Newsletter Section Server Rendered */}
        <div className="mt-12 border-t border-border py-8">
          <h2 className="mb-6 text-xl sm:text-2xl font-semibold">
            Subscribe to Our Newsletter
          </h2>
          <form className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-sm"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      
    </section>
  );
}
