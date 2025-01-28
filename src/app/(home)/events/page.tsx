import { sanityFetch } from '@/sanity/lib/live';
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SanityLive } from '@/sanity/lib/live';
import { format } from 'date-fns';
import { Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  'Webinar',
  'Bootcamp',
  'TriumphTalk',
  'Foundathon',
  'OpenHouse',
  'Workshop',
];

export const revalidate = 3600;

export default async function EventsPage() {
  const { data: allEvents } = await sanityFetch({ query: ALL_EVENTS_QUERY });

  const eventsPerPage = 9;
  const currentPage = 1;
  const offset = (currentPage - 1) * eventsPerPage;
  const events = allEvents.slice(offset, offset + eventsPerPage);
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);

  return (
    <section className="py-16 sm:py-24 md:py-32 w-full flex flex-col items-center">
      <div className="container px-4 sm:px-6 lg:px-8">
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

        {events && (
          <div className="mb-8 sm:mb-12 block">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
              Featured Post
            </h2>
            <div className="group relative overflow-hidden rounded-xl flex flex-col sm:block">
              <Image
                src={urlFor(events[0].image || '/placeholder.svg').url()}
                alt={events[0].title || ''}
                width={1200}
                height={600}
                className="aspect-[2/1] w-full object-cover transition duration-300 group-hover:opacity-50 group-hover:scale-105"
              />
              <div className="sm:absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="sm:absolute bottom-0 p-4 sm:p-6 text-black sm:text-white">
                  <div className="mb-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {events[0].type}
                  </div>
                  <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {events[0].title}
                  </h3>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 text-muted-foreground">
                    {events[0].summary}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Image
                      src={urlFor(
                        events[0].author?.image || '/placeholder.svg'
                      ).url()}
                      alt={events[0].author?.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {events[0].author?.name}
                    </span>
                    <span className="text-xs sm:text-sm text-white/30">•</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {events[0].published
                        ? format(new Date(events[0].published), 'MMMM d, yyyy')
                        : 'No date'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white text-6xl font-semibold px-4 text-center">
                Click to view the full article
              </div>
              <Link
                href={`/events/writeup/${events[0].slug}`}
                className="mt-4 sm:hidden"
              >
                <Button className="w-full">Read Article</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-x-4 gap-y-[50px] sm:gap-y-8 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
          {events.map(event => (
            <div key={event._id} className="group flex flex-col">
              <Link href={`/events/writeup/${event.slug}`} className="block">
                <div className="relative mb-3 sm:mb-4 md:mb-5 flex overflow-clip rounded-xl">
                  <Image
                    src={urlFor(event.image || '/placeholder.svg').url()}
                    alt={event.title || ''}
                    width={600}
                    height={400}
                    className="aspect-[3/2] h-full w-full object-cover object-center transition duration-300 group-hover:opacity-50 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white text-base sm:text-lg md:text-4xl font-semibold px-4 text-center">
                    Click to view the full article
                  </div>
                </div>
              </Link>
              <div>
                <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  {event.type}
                </div>
              </div>
              <Link href={`/events/writeup/${event.slug}`} className="block">
                <div className="mb-2 line-clamp-2 sm:line-clamp-3 break-words pt-2 sm:pt-3 md:pt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-medium">
                  {event.title}
                </div>
                <div className="mb-3 sm:mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {event.summary}
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    className="aspect-square h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                    src={urlFor(
                      event.author?.image || '/placeholder.svg'
                    ).url()}
                    alt={event.author?.name || ''}
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {event.author?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.published
                        ? format(new Date(event.published), 'MMMM d, yyyy')
                        : 'No date'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/events/writeup/${event.slug}`}
                  className="sm:hidden w-max"
                >
                  <Button size="sm">Read</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

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

        <div className="mt-8 border-t border-border py-2 md:mt-10 lg:mt-12">
          <nav
            aria-label="pagination"
            className="mx-auto flex w-full justify-center"
          >
            <ul className="flex flex-row items-center gap-1 w-full justify-between">
              <li>
                <Button
                  variant="ghost"
                  className="gap-1 pl-2.5"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              </li>
              <div className="hidden items-center gap-1 md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <li key={page}>
                      <Button
                        variant={page === currentPage ? 'default' : 'ghost'}
                        className="h-10 w-10"
                      >
                        {page}
                      </Button>
                    </li>
                  )
                )}
              </div>
              <li>
                <Button
                  variant="ghost"
                  className="gap-1 pr-2.5"
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <SanityLive />
    </section>
  );
}
