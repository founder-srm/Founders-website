"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useCallback } from "react";

interface EventOption {
  id: string;
  name: string;
}

interface EventCount extends EventOption {
  count: number;
}

interface EventFilterToggleProps {
  events: EventOption[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
  eventCounts?: EventCount[];
}

export function EventFilterToggle({
  events,
  selectedEventId,
  onSelectEvent,
  eventCounts = [],
}: EventFilterToggleProps) {
  const handleSelectChange = useCallback((value: string) => {
    onSelectEvent(value === "all" ? null : value);
  }, [onSelectEvent]);

  // For smaller screens, use a dropdown instead of badges
  const renderMobileFilter = () => (
    <div className="md:hidden w-full mb-4">
      <Select value={selectedEventId || "all"} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Events</SelectLabel>
            <SelectItem value="all">
              All Events
            </SelectItem>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name} {eventCounts.find(e => e.id === event.id)?.count 
                  ? `(${eventCounts.find(e => e.id === event.id)?.count})` 
                  : ''}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  // For larger screens, use badges
  const renderDesktopFilter = () => (
    <div className="hidden md:flex flex-wrap gap-2 items-center mb-4">
      <span className="text-sm font-medium">Filter by event:</span>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedEventId ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSelectEvent(null)}
        >
          All Events
        </Badge>
        {events.map((event) => {
          const count = eventCounts.find(e => e.id === event.id)?.count;
          return (
            <Badge
              key={event.id}
              variant={selectedEventId === event.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSelectEvent(selectedEventId === event.id ? null : event.id)}
            >
              {event.name} {count ? `(${count})` : ''}
              {selectedEventId === event.id && (
                <X className="ml-1 h-3 w-3" onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(null);
                }} />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {renderMobileFilter()}
      {renderDesktopFilter()}
      {selectedEventId && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSelectEvent(null)}
            className="text-xs"
          >
            Clear filter
          </Button>
        </div>
      )}
    </>
  );
}
