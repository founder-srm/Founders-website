/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import type { Json } from '../../../../../../../database.types';
import type { eventsInsertType } from '../../../../../../../schema.zod';

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
    }

    if (field.required) {
      schemaObj[field.name] = fieldSchema;
    } else {
      schemaObj[field.name] = fieldSchema.optional();
    }
  });

  return z.object(schemaObj);
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
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'User email is required for registration',
        variant: 'destructive',
      });
      return;
    }

    console.log('Final submission:', data);

    try {
      const response = await sendEventRegistration({
        registration_email: user.email,
        event_id: eventData.id,
        event_title: eventData.title,
        application_id: user?.id,
        is_approved: eventData.always_approve ? 'ACCEPTED' : 'SUBMITTED',
        details: data as Json,
      });
      console.log('Response:', response);
      if (!Array.isArray(response)) {
        alert('Registration failed!');
        return;
      }

      toast({
        title: 'Registration successful!',
        description: 'You have successfully registered for the event.',
      });
      Router.push(
        `/dashboard/upcoming/register/success?ticketid=${response[0].ticket_id}`
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed!');
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
