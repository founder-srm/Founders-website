import { formatInTimeZone } from 'date-fns-tz';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { eventsInsertType } from '../../schema.zod';
import { GetBlurImage } from './blur-image';

export function FeaturedPost({ event }: { event: eventsInsertType }) {
  if (!event) {
    return null;
  }
  const tags = event.tags.map(tag => (
    <Badge key={tag} variant="default">
      {tag}
    </Badge>
  ));

  return (
    <Link href={`/upcoming/more-info/${event.slug}`} className="relative group">
      <div className="group relative mb-8 block md:mb-14 md:overflow-clip md:rounded-xl lg:mb-16">
        <div className="mb-4 aspect-[4/3] overflow-clip rounded-xl md:mb-0 md:aspect-[8/5] lg:rounded-2xl">
          <div className="h-full w-full transition duration-300 group-hover:scale-105">
            <Image
              src={event.banner_image}
              alt="placeholder"
              width={2260}
              height={1695}
              className="relative h-full w-full object-cover object-center"
              loading="eager"
              placeholder={GetBlurImage()}
              priority
            />
          </div>
          <div className="max-md:hidden absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="text-center text-white text-6xl font-semibold px-4">
              Click here to register for {event.title}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:absolute md:inset-x-0 md:bottom-0 md:bg-gradient-to-t md:from-primary/80 md:to-transparent md:p-8 md:pt-24 md:text-primary-foreground">
          <div>
            <div className="mb-4 md:hidden">{tags[0]}</div>
            <div className="mb-2 flex">
              <div className="flex-1 text-lg font-medium md:text-2xl lg:text-3xl">
                {event.title}
              </div>
              <ArrowUpRight className="size-6" />
            </div>
            <div className="text-sm md:text-base">{event.description}</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden flex-1 gap-8 md:flex lg:flex-row">
              <div className="flex flex-col">
                <span className="mb-2 text-xs font-medium">Conducted by</span>
                <div className="flex flex-1 items-center gap-3">
                  <Image
                    src="/FC-logo1.png"
                    alt="Founder's Club"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-xs font-medium">
                    Founder&apos;s Club
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="mb-2 text-xs font-medium">Starting on</span>
                <div className="flex flex-1 items-center">
                  <span className="text-sm font-medium">
                    {formatInTimeZone(
                      new Date(event.start_date),
                      'Asia/Kolkata',
                      'dd MMMM yyyy'
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Image
                src="https://shadcnblocks.com/images/block/avatar-1.webp"
                alt="Jane Doe"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium">Founder&apos;s Club</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.start_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="hidden flex-col md:flex">
              <span className="mb-2 text-xs font-medium">Grouped under</span>
              <div className="flex flex-1 items-center gap-2">{tags}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden mb-8">
        <Link
          href={`/upcoming/more-info/${event.slug}`}
          className="block w-full bg-primary text-center text-primary-foreground py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-primary-dark transition"
        >
          Register Now
        </Link>
      </div>
    </Link>
  );
}
