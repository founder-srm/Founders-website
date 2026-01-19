import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableTextWrapper } from '@/components/mdx/PortableTextWrapper';
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { BLOG_POST_BY_SLUG_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await sanityFetch({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
  });

  const previousImages = (await parent).openGraph?.images || [];

  const image = post?.mainImage
    ? urlFor(post.mainImage).url()
    : previousImages[0];
  return {
    title: post?.title,
    description: post?.summary,
    creator: 'Founders Club',
    publisher: 'Founders Club',
    authors: [
      {
        name: post?.author?.name || 'Founders Club',
        url: `https://www.thefoundersclub.in/blog/posts/${slug}`,
      },
    ],
    openGraph: {
      images: [image, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@foundersclubsrm',
      title: post?.title || '',
      description: post?.summary || '',
      creator: '@foundersclubsrm',
      images: {
        url: `${image}`,
        alt: `Preview image for ${post?.title}`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 max-w-4xl overflow-y-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {post.mainImage && (
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.mainImage.alt || post.title || ''}
            width={800}
            height={400}
            className="object-cover rounded-lg max-w-full max-h-[400px]"
            priority
          />
        </div>
      )}

      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

      {post.summary && (
        <p className="text-xl text-muted-foreground mb-6">{post.summary}</p>
      )}

      <div className="flex items-center gap-3 mb-8 text-muted-foreground">
        {post.author?.image && (
          <Image
            src={urlFor(post.author.image || '/placeholder.svg').url()}
            alt={post.author?.name || 'Author'}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium">{post.author?.name}</span>
          <span className="mx-2">•</span>
          <time>
            {post.publishedAt
              ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
              : 'No date'}
          </time>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* biome-ignore lint/style/noNonNullAssertion: Body is required for blog posts */}
        <PortableTextWrapper value={post.body!} />
      </div>
    </article>
  );
}
