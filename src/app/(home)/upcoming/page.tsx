'use client';
import { useCallback, useEffect, useState } from 'react';
import { FeaturedPost } from '@/components/upcoming-featured';
import { UpcomingGrid } from '@/components/upcoming-grid';
import { TabNavigation } from '@/components/upcoming-nav';
import { Pagination } from '@/components/upcoming-pagination';
import type { eventsInsertType } from '../../../../schema.zod';
import { createClient } from '@/utils/supabase/client';

export default function Upcoming() {
  const [events, setEvents] = useState<eventsInsertType[]>([]);
  const featuredEvent = events[0];
  const [filteredEvents, setFilteredEvents] = useState(events);

  const getEvents = useCallback(async () => {
    const supabase = createClient();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true })
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
      <FeaturedPost event={featuredEvent} />
      <TabNavigation events={events} setFilteredEvents={setFilteredEvents} />
      <UpcomingGrid events={filteredEvents} />
      <Pagination />
    </>
  );
}
