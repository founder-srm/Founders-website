import type { eventsInsertType } from '../../schema.zod';
import { UpcomingCard } from './upcoming-card';

export function UpcomingGrid({ events }: { events: eventsInsertType[] }) {
  return (
    <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
      {events.map(event => (
        <UpcomingCard key={event.id} post={event} />
      ))}
      {events.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No upcoming events found
          <br />
          Check back later!
          <br />
          🎉
        </div>
      )}
    </div>
  );
}
