import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAllPosts } from '@/lib/mdx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/posts/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="relative w-full h-12">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="object-cover rounded-t-lg max-w-md max-h-12"
                />
              </div>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <time>
                    {format(new Date(post.published_at), 'MMMM d, yyyy')}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}