'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/lib/image';

interface FilterableEventsGridProps {
  events: any[];
  categories: string[];
}

export function FilterableEventsGrid({ events, categories }: FilterableEventsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  // filters event based on selected category (*imp* case-insensitive comparison)
  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter(event => 
          event.type?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // pagination logic
  const offset = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(offset, offset + eventsPerPage);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Category Filter Buttons */}
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold">
          Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Show message if no events match filter */}
      {paginatedEvents.length === 0 && selectedCategory !== 'All' ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No events found for category {selectedCategory}
          </p>
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="grid gap-x-4 gap-y-[50px] sm:gap-y-8 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
            {paginatedEvents.map(event => (
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

          {/* Pagination */}
          {totalPages > 1 && (
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
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                            onClick={() => setCurrentPage(page)}
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
                      onClick={() =>
                        setCurrentPage(prev => Math.min(totalPages, prev + 1))
                      }
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
}