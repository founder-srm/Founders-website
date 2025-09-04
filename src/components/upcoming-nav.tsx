'use client';

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
  events: eventsInsertType[];
  setFilteredEvents: (events: eventsInsertType[]) => void;
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
        <Select>
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
