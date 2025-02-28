import type { Database } from '../../database.types';

export type Event = Database['public']['Tables']['events']['Row'];

export interface EventStats {
  type: string;
  always_approve: boolean;
  event_type: Database['public']['Enums']['event-type'] | null;
  is_featured: boolean | null;
  publish_date: string;
  tags: string[];
  title: string;
  venue: string;
}
