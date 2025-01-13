import type { Database, Json } from '../../database.types';

export interface Event {
  always_approve: boolean;
  banner_image: string;
  created_at: string;
  description: string;
  end_date: string;
  event_type: Database['public']['Enums']['event-type'] | null;
  id: string;
  is_featured: boolean | null;
  more_info: string | null;
  publish_date: string;
  rules: string | null;
  slug: string;
  start_date: string;
  tags: string[];
  title: string;
  typeform_config: Json;
  venue: string;
}

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
