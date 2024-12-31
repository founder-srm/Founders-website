import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { createClient } from '@/utils/supabase/client';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: string;
  image: string;
  published_at: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getPostsRange(
  start: number,
  end: number
): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .range(start, end)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function serializeMDX(
  content: string
): Promise<MDXRemoteSerializeResult> {
  return await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      development: process.env.NODE_ENV === 'development',
    },
  });
}
