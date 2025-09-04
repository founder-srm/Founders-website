'use client';

import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { type BlogPost, getAllPosts } from '@/lib/mdx';

// // Set revalidation time to 1 hour (3600 seconds)
// export const revalidate = 3600;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await getAllPosts();
      setPosts(posts);
    }
    fetchPosts();
  }, []);

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
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>
          <Button variant="link" className="w-full sm:w-auto">
            SubScribe to our newsletter
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post, index) => (
            <BlurFade key={post.id} delay={0.25 * (index + 1)} inView>
              <Link
                href={`/blog/posts/${post.slug}`}
                className="flex flex-col overflow-clip rounded-xl border border-border"
              >
                <div className="relative w-full h-fit">
                  <Image
                    src={post.image}
                    alt={post.title}
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
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <time>
                      {format(new Date(post.published_at), 'MMMM d, yyyy')}
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
    </section>
  );
}
