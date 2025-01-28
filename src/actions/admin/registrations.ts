import type { TypedSupabaseClient } from '@/utils/types';

export function getAllRegistrations(client: TypedSupabaseClient) {
  return client.from('eventsregistrations').select('*').throwOnError();
}

export function getAllRegistrationsWithUser(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select(`
      *,
      event_id(
        title,
        slug
      )
    `)
    .throwOnError();
}

export function getRecentRegistrations(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
    .throwOnError();
}

export function getRegistrationsStats(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select(`
            application_id,
            created_at,
            details,
            event_id,
            event_title,
            id,
            is_approved,
            ticket_id
        `)
    .throwOnError();
}

export function getRegistrationsCount(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select(`
            id,
            event_title
        `)
    .throwOnError();
}

export function getRegistrationById(
  client: TypedSupabaseClient,
  RegistrationId: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .eq('id', RegistrationId)
    .throwOnError()
    .single();
}

export function getRegistationsByEventId(
  client: TypedSupabaseClient,
  EventId: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .eq('event_id', EventId)
    .throwOnError();
}

export function getRegistrationsByDateRange(
  client: TypedSupabaseClient,
  Start_Date: string,
  End_Date: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .gte('created_at', Start_Date)
    .lte('created_at', End_Date)
    .throwOnError();
}
