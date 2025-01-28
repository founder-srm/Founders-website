import type { Database, Json } from '../../database.types';

export type Registration = {
  application_id?: string;
  attendance?: Database['public']['Enums']['attendance'];
  registration_email:string;
  created_at?: string;
  details: Json;
  event_id?: string;
  event_title: string;
  id?: string;
  is_approved?: boolean;
  ticket_id?: number;
};

export type RegistrationWithUser = {
  application_id?: string;
  registration_email:string;
  attendance?: Database['public']['Enums']['attendance'];
  created_at?: string;
  details: Json;
  event_id?: string;
  event_title: {slug: string, title: string};
  id?: string;
  is_approved?: boolean;
  ticket_id?: number;
};

export type RegistrationCount = {
  id: string;
  event_title: string;
};
