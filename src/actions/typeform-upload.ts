import { createClient } from '@/utils/supabase/client';
import { eventsInsertSchema } from '../../schema.zod';

export async function createEvent(eventData: unknown) {
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
      more_info: parseResult.data.more_info,
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
