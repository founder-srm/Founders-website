/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from 'chrono-node';
import {
  CalendarIcon,
  ChevronRightIcon,
  Eye,
  Link2,
  Loader2,
  Lock,
  Upload,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createEvent } from '@/actions/typeform-upload';
import TiptapMarkdown from '@/components/data-table-admin/registrations/tiptap-markdown';
import {
  type EventData,
  useEventAgent,
} from '@/components/providers/EventAgentProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/elevatedClient';
import type { TypeFormField } from '../../../../../../../schema.zod';
import { FormBuilder } from './form-builder';

// Helper function to format date for display
function formatDateDisplay(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Helper function to format time
function formatTimeDisplay(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Helper to combine date and time into ISO string
function combineDateTimeToISO(date: Date | undefined, time: string): string {
  if (!date) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined.toISOString();
}

// DateTime Picker Component with natural language support
function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = React.useState(
    value ? formatTimeDisplay(new Date(value)) : '10:00'
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      setDate(d);
      setTime(formatTimeDisplay(d));
      setInputValue(formatDateDisplay(d));
      setMonth(d);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setInputValue(formatDateDisplay(selectedDate));
    if (selectedDate) {
      onChange(combineDateTimeToISO(selectedDate, time));
    }
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (date) {
      onChange(combineDateTimeToISO(date, e.target.value));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parseDate(val);
    if (parsed) {
      setDate(parsed);
      setMonth(parsed);
      onChange(combineDateTimeToISO(parsed, time));
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          value={inputValue}
          placeholder={placeholder}
          className="pr-10"
          onChange={handleInputChange}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
              type="button"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-24 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
      />
    </div>
  );
}

// Banner Image Uploader Component with Dropzone
function BannerImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop: hookHandleDrop,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    maxFiles: 1,
  });

  React.useEffect(() => {
    setHasError(false);
    setIsImageLoading(true);
  }, [value]);

  // Extract file path from Supabase URL
  const extractFilePath = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/event-banners\/(.+?)(?:\?|$)/);
    return match ? match[1] : null;
  };

  React.useEffect(() => {
    if (value) {
      const path = extractFilePath(value);
      setCurrentFilePath(path);
    }
  }, [value]);

  const uploadToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `event-banners/${fileName}`;

    // If there's an existing file, delete it first
    if (currentFilePath) {
      await supabase.storage
        .from('post-images')
        .remove([`event-banners/${currentFilePath}`]);
    }

    const { error } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const publicUrl = await uploadToSupabase(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      onChange(publicUrl);

      toast({
        title: 'Image uploaded',
        description: 'Banner image uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hookHandleDrop(e);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    e.target.value = '';
  };

  const handleRemove = async () => {
    if (currentFilePath) {
      try {
        const supabase = createClient();
        await supabase.storage
          .from('post-images')
          .remove([`event-banners/${currentFilePath}`]);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    onChange('');
    setCurrentFilePath(null);
  };

  // Show errors from the hook
  React.useEffect(() => {
    if (errors.length > 0) {
      toast({
        title: 'Invalid file',
        description: errors[0],
        variant: 'destructive',
      });
    }
  }, [errors, toast]);

  // Dropzone when no image
  if (!value) {
    return (
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center py-10 px-6">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium">Uploading...</p>
              <div className="w-48 h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {uploadProgress}%
              </p>
            </>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-full mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">
                Drop your banner image here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supports: JPG, PNG, GIF, WebP • Max 10MB
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Preview when image exists
  if (hasError) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center h-48 bg-destructive/10 rounded-lg border border-destructive/30">
          <div className="text-center text-destructive">
            <X className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">Failed to load image</p>
            <p className="text-xs mt-1 opacity-70">
              The image URL may be invalid
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={handleRemove}
            >
              Remove & Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative aspect-video max-h-64 rounded-lg overflow-hidden border bg-muted">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <Image
          src={value}
          alt="Banner preview"
          fill
          className="object-cover"
          onError={() => setHasError(true)}
          onLoad={() => setIsImageLoading(false)}
          unoptimized
        />
      </div>
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 gap-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3 w-3" />
          Replace
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

// Full Form Preview Dialog
function FullFormPreview({
  eventData,
  formFields,
}: {
  eventData: any;
  formFields: TypeFormField[];
}) {
  const [previewTab, setPreviewTab] = React.useState<'event' | 'form'>('event');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>

        <Tabs
          value={previewTab}
          onValueChange={v => setPreviewTab(v as 'event' | 'form')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event">Event Page</TabsTrigger>
            <TabsTrigger value="form">Registration Form</TabsTrigger>
          </TabsList>

          <TabsContent value="event" className="space-y-6 pt-4">
            {/* Banner Preview */}
            {eventData.banner_image && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={eventData.banner_image}
                  alt="Event banner"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {eventData.title || 'Event Title'}
                  </h2>
                  <p className="text-sm opacity-90">
                    {eventData.venue || 'Venue'}
                  </p>
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {eventData.start_date
                    ? new Date(eventData.start_date).toLocaleString()
                    : 'Not set'}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Event Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="capitalize">
                    {eventData.event_type || 'offline'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {eventData.description && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {eventData.description}
                </CardContent>
              </Card>
            )}

            {/* Rules - Preview as formatted text (full MDX render on public page) */}
            {eventData.rules && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Rules & Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {eventData.rules}
                </CardContent>
              </Card>
            )}

            {/* More Info Link */}
            {eventData.more_info && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={eventData.more_info}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Link2 className="h-3 w-3" />
                    {eventData.more_info_text || eventData.more_info}
                  </a>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="form" className="pt-4">
            <FormPreviewMultistep fields={formFields} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Multistep Form Preview Component (read-only preview mode)
function FormPreviewMultistep({ fields }: { fields: TypeFormField[] }) {
  const [step, setStep] = React.useState(0);

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <p className="mb-2">No form fields added yet</p>
          <p className="text-sm">
            Add fields in the Form Builder to see the preview
          </p>
        </div>
      </div>
    );
  }

  const currentField = fields[step];
  const progress = ((step + 1) / fields.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {step + 1} of {fields.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Field */}
      <Card className="border-2">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {currentField.label || 'Untitled Field'}
            </h3>
            {currentField.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>

          {currentField.description && (
            <p className="text-sm text-muted-foreground">
              {currentField.description}
            </p>
          )}

          {/* Field Type Preview */}
          <div className="pt-2">
            {currentField.fieldType === 'text' && (
              <Input disabled placeholder="Short text answer..." />
            )}
            {currentField.fieldType === 'textarea' && (
              <Textarea
                disabled
                placeholder="Long text answer..."
                className="min-h-[100px]"
              />
            )}
            {currentField.fieldType === 'select' && (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  {currentField.options?.map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {currentField.fieldType === 'radio' && (
              <div className="space-y-2">
                {currentField.options?.map(opt => (
                  <div key={opt} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    <span className="text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            )}
            {currentField.fieldType === 'checkbox' &&
              currentField.checkboxType === 'single' && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-muted-foreground" />
                  <span className="text-sm">I agree</span>
                </div>
              )}
            {currentField.fieldType === 'checkbox' &&
              currentField.checkboxType === 'multiple' && (
                <div className="space-y-2">
                  {currentField.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border-2 border-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            {currentField.fieldType === 'date' && (
              <Button
                variant="outline"
                disabled
                className="w-full justify-start"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Pick a date
              </Button>
            )}
            {currentField.fieldType === 'slider' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentField.min || 0}</span>
                  <span>{currentField.max || 100}</span>
                </div>
                <div className="h-2 bg-muted rounded-full" />
              </div>
            )}
            {currentField.fieldType === 'url' && (
              <Input
                disabled
                type="url"
                placeholder={currentField.urlPlaceholder || 'https://...'}
              />
            )}
            {currentField.fieldType === 'file' && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max {currentField.maxFileSizeMB || 5}MB •{' '}
                  {currentField.acceptedFileTypes || 'All files'}
                </p>
              </div>
            )}
            {currentField.fieldType === 'redirect' && (
              <Button variant="outline" disabled className="gap-2">
                <Link2 className="h-4 w-4" />
                {currentField.redirectLabel || 'Visit Link'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        {step < fields.length - 1 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button type="button" disabled>
            Submit (Preview)
          </Button>
        )}
      </div>

      {/* Field List */}
      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground mb-2">All fields:</p>
        <div className="flex flex-wrap gap-1">
          {fields.map((field, idx) => (
            <Button
              key={field.name}
              type="button"
              variant={idx === step ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setStep(idx)}
            >
              {idx + 1}. {field.label || 'Untitled'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Event creation schema
const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  venue: z.string().min(1, 'Venue is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  publish_date: z.string().min(1, 'Publish date is required'),
  banner_image: z.string().url('Must be a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().optional(),
  more_info: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  more_info_text: z.string().optional(),
  event_type: z.enum(['online', 'offline', 'hybrid']),
  is_featured: z.boolean(),
  is_gated: z.boolean(),
  always_approve: z.boolean(),
  tags: z.array(z.string()),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventFormBuilderPage() {
  const [formFields, setFormFields] = useState<TypeFormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'form'>('details');
  const { toast } = useToast();

  // Agent integration
  const { onEventDataGenerated, onFormFieldsGenerated } = useEventAgent();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      venue: '',
      start_date: '',
      end_date: '',
      publish_date: '',
      banner_image: '',
      description: '',
      rules: '',
      more_info: '',
      more_info_text: '',
      event_type: 'offline',
      is_featured: false,
      is_gated: false,
      always_approve: false,
      tags: [],
    },
  });

  // Register agent callbacks for autofilling form
  React.useEffect(() => {
    onEventDataGenerated.current = (data: EventData) => {
      if (data.title) form.setValue('title', data.title);
      if (data.description) form.setValue('description', data.description);
      if (data.venue) form.setValue('venue', data.venue);
      if (data.event_type) form.setValue('event_type', data.event_type);
      if (data.tags) form.setValue('tags', data.tags);
      if (data.rules) form.setValue('rules', data.rules);
      if (data.is_gated !== undefined) form.setValue('is_gated', data.is_gated);
      if (data.always_approve !== undefined)
        form.setValue('always_approve', data.always_approve);

      // Handle dates
      if (data.suggested_dates) {
        if (data.suggested_dates.start_date) {
          form.setValue('start_date', data.suggested_dates.start_date);
        }
        if (data.suggested_dates.end_date) {
          form.setValue('end_date', data.suggested_dates.end_date);
        }
        if (data.suggested_dates.publish_date) {
          form.setValue('publish_date', data.suggested_dates.publish_date);
        }
      }

      toast({
        title: 'Event details updated',
        description:
          'The AI has filled in the event details. Review and adjust as needed.',
      });

      // Switch to details tab if not there
      setActiveTab('details');
    };

    onFormFieldsGenerated.current = (fields: TypeFormField[]) => {
      setFormFields(fields);
      toast({
        title: 'Form fields generated',
        description: `The AI has created ${fields.length} form fields. Review them in the Form Builder tab.`,
      });

      // Switch to form tab to show the generated fields
      setActiveTab('form');
    };

    return () => {
      onEventDataGenerated.current = null;
      onFormFieldsGenerated.current = null;
    };
  }, [form, toast, onEventDataGenerated, onFormFieldsGenerated]);

  const handleFieldsChange = (fields: TypeFormField[]) => {
    setFormFields(fields);
  };

  const isGated = form.watch('is_gated');
  const watchedValues = form.watch();

  const onSubmit = async (data: EventFormValues) => {
    if (formFields.length === 0) {
      toast({
        title: 'No form fields',
        description: 'Please add at least one form field for registrations.',
        variant: 'destructive',
      });
      setActiveTab('form');
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const eventData = {
        ...data,
        slug,
        typeform_config: formFields,
      };

      await createEvent(eventData as any);

      toast({
        title: 'Event created!',
        description: `${data.title} has been created successfully.`,
      });

      form.reset();
      setFormFields([]);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground mt-1">
            Set up event details and build a custom registration form
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FullFormPreview eventData={watchedValues} formFields={formFields} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as 'details' | 'form')}
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="details" className="gap-2">
                Event Details
                {form.formState.errors.title ||
                form.formState.errors.venue ||
                form.formState.errors.start_date ? (
                  <span className="h-2 w-2 bg-destructive rounded-full" />
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="form" className="gap-2">
                Form Preview
                {formFields.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {formFields.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Basic Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential details about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Foundathon 2026"
                            />
                          </FormControl>
                          <FormDescription>
                            A catchy name for your event
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
                          <FormLabel>Venue / Platform</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Main Auditorium or Google Meet"
                            />
                          </FormControl>
                          <FormDescription>
                            Physical location or online platform
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Date & Time Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Schedule
                    </h4>
                    <p className="text-xs text-muted-foreground -mt-2">
                      Type natural language like &quot;tomorrow at 2pm&quot; or
                      &quot;next Friday&quot;
                    </p>
                    <div className="grid gap-6 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date & Time</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Tomorrow at 2pm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date & Time</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Next Friday"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publish_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Publish Date</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Now"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              When event becomes visible
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banner Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Banner Image</CardTitle>
                  <CardDescription>
                    Upload a visual banner for your event (drag & drop
                    supported)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="banner_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BannerImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Description & Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Description & Details</CardTitle>
                  <CardDescription>
                    Tell attendees about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="A brief description of your event..."
                            className="min-h-[80px] max-h-[120px] resize-none"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0} characters (min 10)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Rules & Guidelines</FormLabel>
                        <FormControl>
                          <TiptapMarkdown
                            content={field.value || ''}
                            onUpdate={markdown => field.onChange(markdown)}
                            placeholder="Enter event rules and guidelines..."
                          />
                        </FormControl>
                        <FormDescription>
                          Use the rich text editor to format rules. Content is
                          saved as Markdown.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="more_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Info Link (optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://example.com/event-details"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Link to external page with more information
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="more_info_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Learn More" />
                        </FormControl>
                        <FormDescription>
                          Text to display on the button linking to additional
                          info. Defaults to the URL if empty.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Event Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                  <CardDescription>
                    Configure event type and access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full max-w-xs">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="offline">
                              Offline (In-person)
                            </SelectItem>
                            <SelectItem value="online">
                              Online (Virtual)
                            </SelectItem>
                            <SelectItem value="hybrid">
                              Hybrid (Both)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Featured Event
                            </FormLabel>
                            <FormDescription>
                              Show prominently on homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="always_approve"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto-Approve Registrations
                            </FormLabel>
                            <FormDescription>
                              Instantly approve all submissions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_gated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              <FormLabel className="text-base">
                                Gated Event (Club Members Only)
                              </FormLabel>
                              <Badge variant="secondary">Team Entry</Badge>
                            </div>
                            <FormDescription>
                              Only club account users can register. Treated as
                              team entry.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isGated && (
                      <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-amber-600">
                              Gated Event Configuration
                            </p>
                            <p className="text-sm text-muted-foreground">
                              This event will only be visible to users with club
                              accounts. Registrations will be marked as team
                              entries.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="gap-2"
                >
                  Continue to Form Builder
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="form" className="space-y-6 mt-6">
              {/* Form Builder Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Registration Form Builder</CardTitle>
                      <CardDescription>
                        Build a custom registration form. Drag and drop to
                        reorder fields.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {formFields.length} field
                      {formFields.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <FormBuilder
                    fields={formFields}
                    onChange={setFormFields}
                    onFieldsChange={handleFieldsChange}
                  />
                </CardContent>
              </Card>

              {/* Submit Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {formFields.length === 0 ? (
                        <span className="text-amber-600">
                          Add at least one form field to continue
                        </span>
                      ) : (
                        <span className="text-green-600">
                          ✓ Ready to create event with {formFields.length} field
                          {formFields.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form.reset();
                          setFormFields([]);
                        }}
                      >
                        Reset All
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
