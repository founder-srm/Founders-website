'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, FileText, Save } from 'lucide-react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  updateBlogPost,
} from '@/actions/blog-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useToast } from '@/hooks/use-toast';
import { generateSlug, getBlogPostTags } from '@/lib/blog-constants';
import type { Database } from '../../database.types';
import FileUploader from './FileUploader';
import MarkdownEditor from './MarkdownEditor';

type BlogPost = Database['public']['Tables']['posts']['Row'];

const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(500, 'Summary must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  author_image: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  image: z.string().optional(), // This will store the uploaded URL, optional since we handle file uploads separately
  tag: z
    .enum([
      'SuccessStories',
      'StudentEntrepreneurs',
      'TechInnovation',
      'StartupTips',
      'Technical',
      'Projects',
      'Hackathons',
      'Foundathon',
      'Ideathon',
      'OpenHouse',
      'Other',
    ])
    .optional(),
  slug: z.string().min(1, 'Slug is required'),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  onSuccess?: () => void;
}

export default function BlogPostForm({ post, onSuccess }: BlogPostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const availableTags = getBlogPostTags();

  // Utility function to convert escaped line breaks to actual line breaks
  const normalizeContent = (rawContent: string): string => {
    return rawContent
      .replace(/\\r\\n/g, '\n') // Replace \r\n with actual line breaks
      .replace(/\\n/g, '\n') // Replace \n with actual line breaks
      .replace(/\\r/g, '\n'); // Replace \r with actual line breaks
  };

  // Initialize file uploader with existing image if editing
  const initialFiles = post?.image
    ? [
        {
          id: `existing-${post.id}`,
          name: 'Current featured image',
          size: 0,
          type: 'image/jpeg',
          url: post.image,
        },
      ]
    : [];

  const [{ files: uploadFiles, isUploading }, { uploadToSupabase }] =
    useFileUpload({
      accept: 'image/*',
      maxSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
      maxFiles: 1,
      initialFiles,
    });

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      author: '',
      author_image: '',
      image: '',
      tag: undefined,
      slug: '',
    },
  });

  // Update form and content when post changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: bruh
  useEffect(() => {
    if (post) {
      const normalizedContent = normalizeContent(post.content);
      form.reset({
        title: post.title,
        summary: post.summary,
        content: normalizedContent,
        author: post.author,
        author_image: post.author_image,
        image: post.image,
        tag: post.tag || undefined,
        slug: post.slug,
      });
      setContent(normalizedContent);
    } else {
      form.reset({
        title: '',
        summary: '',
        content: '',
        author: '',
        author_image: '',
        image: '',
        tag: undefined,
        slug: '',
      });
      setContent('');
    }
  }, [post, form]);

  // Auto-generate slug when title changes (only for new posts)
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (watchTitle && !post && watchTitle.trim()) {
      const slug = generateSlug(watchTitle);
      form.setValue('slug', slug, { shouldValidate: false });
    }
  }, [watchTitle, post, form]);

  // Update form content when content state changes
  useEffect(() => {
    form.setValue('content', content, { shouldValidate: false });
  }, [content, form]);

  // Memoize the content change handler to prevent unnecessary re-renders
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const onSubmit = async (data: BlogPostFormData) => {
    // Validate that we have either an existing image or a new file
    if (
      !data.image &&
      selectedImageFiles.length === 0 &&
      uploadFiles.length === 0
    ) {
      toast({
        title: 'Error',
        description: 'Please select a featured image',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        let imageUrl = data.image || '';

        // If there's a new image file, upload it first
        const newImageFile =
          selectedImageFiles[0] ||
          (uploadFiles.length > 0 && uploadFiles[0].file.size > 0
            ? uploadFiles[0].file
            : null);
        if (newImageFile) {
          try {
            imageUrl = await uploadToSupabase(
              newImageFile,
              !!post,
              post?.image
            );
          } catch {
            toast({
              title: 'Error',
              description: 'Failed to upload image. Please try again.',
              variant: 'destructive',
            });
            return;
          }
        }

        const formData = {
          ...data,
          content,
          image: imageUrl, // Use uploaded URL or existing URL
          author_image: data.author_image || '',
        };

        let result;
        if (post) {
          result = await updateBlogPost(post.id, formData);
        } else {
          result = await createBlogPost(formData);
        }

        if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: `Blog post ${post ? 'updated' : 'created'} successfully!`,
          });
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    });
  };

  const handlePublishToggle = async () => {
    if (!post) return;

    startTransition(async () => {
      try {
        let result;
        if (post.published_at) {
          result = await unpublishBlogPost(post.id);
        } else {
          result = await publishBlogPost(post.id);
        }

        if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: `Blog post ${post.published_at ? 'unpublished' : 'published'} successfully!`,
          });
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          {post && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={post.published_at ? 'default' : 'secondary'}>
                {post.published_at ? 'Published' : 'Draft'}
              </Badge>
              {post.published_at && (
                <span className="text-sm text-muted-foreground">
                  Published on{' '}
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {post && (
          <Button
            onClick={handlePublishToggle}
            disabled={isPending}
            variant={post.published_at ? 'outline' : 'default'}
          >
            {post.published_at ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog post title..."
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a brief summary of your blog post..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed in blog previews and meta
                      descriptions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor
                  content={content}
                  onChange={handleContentChange}
                  placeholder="Start writing your blog post..."
                />
                {form.formState.errors.content && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Author */}
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Author Image */}
                  <FormField
                    control={form.control}
                    name="author_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/author.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional. URL to author&apos;s profile image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Featured Image */}
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <FileUploader
                      onFileSelect={setSelectedImageFiles}
                      maxSizeMB={5}
                      maxFiles={1}
                      accept="image/*"
                      multiple={false}
                      initialFiles={initialFiles}
                    />
                    {!form.watch('image') &&
                      selectedImageFiles.length === 0 &&
                      uploadFiles.length === 0 && (
                        <p className="text-sm text-red-500">
                          Featured image is required
                        </p>
                      )}
                  </div>

                  {/* Tag */}
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTags.map(tag => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="blog-post-url-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          Used in the URL. Auto-generated from title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isPending || isUploading}
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isUploading
                        ? 'Uploading Image...'
                        : isPending
                          ? 'Saving...'
                          : post
                            ? 'Update Post'
                            : 'Save Draft'}
                    </Button>

                    {post && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(`/blog/posts/${post.slug}`, '_blank')
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
