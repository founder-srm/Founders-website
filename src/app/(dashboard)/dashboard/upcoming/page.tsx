import { FeaturedPost } from '@/components/upcoming-featured';
import { BlogGrid } from '@/components/upcoming-grid';
import { BlogHeader } from '@/components/upcoming-header';
import { TabNavigation } from '@/components/upcoming-nav';
import { Pagination } from '@/components/upcoming-pagination';
import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import type { eventsInsertType } from '../../../../../schema.zod';

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

export async function generateMetadata(
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

export default async function Upcoming() {
  const events = await getEvents();
  const featuredEvent = events[0];

  return (
    <section className="py-32">
      <div className="container">
        <BlogHeader />
        <FeaturedPost event={featuredEvent} />
        {/* <TabNavigation /> */}
        {/* <BlogGrid events={events.slice(1)} /> */}
        {/* <Pagination /> */}
      </div>
    </section>
  );
}
