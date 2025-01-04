import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { eventsInsertType } from '../../schema.zod';

interface UpcomingCardProps {
  post: eventsInsertType;
}

export function UpcomingCard({ post }: UpcomingCardProps) {
  return (
    <Link href="#" className="group flex flex-col">
      <div className="mb-4 flex overflow-clip rounded-xl md:mb-5">
        <div className="h-full w-full transition duration-300 group-hover:scale-105">
          <Image
            src={post.banner_image}
            alt={post.title}
            width={1024}
            height={768}
            loading='lazy'
            className="aspect-[3/2] h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="mb-4">
        {post.tags?.map((tag, index) => (
          <Badge key={index} variant="default">{tag}</Badge>
        ))}
      </div>
      <div className="mb-2 line-clamp-3 break-words text-lg font-medium md:mb-3 md:text-2xl lg:text-3xl">
        {post.title}
      </div>
      <div className="mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5 md:text-base">
        {post.description.slice(0, 100)}...
      </div>
      <div className="flex items-center gap-2">
        <Image
          src="https://shadcnblocks.com/images/block/avatar-1.webp"
          alt={post.title}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex flex-col gap-px">
          <span className="text-xs font-medium">{post.start_date}</span>
          <span className="text-xs text-muted-foreground">{post.event_type}</span>
        </div>
      </div>
    </Link>
  );
}
