'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBlogPost } from '@/actions/blog-posts';
import BlogPostForm from '@/components/BlogPostForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '../../../../../../../database.types';

type BlogPost = Database['public']['Tables']['posts']['Row'];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id as string;

  useEffect(() => {
    async function loadPost() {
      if (!postId || isNaN(Number(postId))) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        const result = await getBlogPost(Number(postId));
        if (result.error) {
          setError(result.error);
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        } else if (result.data) {
          setPost(result.data);
        }
      } catch {
        setError('Failed to load blog post');
        toast({
          title: 'Error',
          description: 'Failed to load blog post',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId, toast]);

  const handleSuccess = () => {
    router.push('/admin/devblog');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Error</h1>
            <p className="text-muted-foreground">
              {error || 'Blog post not found'}
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            {error || 'The blog post you are looking for could not be found.'}
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground">Editing: {post.title}</p>
      </div>

      {/* Blog Post Form */}
      <BlogPostForm post={post} onSuccess={handleSuccess} />
    </div>
  );
}
