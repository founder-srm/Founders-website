import { type BlogPost, getPostsRange } from '@/lib/mdx'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default async function RelatedPosts() {
  const posts = await getPostsRange(0, 1)

  return (
    <section className="py-32">
      <div className="container flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Title & Description */}
        <div className="mb-8 md:mb-14 lg:min-w-[30%]">
          <p className="text-wider mb-4 text-sm font-medium text-muted-foreground">
            Stuff we write
          </p>
          <h2 className="mb-4 w-full text-4xl font-medium md:mb-5 md:text-5xl lg:mb-6 lg:max-w-xs lg:text-6xl heading-gradient">
            Blog
          </h2>
          <p className="md:mb-5 lg:mb-6 lg:max-w-xs">
            We write about the things we love, the things we learn, and the things we do.
          </p>
          <div className="hidden md:block">
            <ViewAllPostsButton />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 flex flex-col items-center py-2 md:hidden">
          <ViewAllPostsButton className="w-full sm:w-fit" />
        </div>
      </div>
    </section>
  )
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/posts/${post.slug}`} className="group flex flex-col">
      <div className="mb-4 flex overflow-clip rounded-xl md:mb-5">
        <div className="transition duration-300 group-hover:scale-105">
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={400}
            className="aspect-[3/2] h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="mb-2 flex items-start gap-4 pt-4 md:mb-3 md:pt-4 lg:pt-4">
        <span className="line-clamp-3 flex-1 break-words text-lg font-medium md:text-2xl lg:text-2xl xl:text-3xl">
          {post.title}
        </span>
        <ArrowUpRight className="size-6 shrink-0" />
      </div>
      <div className="mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5 md:text-base">
        {post.summary}
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
          <Avatar>
            <AvatarImage width={48} height={48} className="aspect-square h-full w-full object-cover" src={post.author_image} alt={post.author} />
            <AvatarFallback>{post.author}</AvatarFallback>
          </Avatar>
        </span>
        <div className="flex flex-col gap-px">
          <span className="text-xs font-medium">{post.author}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}

function ViewAllPostsButton({ className = '' }) {
  return (
    <Button 
      className={className}
      asChild
    >
      <Link href="/blog">
        View all posts
      </Link>
    </Button>
  )
}
