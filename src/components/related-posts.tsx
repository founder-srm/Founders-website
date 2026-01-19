import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { ALL_BLOG_POSTS_QUERY } from '@/sanity/lib/queries';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

type BlogPost = {
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
    image?: unknown;
  } | null;
  publishedAt?: string | null;
};

export default async function RelatedPosts() {
  const { data: allPosts } = await sanityFetch({ query: ALL_BLOG_POSTS_QUERY });
  const posts = allPosts?.slice(0, 2) || [];

  return (
    <section className="py-32">
      <div className="container flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Title & Description */}
        <div className="mb-8 md:mb-14 lg:min-w-[30%]">
          <p className="text-wider mb-4 text-sm font-medium text-muted-foreground">
            Stuff we write
          </p>
          <h2 className="mb-5 py-[4px] leading-6 w-full text-4xl font-medium md:mb-5 md:text-5xl lg:mb-6 lg:max-w-xs lg:text-6xl heading-gradient">
            Blog
          </h2>
          <p className="md:mb-5 lg:mb-6 lg:max-w-xs">
            We write about the things we love, the things we learn, and the
            things we do.
          </p>
          <div className="hidden md:block">
            <ViewAllPostsButton />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
          {posts.map(post => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 flex flex-col items-center py-2 md:hidden">
          <ViewAllPostsButton className="w-full sm:w-fit" />
        </div>
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="overflow-clip">
        <div className="transition duration-300 group-hover:scale-105">
          <Image
            src={urlFor(post.mainImage || '/placeholder.svg').url()}
            alt={post.mainImage?.alt || post.title || ''}
            width={600}
            height={400}
            className="aspect-[3/2] h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-2 flex items-start gap-4 md:mb-3">
          <span className="line-clamp-3 flex-1 break-words text-lg font-medium md:text-2xl lg:text-2xl xl:text-3xl">
            {post.title}
          </span>
          <ArrowUpRight className="size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <div className="mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5 md:text-base">
          {post.summary}
        </div>
        <div className="mt-auto flex items-center gap-2">
          <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
            <Avatar>
              <AvatarImage
                width={48}
                height={48}
                className="aspect-square h-full w-full object-cover"
                src={
                  post.author?.image
                    ? urlFor(post.author.image || '/placeholder.svg').url()
                    : '/placeholder.svg'
                }
                alt={post.author?.name || 'Author'}
              />
              <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </span>
          <div className="flex flex-col gap-px">
            <span className="text-xs font-medium">{post.author?.name}</span>
            <span className="text-xs text-muted-foreground">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : 'No date'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ViewAllPostsButton({ className = '' }) {
  return (
    <Button className={className} asChild>
      <Link href="/blog">View all posts</Link>
    </Button>
  );
}
