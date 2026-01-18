import type { Event } from '@/types/events';
import { createClient } from '@/utils/supabase/client';
import { eventsInsertSchema, type typeformInsertType } from '../../schema.zod';

export async function createEvent(eventData: Event & { is_gated?: boolean; always_approve?: boolean; more_info_text?: string | null }) {
  const supabase = createClient();
  const parseResult = eventsInsertSchema.safeParse(eventData);
  if (!parseResult.success) {
    throw new Error('Invalid event data');
  }
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: parseResult.data.title,
      description: parseResult.data.description,
      start_date: parseResult.data.start_date,
      end_date: parseResult.data.end_date,
      publish_date: parseResult.data.publish_date,
      venue: parseResult.data.venue,
      banner_image: parseResult.data.banner_image,
      tags: parseResult.data.tags,
      event_type: parseResult.data.event_type,
      is_featured: parseResult.data.is_featured,
      is_gated: parseResult.data.is_gated ?? false,
      always_approve: parseResult.data.always_approve ?? false,
      more_info: parseResult.data.more_info,
      more_info_text: parseResult.data.more_info_text,
      rules: parseResult.data.rules,
      slug: parseResult.data.slug,
      typeform_config: parseResult.data.typeform_config,
    })
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function sendEventRegistration(
  eventData: typeformInsertType
) {
  const supabase = createClient();

  // Single write-first attempt. Only read if we hit a unique violation.
  const { data, error } = await supabase
    .from('eventsregistrations')
    .insert({
      application_id: eventData.application_id,
      attendance: eventData.attendance,
      created_at: eventData.created_at,
      details: eventData.details,
      event_id: eventData.event_id,
      event_title: eventData.event_title,
      id: eventData.id,
      is_approved: eventData.is_approved,
      is_team_entry: eventData.is_team_entry,
      registration_email: eventData.registration_email,
      ticket_id: eventData.ticket_id,
    })
    .select()
    .single();

  if (data) return data;

  // Unique violation (duplicate) → fetch existing once.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((error as any)?.code === '23505') {
    const query = eventData.application_id
      ? supabase
          .from('eventsregistrations')
          .select('*')
          .eq('event_id', eventData.event_id!)
          .eq('application_id', eventData.application_id)
          .maybeSingle()
      : supabase
          .from('eventsregistrations')
          .select('*')
          .eq('event_id', eventData.event_id!)
          .eq('registration_email', eventData.registration_email!)
          .maybeSingle();

    const { data: existing, error: fetchErr } = await query;
    if (existing) return existing;
    throw new Error(
      fetchErr?.message ?? 'Duplicate detected but existing row not found'
    );
  }

  throw new Error(error?.message ?? 'Registration failed');
}
