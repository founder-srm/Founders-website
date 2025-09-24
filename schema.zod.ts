import { z } from 'zod';

import type { Database } from './database.types';

export type eventsInsertType = Database['public']['Tables']['events']['Insert'];
export type typeformInsertType =
  Database['public']['Tables']['eventsregistrations']['Insert'];

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
  venue: z.string(),
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
});

// Recruitment form field schema (reuses typeform field structure)
export const recruitmentFieldSchema = typeformFieldSchema;

// Recruitment application schema for contact entries
export const recruitmentApplicationSchema = z.object({
  job_category: z.string(),
  job_title: z.string(),
  details: z.record(z.string(), z.any()),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.number().optional(),
});

export type RecruitmentApplicationType = z.infer<typeof recruitmentApplicationSchema>;
export type RecruitmentFormField = z.infer<typeof recruitmentFieldSchema>;
