/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponentProps,
} from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import { BLOG_POST_BY_SLUG_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

// Portable Text Components - defined outside the main component
const Header1 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h1 className="text-4xl font-bold text-muted-foreground mb-6">{children}</h1>
);

const Header2 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h2 className="text-3xl font-semibold text-muted-foreground mb-5">
    {children}
  </h2>
);

const Header3 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
    {children}
  </h3>
);

const Header4 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h4 className="text-xl font-medium text-muted-foreground mb-4">{children}</h4>
);

const Header5 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h5 className="text-lg font-medium text-muted-foreground mb-3">{children}</h5>
);

const Header6 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h6 className="text-base font-medium text-muted-foreground mb-3">
    {children}
  </h6>
);

const BlockQuote = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => {
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  );
};

const CustomLink = ({
  value,
  children,
}: {
  value?: { href: string };
  children: React.ReactNode;
}) => {
  if (!value?.href) return null;
  return (
    <Link href={value.href} className="text-blue-600 hover:underline">
      {children}
    </Link>
  );
};

const CustomImage = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <div className="my-6">
      <Image
        src={urlFor(value).url()}
        alt={value.alt || ' '}
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  );
};

const portableTextComponents = {
  block: {
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="text-muted-foreground/80 mb-4">{children}</p>
    ),
    h1: Header1,
    h2: Header2,
    h3: Header3,
    h4: Header4,
    h5: Header5,
    h6: Header6,
    blockquote: BlockQuote,
  },
  marks: {
    link: CustomLink,
  },
  types: {
    image: CustomImage,
  },
};

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

  const image = post?.mainImage ? urlFor(post.mainImage).url() : previousImages[0];
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
        <PortableText value={post.body!} components={portableTextComponents} />
      </div>
      <SanityLive />
    </article>
  );
}
