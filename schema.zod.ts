import { z } from 'zod';

import type { Database } from './database.types';

export type eventsInsertType = Database['public']['Tables']['events']['Insert'];

export const eventsInsertSchema = z.object({
    banner_image: z.string(),
    description: z.string(),
    end_date: z.string(),
    event_type: z.enum(['online', 'offline', 'hybrid']).nullable().optional(),
    is_featured: z.boolean().nullable().optional(),
    more_info: z.string().nullable().optional(),
    publish_date: z.string(),
    rules: z.string().nullable().optional(),
    slug: z.string().optional(),
    start_date: z.string(),
    tags: z.array(z.string()),
    title: z.string(),
    typeform_config: z.any(),
    venue: z.string()
});