/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, ExternalLink, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendEventRegistration } from '@/actions/typeform-upload';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import type { eventsInsertType, TypeFormField, JsonObject } from '../../../../../../../schema.zod';

function generateZodSchema(fields: TypeFormField[]) {
  const schemaObj: Record<string, any> = {};

  // biome-ignore lint/complexity/noForEach: foreach is more viable in this context
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
        // Allow empty string for optional fields
        if (!field.required) {
          fieldSchema = z.union([z.string().length(0), fieldSchema]);
        }
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
          .min(field.min || 0)
          .max(field.max || 100);
        break;
      case 'textarea':
        fieldSchema = z.string();
        if (field.validation?.minLength)
          fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength)
          fieldSchema = fieldSchema.max(field.validation.maxLength);
        // Allow empty string for optional fields
        if (!field.required) {
          fieldSchema = z.union([z.string().length(0), fieldSchema]);
        }
        break;
      case 'url':
        fieldSchema = z.string().url('Please enter a valid URL');
        if (!field.required) {
          fieldSchema = z.union([z.string().length(0), fieldSchema]);
        }
        break;
      case 'file':
        // File uploads store the URL after upload
        fieldSchema = z.string();
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'redirect':
        // Redirect fields don't collect data, skip validation
        fieldSchema = z.string().optional();
        break;
    }

    if (field.required && field.fieldType !== 'redirect') {
      schemaObj[field.name] = fieldSchema;
    } else {
      schemaObj[field.name] = fieldSchema?.optional?.() ?? fieldSchema;
    }
  });

  return z.object(schemaObj);
}

// File Upload Component for registration forms
function FileUploadField({
  eventSlug,
  fieldName,
  accept,
  maxSizeMB,
  value,
  onChange,
  required,
}: {
  eventSlug: string;
  fieldName: string;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSize = (maxSizeMB || 5) * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeMB || 5}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${eventSlug}/registrations/${fieldName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-uploads')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('event-uploads')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully.',
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
      toast({
        title: 'Upload failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed rounded-lg p-6 text-center">
        {value ? (
          <div className="space-y-2">
            <p className="text-sm text-green-600">File uploaded successfully!</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View uploaded file
            </a>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange('')}
              >
                Remove & Upload New
              </Button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxSizeMB || 5}MB • {accept || 'All files'}
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={isUploading}
              required={required && !value}
              className="sr-only"
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function TypeformMultiStep({
  eventData,
  fields,
}: {
  eventData: eventsInsertType;
  fields: TypeFormField[];
}) {
  const [step, setStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Set<number>>(new Set());
  const formSchema = generateZodSchema(fields);

  const Router = useRouter();

  const user = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit', // Change validation mode to only validate on submit
  });

  // autofocus the inputs, don't recommend to use it
  // biome-ignore lint/correctness/useExhaustiveDependencies: best soln is to ignore that it's not exhaustive
  useEffect(() => {
    const currentInput = document.querySelector(
      '[data-current-field]'
    ) as HTMLElement;
    if (currentInput) {
      currentInput.focus();
    }
  }, [step]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const userEmail = user?.email;
    const userId = user?.id;
    
    if (!userEmail || !userId) {
      toast({
        title: 'Error',
        description: 'User email is required for registration',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if this is a gated event (team entry)
      const isGatedEvent = (eventData as any).is_gated === true;
      const eventId = (eventData as any).id as string;
      
      if (!eventId) {
        toast({
          title: 'Event error',
          description: 'Event ID not found.',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await sendEventRegistration({
        registration_email: userEmail,
        event_id: eventId,
        event_title: eventData.title,
        application_id: userId,
        is_approved: (eventData as any).always_approve ? 'ACCEPTED' : 'SUBMITTED',
        details: data as JsonObject,
        // Mark as team entry for gated events
        ...(isGatedEvent && { is_team_entry: true }),
      });

      if (!response?.ticket_id) {
        toast({
          title: 'Registration failed',
          description: 'Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'You are registered',
        description: 'If you already registered, we reused your ticket.',
      });

      Router.push(
        `/dashboard/upcoming/register/success?ticketid=${response.ticket_id}`
      );
    } catch (error) {
      console.error(error);
      toast({
        title: 'Registration failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleNext = async () => {
    // Get the current field
    const currentField = fields[step];
    setTouchedFields(prev => new Set(prev).add(step));

    // For optional fields, allow progression if the field is empty
    const fieldValue = form.getValues(currentField.name);
    const isEmpty =
      !fieldValue ||
      (typeof fieldValue === 'string' && fieldValue.trim() === '');

    if (!currentField.required && isEmpty) {
      setStep(step + 1);
      return;
    }

    // Otherwise, validate the field
    const result = await form.trigger(currentField.name);
    if (result) {
      setStep(step + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Progress value={((step + 1) / fields.length) * 100} className="mb-8" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => {
            if (index !== step) return null;
            return (
              <div key={field.name}>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">
                    Question {step + 1}/{fields.length}
                  </h2>
                  {field.required && (
                    <span className="text-sm text-red-500 font-medium">
                      *Required
                    </span>
                  )}
                </div>
                {/* Existing switch statement for form fields */}
                {(() => {
                  switch (field.fieldType) {
                    case 'text':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Input
                                  data-current-field
                                  value={(formField.value as string) ?? ''}
                                  onChange={formField.onChange}
                                  required={field.required}
                                />
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'date':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline">
                                      {formField.value &&
                                      formField.value instanceof Date ? (
                                        format(formField.value, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        formField.value instanceof Date
                                          ? formField.value
                                          : undefined
                                      }
                                      onSelect={formField.onChange}
                                      required={field.required}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'radio':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={(formField.value as string) ?? ''}
                                  onValueChange={formField.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  {field.options?.map(opt => (
                                    <FormItem
                                      key={opt}
                                      className="flex items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <RadioGroupItem
                                          required={field.required}
                                          value={opt}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {opt}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'select':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Select
                                  value={(formField.value as string) ?? ''}
                                  onValueChange={formField.onChange}
                                  required={field.required}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={`Select ${field.label.toLowerCase()}`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {field.options?.map(opt => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'slider':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <div>
                                    {String(
                                      typeof formField.value === 'number'
                                        ? formField.value
                                        : (field.min ?? 0)
                                    )}
                                  </div>
                                  <Slider
                                    value={[
                                      typeof formField.value === 'number'
                                        ? formField.value
                                        : (field.min ?? 0),
                                    ]}
                                    max={field.max || 100}
                                    step={1}
                                    onValueChange={([value]) =>
                                      formField.onChange(value)
                                    }
                                  />
                                </div>
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'checkbox':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                {field.checkboxType === 'multiple' &&
                                field.items ? (
                                  <div className="space-y-2">
                                    {field.items.map(item => (
                                      <FormField
                                        key={item.id}
                                        control={form.control}
                                        name={field.name}
                                        render={({ field: arrayField }) => (
                                          <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                required={field.required}
                                                checked={
                                                  Array.isArray(
                                                    arrayField.value
                                                  )
                                                    ? arrayField.value.includes(
                                                        item.id
                                                      )
                                                    : false
                                                }
                                                onCheckedChange={checked => {
                                                  const currentValue =
                                                    Array.isArray(
                                                      arrayField.value
                                                    )
                                                      ? arrayField.value
                                                      : [];
                                                  return checked
                                                    ? arrayField.onChange([
                                                        ...currentValue,
                                                        item.id,
                                                      ])
                                                    : arrayField.onChange(
                                                        currentValue.filter(
                                                          (value: string) =>
                                                            value !== item.id
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {item.label}
                                            </FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={formField.value as boolean}
                                        onCheckedChange={formField.onChange}
                                      />
                                    </FormControl>
                                  </div>
                                )}
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'textarea':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Textarea
                                  data-current-field
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                  className="resize-none"
                                  required={field.required}
                                  value={(formField.value as string) ?? ''}
                                  onChange={formField.onChange}
                                />
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'url':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Input
                                  data-current-field
                                  type="url"
                                  placeholder={field.urlPlaceholder || 'https://example.com'}
                                  required={field.required}
                                  value={(formField.value as string) ?? ''}
                                  onChange={formField.onChange}
                                />
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'file':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <FileUploadField
                                  eventSlug={eventData.slug || 'unknown'}
                                  fieldName={field.name}
                                  accept={field.acceptedFileTypes}
                                  maxSizeMB={field.maxFileSizeMB}
                                  value={(formField.value as string) ?? ''}
                                  onChange={formField.onChange}
                                  required={field.required}
                                />
                              </FormControl>
                              {touchedFields.has(step) && <FormMessage />}
                              {field.description && (
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                              )}
                            </FormItem>
                          )}
                        />
                      );
                    case 'redirect':
                      return (
                        <div key={field.name} className="space-y-4">
                          <FormLabel>{field.label}</FormLabel>
                          {field.description && (
                            <p className="text-sm text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() => window.open(field.redirectUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            {field.redirectLabel || 'Visit Link'}
                          </Button>
                        </div>
                      );
                  }
                })()}
              </div>
            );
          })}
          <div className="flex justify-end mt-8 space-x-4">
            {step < fields.length - 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
