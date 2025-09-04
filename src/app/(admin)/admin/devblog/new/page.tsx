'use client';

import { useRouter } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';

export default function NewPostPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/devblog');
  };

  return (
    <div className="space-y-6 mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground">
          Write and publish a new blog post
        </p>
      </div>

      {/* Blog Post Form */}
      <BlogPostForm onSuccess={handleSuccess} />
    </div>
  );
}
