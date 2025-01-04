import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import type { eventsInsertType } from '../../schema.zod';

export function FeaturedPost({ event }: { event: eventsInsertType }) {
  return (
    <Link
      href="#"
      className="group relative mb-8 block md:mb-14 md:overflow-clip md:rounded-xl lg:mb-16"
    >
      <div className="mb-4 aspect-[4/3] overflow-clip rounded-xl md:mb-0 md:aspect-[8/5] lg:rounded-2xl">
        <div className="h-full w-full transition duration-300 group-hover:scale-105">
          <Image
            src={event.banner_image}
            alt="placeholder"
            width={1024}
            height={768}
            className="relative h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 md:absolute md:inset-x-0 md:bottom-0 md:bg-gradient-to-t md:from-primary/80 md:to-transparent md:p-8 md:pt-24 md:text-primary-foreground">
        <div>
          <div className="mb-4 md:hidden">
            <Badge variant="default">Design</Badge>
          </div>
          <div className="mb-2 flex">
            <div className="flex-1 text-lg font-medium md:text-2xl lg:text-3xl">
              Duis sem sem, gravida vel porttitor eu, volutpat ut arcu
            </div>
            <ArrowUpRight className="size-6" />
          </div>
          <div className="text-sm md:text-base">
            Pellentesque eget quam ligula. Sed felis ante, consequat nec
            ultrices ut, ornare quis metus. Vivamus sit amet tortor vel enim
            sollicitudin hendrerit.
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden flex-1 gap-8 md:flex lg:flex-row">
            <div className="flex flex-col">
              <span className="mb-2 text-xs font-medium">Written by</span>
              <div className="flex flex-1 items-center gap-3">
                <Image
                  src="https://shadcnblocks.com/images/block/avatar-1.webp"
                  alt="Jane Doe"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xs font-medium">Jane Doe</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="mb-2 text-xs font-medium">Published on</span>
              <div className="flex flex-1 items-center">
                <span className="text-sm font-medium">1 Jan 2024</span>
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
              <span className="text-xs font-medium">Jane Doe</span>
              <span className="text-xs text-muted-foreground">1 Jan 2024</span>
            </div>
          </div>
          <div className="hidden flex-col md:flex">
            <span className="mb-2 text-xs font-medium">File under</span>
            <div className="flex flex-1 items-center gap-2">
              <Badge variant="default">Design</Badge>
              <Badge variant="default">Research</Badge>
              <Badge variant="default">Presentation</Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
