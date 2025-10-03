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
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    // getting event registrations to calculate popularity
    const { data: registrationsData, error: regError } = await supabase
      .from('eventsregistrations')
      .select('event_id, attendance');

    if (regError) {
      console.error('Error fetching registrations:', regError);
      return;
    }

    // calculating popularity counts
    const popularityMap = (registrationsData || []).reduce<Record<string, number>>((acc, reg) => {
      if (reg.attendance === 'Present') {
        acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
      }
      return acc;
    }, {});
    
    // adding popularity to each event
    const eventsWithPopularity = (events as eventsInsertType[]).map(event => ({
      ...event,
      popularity: event.id ? popularityMap[event.id] || 0 : 0,
    }));
    
    const sorted = eventsWithPopularity.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    setEvents(sorted);
    console.log('Registrations data:', registrationsData);
    console.log('Event popularity counts:', eventsWithPopularity.map(e => ({
      id: e.id,
      title: e.title,
      popularity: e.popularity
    })));
    
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
