import { z } from 'zod';

// Note: eventsInsertType and typeformInsertType are now defined as Zod inferred types
// If you need the Database types, regenerate with: npx supabase gen types typescript --local > database.types.ts

export const eventsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  banner_image: z.string(),
  description: z.string(),
  end_date: z.string(),
  event_type: z.enum(['online', 'offline', 'hybrid']).nullable().optional(),
  is_featured: z.boolean().nullable().optional(),
  is_gated: z.boolean().nullable().optional(),
  always_approve: z.boolean().nullable().optional(),
  more_info: z.string().nullable().optional(),
  publish_date: z.string(),
  rules: z.string().nullable().optional(),
  slug: z.string().optional(),
  start_date: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  typeform_config: z.any(),
  venue: z.string(),
  created_at: z.string().optional(),
});

export const typeformFieldSchema = z.object({
  fieldType: z.enum([
    'text',
    'radio',
    'select',
    'slider',
    'checkbox',
    'date',
    'textarea',
    'url',
    'file',
    'redirect',
  ]),
  label: z.string(),
  name: z.string(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  checkboxType: z.enum(['single', 'multiple']).optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  // URL field specific
  urlPlaceholder: z.string().optional(),
  // File upload specific
  acceptedFileTypes: z.string().optional(),
  maxFileSizeMB: z.number().optional(),
  bucketPath: z.string().optional(),
  // Redirect field specific
  redirectUrl: z.string().optional(),
  redirectLabel: z.string().optional(),
});

export type TypeFormField = z.infer<typeof typeformFieldSchema>;

// Inferred types from Zod schemas
export type eventsInsertType = z.infer<typeof eventsInsertSchema>;
export type typeformInsertType = {
  created_at?: string | null;
  event_id: string;
  id?: string;
  responses?: Record<string, unknown>;
  team_entry?: boolean;
  user_id?: string;
  registration_email?: string;
  is_approved?: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  event_title?: string;
  application_id?: string;
  details?: Record<string, unknown>;
  ticket_id?: string;
};
