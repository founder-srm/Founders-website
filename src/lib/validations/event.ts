import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  venue: z.string().min(1, "Venue is required"),
  banner_image: z.string().url("Must be a valid URL"),
  start_date: z.string(),
  end_date: z.string(),
  publish_date: z.string(),
  always_approve: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  event_type: z.enum(['online', 'offline', 'hybrid']).optional(),
  more_info: z.string().optional(),
  rules: z.string().optional(),
  tags: z.array(z.string()),
  typeform_config: z.array(z.any())
})
