'use client';
import { useCallback, useEffect, useState } from 'react';
import { FeaturedPost } from '@/components/upcoming-featured';
import { UpcomingGrid } from '@/components/upcoming-grid';
import { TabNavigation } from '@/components/upcoming-nav';
import { Pagination } from '@/components/upcoming-pagination';
import { createClient } from '@/utils/supabase/client';
import type { eventsInsertType } from '../../../../schema.zod';

export default function Upcoming() {
  const [events, setEvents] = useState<eventsInsertType[]>([]);
  const featuredEvent = events.find(event => event.is_featured);
  const [filteredEvents, setFilteredEvents] = useState(events);

  const getEvents = useCallback(async () => {
    const supabase = createClient();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    setEvents(events as eventsInsertType[]);
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <>
      <FeaturedPost event={featuredEvent || events[0]} />
      <TabNavigation events={events} setFilteredEvents={setFilteredEvents} />
      <UpcomingGrid events={filteredEvents} />
      <Pagination />
    </>
  );
}
