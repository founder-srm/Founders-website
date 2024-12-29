import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { getPostBySlug, serializeMDX } from "@/lib/mdx";
import { MDXWrapper } from "./mdx-wrapper";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const mdxSource = await serializeMDX(post.content);

  return (
    <article className="container mx-auto py-12 max-w-4xl">
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
      
      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center mb-8 text-muted-foreground">
        <span className="font-medium">{post.author}</span>
        <span className="mx-2">•</span>
        <time>{format(new Date(post.published_at), "MMMM d, yyyy")}</time>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXWrapper source={mdxSource} />
      </div>
    </article>
  );
}