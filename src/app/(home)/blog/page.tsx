import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/lib/image';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import { ALL_BLOG_POSTS_QUERY } from '@/sanity/lib/queries';

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

type BlogPostListItem = {
  _id: string;
  slug: string | null;
  title: string | null;
  summary: string | null;
  mainImage?: {
    alt?: string;
    asset?: {
      _ref: string;
      _type: string;
    };
  } | null;
  author?: {
    name?: string | null;
  } | null;
  publishedAt?: string | null;
};

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({ query: ALL_BLOG_POSTS_QUERY });

  return (
    <section className="py-32 w-full flex flex-col items-center ">
      <div className="container flex flex-col items-center gap-16 lg:px-16 w-full">
        <div className="text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider">
            By Founders Club
          </p>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Our Posts
          </h2>
          {/* place the sanity desc here. */}
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Stay updated with the latest insights, stories, and trends from our community.
          </p>
          <Button variant="link" className="w-full sm:w-auto">
            SubScribe to our newsletter
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts?.map((post: BlogPostListItem, index: number) => (
            <BlurFade key={post._id} delay={0.25 * (index + 1)} inView>
              <Link
                href={`/blog/posts/${post.slug}`}
                className="flex flex-col overflow-clip rounded-xl border border-border"
              >
                <div className="relative w-full h-fit">
                  <Image
                    src={urlFor(post.mainImage || '/placeholder.svg').url()}
                    alt={post.mainImage?.alt || post.title || ''}
                    width={400}
                    height={400}
                    className="aspect-[16/9] h-full w-full object-cover object-center rounded-t-xl"
                  />
                </div>
                <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                  <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl lg:mb-6">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground my-2">
                    <span>{post.author?.name}</span>
                    <span className="mx-2">•</span>
                    <time>
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                        : 'No date'}
                    </time>
                  </div>
                  <p className="mb-3 text-muted-foreground md:mb-4 lg:mb-6">
                    {post.summary}
                  </p>
                  <p className="flex items-center hover:underline">
                    Read more
                    <ArrowRight className="ml-2 size-4" />
                  </p>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
      <SanityLive />
    </section>
  );
}
