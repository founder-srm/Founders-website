import { getPostsRange } from '@/lib/mdx';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function RelatedPosts() {
  const posts = await getPostsRange(0, 3);

  return (
    <section className="mx-auto py-12 container">
      <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
      <div className="grid grid-cols-3 gap-6 min-w-md w-full overflow-x-auto">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/posts/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="relative w-full h-12">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="object-cover rounded-t-lg w-full max-h-12"
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
    </section>
  );
}
