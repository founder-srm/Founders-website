import { sanityFetch } from '@/sanity/lib/live';
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SanityLive } from '@/sanity/lib/live';
import { format } from 'date-fns';

const categories = [
  'Webinar',
  'Bootcamp',
  'TriumphTalk',
  'Foundathon',
  'OpenHouse',
  'Workshop'
]

export const revalidate = 3600; // revalidate every hour

export default async function EventsPage() {
  const { data: allEvents } = await sanityFetch({ query: ALL_EVENTS_QUERY });

  
  // Add pagination logic
  const eventsPerPage = 9;
  const currentPage = 1; // This would come from query params in a real implementation
  const offset = (currentPage - 1) * eventsPerPage;
  const events = allEvents.slice(offset, offset + eventsPerPage);
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);

  return (
    <section className="py-32 w-full flex flex-col items-center">
      <div className="container">
        <div className="mb-8 md:mb-14 lg:mb-16">
          <p className="text-wider mb-4 text-sm font-medium text-muted-foreground">Latest Insights</p>
          <h1 className="mb-4 w-full text-4xl font-medium md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl">Our Events</h1>
          <p className="text-xl text-muted-foreground">Exploring the cutting edge of entrepreneurship and tech</p>
        </div>

        {events && (
          <Link href={`/events/writeup/${events[0].slug}`} className="mb-12 hidden md:block">
            <h2 className="mb-6 text-2xl font-semibold">Featured Post</h2>
            <div className="group relative overflow-hidden rounded-xl">
              <Image
                src={urlFor(events[0].image || "/placeholder.svg").url()}
                alt={events[0].title || ''}
                width={1200}
                height={600}
                className="aspect-[2/1] w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 p-6 text-white">
                  <div className="mb-2 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {events[0].type}
                  </div>
                  <h3 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">{events[0].title}</h3>
                  <p className="mb-4 text-sm md:text-base">{events[0].summary}</p>
                  <div className="flex items-center gap-2">
                    <Image
                      src={urlFor(events[0].author?.image || "/placeholder.svg").url()}
                      alt={events[0].author?.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm">{events[0].author?.name}</span>
                    <span className="text-sm text-gray-300">•</span>
                    <span className="text-sm text-gray-300">{events[0].published ? format(new Date(events[0].published), 'MMMM d, yyyy') : 'No date'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
          {events.map((event) => (
            <Link key={event._id} href={`/events/writeup/${event.slug}`} className="group flex flex-col">
              <div className="mb-4 flex overflow-clip rounded-xl md:mb-5">
                <div className="h-full w-full transition duration-300 group-hover:scale-105">
                  <Image
                    src={urlFor(event.image || "/placeholder.svg").url()}
                    alt={event.title || ''}
                    width={600}
                    height={400}
                    className="aspect-[3/2] h-full w-full object-cover object-center"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  {event.type}
                </div>
              </div>
              <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-2xl lg:pt-4 lg:text-3xl">
                {event.title}
              </div>
              <div className="mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5 md:text-base">
                {event.summary}
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
                  <Image
                    className="aspect-square h-full w-full"
                    src={urlFor(event.author?.image || "/placeholder.svg").url()}
                    alt={event.author?.name || ''}
                    width={48}
                    height={48}
                  />
                </span>
                <div className="flex flex-col gap-px">
                  <span className="text-xs font-medium">{event.author?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {event.published ? format(new Date(event.published), 'MMMM d, yyyy') : 'No date'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 border-t border-border py-8">
          <h2 className="mb-6 text-2xl font-semibold">Subscribe to Our Newsletter</h2>
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="max-w-sm" />
            <Button type="submit">
              Subscribe
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-8 border-t border-border py-2 md:mt-10 lg:mt-12">
          <nav aria-label="pagination" className="mx-auto flex w-full justify-center">
            <ul className="flex flex-row items-center gap-1 w-full justify-between">
              <li>
                <Button
                  variant="ghost"
                  className="gap-1 pl-2.5"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </li>
              <div className="hidden items-center gap-1 md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <Button
                      variant={page === currentPage ? "default" : "ghost"}
                      className="h-10 w-10"
                    >
                      {page}
                    </Button>
                  </li>
                ))}
              </div>
              <li>
                <Button
                  variant="ghost"
                  className="gap-1 pr-2.5"
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
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






