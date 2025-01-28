import type { TypedSupabaseClient } from '@/utils/types';

export function getAllEvents(client: TypedSupabaseClient) {
  return client.from('events').select('*').throwOnError();
}

export function getRecentEvents(client: TypedSupabaseClient) {
  return client.from('events').select('*').limit(5).throwOnError();
}

export function getEventStats(client: TypedSupabaseClient) {
  return client
    .from('events')
    .select(`
        type,
        always_approve,
        event_type,
        is_featured,
        publish_date,
        tags,
        title,
        venue
    `)
    .throwOnError();
}
