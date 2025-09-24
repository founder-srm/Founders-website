/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { cn } from '@/lib/utils';
import { sendRecruitmentApplication } from '@/actions/recruitment-upload';

export type RecruitmentFormField = {
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

function generateZodSchema(fields: RecruitmentFormField[]) {
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
      case 'date':
        fieldSchema = z.date();
        break;
      case 'checkbox':
        if (field.checkboxType === 'multiple') {
          fieldSchema = z
            .array(z.string())
            .min(field.required ? 1 : 0, 'Please select at least one option');
        } else {
          fieldSchema = z.boolean();
        }
        break;
      case 'radio':
        fieldSchema = z.string().min(1, 'Please select an option');
        break;
      case 'select':
        fieldSchema = z.string().min(1, 'Please select an option');
        break;
      case 'slider':
        fieldSchema = z.number().min(field.min ?? 0).max(field.max ?? 100);
        break;
      default:
        fieldSchema = z.string();
        // Allow empty string for optional fields
        if (!field.required) {
          fieldSchema = z.union([z.string().length(0), fieldSchema]);
        }
        break;
    }

    if (field.required && field.fieldType !== 'checkbox') {
      schemaObj[field.name] = fieldSchema;
    } else {
      schemaObj[field.name] = fieldSchema.optional();
    }
  });

  return z.object(schemaObj);
}

export function RecruitmentMultiStepForm({
  fields,
  jobCategory,
  jobTitle,
}: {
  fields: RecruitmentFormField[];
  jobCategory?: string;
  jobTitle?: string;
}) {
  const [step, setStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSchema = generateZodSchema(fields);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  });

  // Autofocus the inputs
  // biome-ignore lint/correctness/useExhaustiveDependencies: best soln is to ignore that it's not exhaustive
  useEffect(() => {
    const currentInput = document.querySelector(
      '[data-current-field]'
    ) as HTMLElement;
    if (currentInput) {
      currentInput.focus();
    }
  }, [step]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const applicationData = {
        job_category: jobCategory || 'General',
        job_title: jobTitle || 'General Application',
        details: values,
      };

      await sendRecruitmentApplication(applicationData);
      
      toast({
        title: 'Application Submitted!',
        description: 'Thank you for your application. We will review it and get back to you soon.',
      });
      
      router.push('/recruitments?submitted=true');
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const currentField = fields[step];
    const currentValue = form.getValues(currentField.name as any);
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(step));
    
    // Validate current field
    const isValid = await form.trigger(currentField.name as any);
    
    if (isValid) {
      if (step < fields.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Progress value={((step + 1) / fields.length) * 100} className="mb-4" />
        {jobCategory && jobTitle && (
          <div className="text-sm text-muted-foreground mb-4">
            Applying for: <span className="font-medium">{jobTitle}</span> in {jobCategory}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => {
            if (index !== step) return null;
            return (
              <div key={field.name}>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-semibold">
                    Question {step + 1}/{fields.length}
                  </h2>
                  {field.required && (
                    <span className="text-sm text-red-500 font-medium">
                      *Required
                    </span>
                  )}
                </div>

                {/* Form field rendering based on type */}
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
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <FormControl>
                                <Input
                                  {...formField}
                                  value={formField.value as string || ''}
                                  data-current-field
                                  className="text-lg p-4 h-12"
                                  placeholder="Type your answer here..."
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
                    case 'textarea':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...formField}
                                  value={formField.value as string || ''}
                                  data-current-field
                                  className="text-lg p-4 min-h-32"
                                  placeholder="Type your answer here..."
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
                    case 'radio':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={(formField.value as string) ?? ''}
                                  onValueChange={formField.onChange}
                                  className="flex flex-col space-y-3"
                                >
                                  {field.options?.map(opt => (
                                    <FormItem
                                      key={opt}
                                      className="flex items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <RadioGroupItem value={opt} />
                                      </FormControl>
                                      <FormLabel className="font-normal text-base cursor-pointer hover:text-primary">
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
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value as string || ''}
                              >
                                <FormControl>
                                  <SelectTrigger data-current-field className="text-lg p-4 h-12">
                                    <SelectValue placeholder="Select an option" />
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
                      if (field.checkboxType === 'multiple') {
                        return (
                          <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name}
                            render={() => (
                              <FormItem>
                                <FormLabel className="text-lg">{field.label}</FormLabel>
                                <div className="flex flex-col space-y-3">
                                  {field.options?.map(option => (
                                    <FormField
                                      key={option}
                                      control={form.control}
                                      name={field.name}
                                      render={({ field: formField }) => {
                                        return (
                                          <FormItem
                                            key={option}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={(formField.value as string[])?.includes(option)}
                                                onCheckedChange={(checked) => {
                                                  const currentValue = formField.value as string[] || [];
                                                  return checked
                                                    ? formField.onChange([...currentValue, option])
                                                    : formField.onChange(
                                                        currentValue?.filter(
                                                          (value) => value !== option
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-base cursor-pointer hover:text-primary">
                                              {option}
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
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
                      } else {
                        return (
                          <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name}
                            render={({ field: formField }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={formField.value as boolean || false}
                                    onCheckedChange={formField.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-lg cursor-pointer hover:text-primary">
                                    {field.label}
                                  </FormLabel>
                                  {field.description && (
                                    <FormDescription>
                                      {field.description}
                                    </FormDescription>
                                  )}
                                </div>
                                {touchedFields.has(step) && <FormMessage />}
                              </FormItem>
                            )}
                          />
                        );
                      }
                    case 'date':
                      return (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={'outline'}
                                      className={cn(
                                        'w-full pl-3 text-left font-normal text-lg p-4 h-12',
                                        !formField.value && 'text-muted-foreground'
                                      )}
                                      data-current-field
                                    >
                                      {formField.value && typeof formField.value === 'object' && 'getTime' in formField.value ? (
                                        format(formField.value as Date, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={formField.value as Date || undefined}
                                    onSelect={formField.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date('1900-01-01')
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
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
                              <FormLabel className="text-lg">{field.label}</FormLabel>
                              <FormControl>
                                <div className="px-3">
                                  <Slider
                                    min={field.min ?? 0}
                                    max={field.max ?? 100}
                                    step={1}
                                    value={[formField.value as number || field.min || 0]}
                                    onValueChange={(vals) => formField.onChange(vals[0])}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                    <span>{field.min ?? 0}</span>
                                    <span className="font-medium text-lg">
                                      {formField.value as number || field.min || 0}
                                    </span>
                                    <span>{field.max ?? 100}</span>
                                  </div>
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
                    default:
                      return null;
                  }
                })()}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="px-8 py-2"
                    >
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step === fields.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-2"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </form>
      </Form>
    </div>
  );
}