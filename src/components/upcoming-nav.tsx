'use client';
type EventWithPopularity = eventsInsertType & { popularity?: number };

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { eventsInsertType } from '../../schema.zod';

const categories = [
  'All',
  'Bootcamp',
  'Triumph Talk',
  'Open House',
  'Foundathon',
  'IdeaSpark',
];

export function TabNavigation({
  events,
  setFilteredEvents,
}: {
  events: EventWithPopularity[];
  setFilteredEvents: (events: EventWithPopularity[]) => void;
}) {
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    setFilteredEvents(events);
  }, [events, setFilteredEvents]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'All') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.tags.map(tag => tag.toLowerCase()).includes(value.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };
  const handleSort = (sortBy: string) => {
    const sortedEvents = [...events]; // copy to avoid mutation

    if (sortBy === 'newest') {
      sortedEvents.sort(
        (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
    } else if (sortBy === 'oldest') {
      sortedEvents.sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
    } else if (sortBy === 'popular') {
       sortedEvents.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    setFilteredEvents(sortedEvents);
  };
  return (
    <div className="mb-9 flex flex-col justify-between gap-8 md:mb-14 md:flex-row lg:mb-16">
      <div className="flex-1 overflow-x-auto max-md:container max-md:-mx-[2rem] max-md:w-[calc(100%+4rem)]">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="shrink-0 md:w-52 lg:w-56">
        <Select onValueChange={handleSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
