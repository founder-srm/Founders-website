import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { EVENTS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600; // revalidate every hour

const EventWriteUp = async () => {
  const { data: writeUp } = await sanityFetch({ query: EVENTS_QUERY });
  // console.log(writeUp);
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-16">
        <h2 className="mx-auto mb-3 text-pretty text-center text-2xl font-semibold md:mb-4 md:text-3xl lg:mb-6 lg:max-w-3xl heading-gradient">
          Recent Events
        </h2>
        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {writeUp?.map(event => (
            <Link
              key={event.slug}
              href={`/events/writeup/${event.slug}`}
              className="group relative order-last grid gap-y-6 rounded-2xl p-4 transition-all duration-500 hover:bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent sm:order-first sm:col-span-12 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 md:p-6 lg:col-span-10 lg:col-start-2 lg:gap-x-12"
            >
              {/* Content Section */}
              <div className="sm:col-span-5">
                <div className="mb-4 md:mb-6">
                  <div className="flex flex-wrap gap-x-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-x-5 lg:gap-x-6">
                    <span>{event.label}</span>
                    <span>
                      {event.published
                        ? new Date(event.published).toLocaleDateString(
                            'en-US',
                            {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : ''}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-white md:text-2xl lg:text-3xl">
                  {event.title}
                </h3>
                <div className="mt-4 flex items-center space-x-2 md:mt-5">
                  <span className="font-semibold md:text-base">Read more</span>
                  <ArrowRight className="ml-2 size-4 transition-all duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>

              {/* Image Section */}
              <div className="order-first sm:order-last sm:col-span-5 [perspective:1000px]">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg shadow-black/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/40 group-hover:[transform:rotateY(-5deg)_rotateX(2deg)]">
                  <Image
                    src={event.image ? urlFor(event.image).url() : ''}
                    alt={event.title || ''}
                    width={500}
                    height={281}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventWriteUp;
