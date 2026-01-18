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
  is_gated: z.boolean().optional().default(false),
  always_approve: z.boolean().optional().default(false),
  more_info: z.string().nullable().optional(),
  more_info_text: z.string().nullable().optional(),
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

// Json type matching Supabase - using a more permissive type for form data
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// More permissive type for form details that works with Record<string, unknown>
export type JsonObject = { [key: string]: Json | undefined };

export type typeformInsertType = {
  created_at?: string;
  event_id?: string;
  id?: string;
  is_team_entry?: boolean;
  user_id?: string;
  registration_email: string;
  is_approved?: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'INVALID';
  event_title: string;
  application_id?: string;
  details: JsonObject;
  ticket_id?: number;
  attendance?: 'Present' | 'Absent';
};

// Club user roles enum (matches database enum)
export const clubUserRoleEnum = z.enum(['club_rep', 'admin']);
export type ClubUserRole = z.infer<typeof clubUserRoleEnum>;

// Clubs table schema
export const clubsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Club name is required'),
  created_at: z.string().optional(),
  email: z.string().email().nullable().optional(),
  website: z.string().url().nullable().optional(),
  profile_picture: z.string().nullable().optional(),
});

export type ClubsInsertType = z.infer<typeof clubsInsertSchema>;

export type ClubsRowType = {
  id: string;
  name: string;
  created_at: string;
  email: string | null;
  website: string | null;
  profile_picture: string | null;
};

// Club user account schema (for club members/representatives)
export const clubUserAccountInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  club_id: z.string().uuid(),
  email: z.string().email(),
  user_role: clubUserRoleEnum.optional().default('club_rep'),
  is_verified: z.boolean().optional().default(false),
  created_at: z.string().optional(),
});

export type ClubUserAccountInsertType = z.infer<typeof clubUserAccountInsertSchema>;

export type ClubUserAccountRowType = {
  id: string;
  user_id: string;
  club_id: string;
  email: string;
  user_role: ClubUserRole;
  is_verified: boolean;
  created_at: string;
};
