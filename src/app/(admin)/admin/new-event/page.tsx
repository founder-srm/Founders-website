/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast'
import { FormBuilder } from './form-builder';
import { z } from 'zod';

import type { Event } from '@/types/events';
// import { createEvent } from '@/actions/typeform-upload'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type TypeFormField = {
  fieldType:
    | 'text'
    | 'radio'
    | 'select'
    | 'slider'
    | 'checkbox'
    | 'date'
    | 'textarea';
  label: string;
  name: string;
  description?: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  checkboxType?: 'single' | 'multiple';
  items?: Array<{ id: string; label: string }>;
};

function generateZodSchema(fields: TypeFormField[]) {
  const schemaObj: Record<string, any> = {};
  // biome-ignore lint/complexity/noForEach: for each is preferred for readability
  fields.forEach(field => {
    let fieldSchema: any;
    switch (field.fieldType) {
      case 'text':
        fieldSchema = z.string();
        if (field.validation?.minLength)
          fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength)
          fieldSchema = fieldSchema.max(field.validation.maxLength);
        if (field.validation?.pattern)
          fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern));
        break;
      case 'textarea':
        fieldSchema = z.string();
        if (field.validation?.minLength)
          fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength)
          fieldSchema = fieldSchema.max(field.validation.maxLength);
        if (field.validation?.pattern)
          fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern));
        break;
      case 'date':
        fieldSchema = z.date();
        break;
      case 'checkbox':
        if (field.checkboxType === 'multiple') {
          fieldSchema = z
            .array(z.string())
            .default([])
            .refine(value => value.some(item => item), {
              message: 'You have to select at least one item.',
            });
        } else {
          fieldSchema = z.boolean().default(false);
        }
        break;
      case 'radio':
      case 'select':
        fieldSchema = z.enum(field.options as [string, ...string[]]);
        break;
      case 'slider':
        fieldSchema = z
          .number()
          .min(field.min ?? 0)
          .max(field.max ?? 100);
        break;
      default:
        fieldSchema = z.any();
    }
    schemaObj[field.name] = field.required
      ? fieldSchema
      : fieldSchema.optional();
  });
  return z.object(schemaObj);
}

export default function EventFormBuilderPage() {
  const [formFields, setFormFields] = useState<TypeFormField[]>([]);

  const handleFieldsChange = (fields: TypeFormField[]) => {
    setFormFields(fields);
    // Reset form values when fields change
    form.reset({});
  };

  const dynamicSchema = generateZodSchema(formFields);
  const form = useForm<any>({
    resolver: zodResolver(dynamicSchema),
  });

  const onSubmit = (data: Event) => {
    console.log('Form data:', data);
    console.log('Form fields:', formFields);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Basic Event Details */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter event title" />
                    </FormControl>
                    <FormDescription>
                      The title of the event, like Foundathon24 etc..
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter venue" />
                    </FormControl>
                    <FormDescription>
                      The location where the event is happening, If online,
                      mention the format (gmeet, zoom etc..)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>When the event starts?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>When the event ends?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publish_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When should this event be visible to users on the website?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        {...field}
                        placeholder="Enter image URL"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a URL for the event banner image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter event description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rules</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter event rules" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="more_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter additional information"
                      />
                    </FormControl>
                    <FormDescription>
                      Add any additional information about the event here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Form Builder */}
              <FormBuilder
                fields={formFields}
                onChange={setFormFields}
                onFieldsChange={handleFieldsChange}
              />

              <div className="flex justify-end space-x-4">
                <Button type="reset" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
