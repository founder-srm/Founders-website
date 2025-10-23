'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FeaturedPost } from '@/components/upcoming-featured';
import { UpcomingGrid } from '@/components/upcoming-grid';
import { TabNavigation } from '@/components/upcoming-nav';
import { Pagination } from '@/components/upcoming-pagination';
import { createClient } from '@/utils/supabase/client';
import type { eventsInsertType } from '../../../../schema.zod';

// define a fallback registration type if not imported
interface EventRegistration {
  event_id: string;
  attendance?: string;
}

export default function Upcoming() {
  const [events, setEvents] = useState<eventsInsertType[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<eventsInsertType[]>([]);

  // ffetch events + registrations only once
  const getEvents = useCallback(async () => {
    const supabase = createClient();

    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(10);

    const { data: regData, error: regError } = await supabase
      .from('eventsregistrations')
      .select('event_id, attendance');

    if (eventsError || regError) {
      console.error('Error fetching:', eventsError || regError);
      return;
    }

    setEvents(eventsData as eventsInsertType[]);
    setRegistrations(regData || []);
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  //  memoize popularity only when dependencies change
  const eventsWithPopularity = useMemo(() => {
    const popularityMap = registrations.reduce<Record<string, number>>(
      (acc, reg) => {
        if (reg.attendance === 'Present') {
          acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    // attach popularity safely
    return events.map(event => ({
      ...event,
      popularity: event.id ? popularityMap[event.id] || 0 : 0,
    }));
  }, [events, registrations]);

  //  default sorting by latest date
  const sortedEvents = useMemo(() => {
    return [...eventsWithPopularity].sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [eventsWithPopularity]);

  useEffect(() => {
    setFilteredEvents(sortedEvents);
  }, [sortedEvents]);

  const featuredEvent = useMemo(
    () =>
      eventsWithPopularity.find(event => event.is_featured) ||
      eventsWithPopularity[0],
    [eventsWithPopularity]
  );

  return (
    <>
      <FeaturedPost event={featuredEvent} />
      <TabNavigation
        events={eventsWithPopularity}
        setFilteredEvents={setFilteredEvents}
      />
      <UpcomingGrid events={filteredEvents} />
      <Pagination />
    </>
  );
}
