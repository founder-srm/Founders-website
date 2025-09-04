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
              className="group order-last grid gap-y-6 sm:order-first sm:col-span-12 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:col-span-10 lg:col-start-2 lg:gap-x-12"
            >
              <div className="sm:col-span-5">
                <div className="mb-4 md:mb-6">
                  <div className="flex text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="mr-3 md:mr-5 lg:mr-6">{event.label}</span>
                    <span className="mr-3 md:mr-5 lg:mr-6">
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
                <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                  {event.title}
                </h3>
                <div className="mt-4 flex items-center space-x-2 md:mt-5">
                  <span className="font-semibold md:text-base">Read more</span>
                  <ArrowRight className="ml-2 size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="order-first sm:order-last sm:col-span-5">
                <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                  <Image
                    src={event.image ? urlFor(event.image).url() : ''}
                    alt={event.title || ''}
                    width={500}
                    height={281}
                    className=" h-full w-full object-cover transition-transform group-hover:scale-[1.05]"
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
