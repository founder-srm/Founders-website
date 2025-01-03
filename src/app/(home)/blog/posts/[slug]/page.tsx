import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getPostBySlug } from '@/lib/mdx';
import { CustomMDX } from '@/mdx-components';

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 max-w-4xl overflow-y-auto">
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="object-cover rounded-lg max-w-full max-h-[400px]"
          priority
        />
      </div>

      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center mb-8 text-muted-foreground">
        <span className="font-medium">{post.author}</span>
        <span className="mx-2">•</span>
        <time>{format(new Date(post.published_at), 'MMMM d, yyyy')}</time>
      </div>

      <div className="mx-auto max-w-2xl py-8 px-4 md:px-0 text-primary-foreground leading-relaxed">
        <CustomMDX source={post.content} />
      </div>
    </article>
  );
}
