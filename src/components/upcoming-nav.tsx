'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [sortOrder, setSortOrder] = useState('newest');

  const applyFiltersAndSort = useCallback(() => {
    let filtered = events;
    
    // Apply category filter
    if (activeTab !== 'All') {
      filtered = events.filter(event =>
        event.tags.map(tag => tag.toLowerCase()).includes(activeTab.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'oldest':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'popular':
          // For now, sort by featured events first, then by start_date
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        default:
          return 0;
      }
    });

    setFilteredEvents(sorted);
  }, [events, activeTab, sortOrder, setFilteredEvents]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
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
        <Select value={sortOrder} onValueChange={handleSortChange}>
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
