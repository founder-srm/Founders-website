import { createClient } from '@/utils/supabase/server';
import type { Metadata, ResolvingMetadata } from 'next';
import type { eventsInsertType } from '../../../../schema.zod';
import { Suspense } from 'react';
// import { EventsHeader } from '@/components/upcoming-header';
// import { usePathname } from 'next/navigation';

async function getEvents() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return events as eventsInsertType[];
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  // biome-ignore lint/correctness/noEmptyPattern: no need to use the params
  {}: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const events = await getEvents();
  const featuredEvent = events[0];

  const previousImages = (await parent).openGraph?.images || [];

  if (!featuredEvent) {
    return {
      title: 'Upcoming Events | Founders',
      description: 'Check out our latest events and workshops',
    };
  }

  const eventDate = new Date(featuredEvent.start_date).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return {
    title: `${featuredEvent.title} - Upcoming Events | Founders`,
    description: featuredEvent.description,
    openGraph: {
      title: featuredEvent.title,
      description: featuredEvent.description,
      type: 'website',
      images: [featuredEvent.banner_image, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: featuredEvent.title,
      description: featuredEvent.description,
      images: [featuredEvent.banner_image],
    },
    other: {
      'event:type': featuredEvent.event_type || 'Online',
      'event:date': eventDate,
    },
  };
}

export const revalidate = 3600; // revalidate every hour

export default function Layout({ children }: { children: React.ReactNode }) {
  //   const pathname = usePathname();
  //   const isUpcomingRoute = pathname === '/upcoming';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex flex-col items-center w-full min-h-screen">
        <div className="container py-4 px-2">
          {/* {isUpcomingRoute && <EventsHeader />} */}
          {children}
        </div>
      </main>
    </Suspense>
  );
}
