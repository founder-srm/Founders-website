import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import type { eventsInsertType } from '../../schema.zod';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function FeaturedPost({ event }: { event: eventsInsertType }) {
  const tags = event.tags.map((tag) => (
    <Badge key={tag} variant="default">
      {tag}
    </Badge>
  ));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative mb-8 block md:mb-14 md:overflow-clip md:rounded-xl lg:mb-16">
            <div className="mb-4 aspect-[4/3] overflow-clip rounded-xl md:mb-0 md:aspect-[8/5] lg:rounded-2xl">
              <div className="h-full w-full transition duration-300 group-hover:scale-105">
                <Image
                  src={event.banner_image}
                  alt="placeholder"
                  width={2260}
                  height={1695}
                  className="relative h-full w-full object-cover object-center"
                  loading='eager'
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 md:absolute md:inset-x-0 md:bottom-0 md:bg-gradient-to-t md:from-primary/80 md:to-transparent md:p-8 md:pt-24 md:text-primary-foreground">
              <div>
                <div className="mb-4 md:hidden">
                  {tags[0]}
                </div>
                <div className="mb-2 flex">
                  <div className="flex-1 text-lg font-medium md:text-2xl lg:text-3xl">
                    {event.title}
                  </div>
                  <ArrowUpRight className="size-6" />
                </div>
                <div className="text-sm md:text-base">
                  {event.description}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden flex-1 gap-8 md:flex lg:flex-row">
                  <div className="flex flex-col">
                    <span className="mb-2 text-xs font-medium">Conducted by</span>
                    <div className="flex flex-1 items-center gap-3">
                      <Image
                        src="https://shadcnblocks.com/images/block/avatar-1.webp"
                        alt="Jane Doe"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="text-xs font-medium">Founder&apos;s Club</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-2 text-xs font-medium">Starting on</span>
                    <div className="flex flex-1 items-center">
                      <span className="text-sm font-medium">
                        {new Date(event.start_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
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
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="hidden flex-col md:flex">
                  <span className="mb-2 text-xs font-medium">Grouped under</span>
                  <div className="flex flex-1 items-center gap-2">
                    {tags}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </DialogTrigger>
      <DialogTitle hidden>{event.title}</DialogTitle>
      <DialogContent className="sm:max-w-[625px]">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="https://shadcnblocks.com/images/block/avatar-1.webp"
                alt="Founder's Club"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium">Conducted by</span>
                <span className="text-muted-foreground">Founder&apos;s Club</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-medium">Starting on</span>
                <span className="text-muted-foreground">
                  {new Date(event.start_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">Tags</span>
              <div className="flex gap-2">
                {tags}
              </div>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href={`/dashboard/upcoming/register/${event.slug}`}>
              Register for this event
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
