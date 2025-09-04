'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '../../database.types';
import { revalidatePath } from 'next/cache';

type BlogPostInsert = Database['public']['Tables']['posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['posts']['Update'];

export async function createBlogPost(data: BlogPostInsert) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/devblog');
    return { data: post };
  } catch (error) {
    console.error('Unexpected error creating blog post:', error);
    return { error: 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: number, data: BlogPostUpdate) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/devblog');
    revalidatePath(`/blog/${post.slug}`);
    return { data: post };
  } catch (error) {
    console.error('Unexpected error updating blog post:', error);
    return { error: 'Failed to update blog post' };
  }
}

export async function deleteBlogPost(id: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/devblog');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting blog post:', error);
    return { error: 'Failed to delete blog post' };
  }
}

export async function getBlogPosts() {
  const supabase = await createClient();

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return { error: error.message };
    }

    return { data: posts };
  } catch (error) {
    console.error('Unexpected error fetching blog posts:', error);
    return { error: 'Failed to fetch blog posts' };
  }
}

export async function getBlogPost(id: number) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return { error: error.message };
    }

    return { data: post };
  } catch (error) {
    console.error('Unexpected error fetching blog post:', error);
    return { error: 'Failed to fetch blog post' };
  }
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      return { error: error.message };
    }

    return { data: post };
  } catch (error) {
    console.error('Unexpected error fetching blog post by slug:', error);
    return { error: 'Failed to fetch blog post' };
  }
}

export async function publishBlogPost(id: number) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .update({ 
        published_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error publishing blog post:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/devblog');
    revalidatePath(`/blog/${post.slug}`);
    return { data: post };
  } catch (error) {
    console.error('Unexpected error publishing blog post:', error);
    return { error: 'Failed to publish blog post' };
  }
}

export async function unpublishBlogPost(id: number) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .update({ 
        published_at: '' 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error unpublishing blog post:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/devblog');
    return { data: post };
  } catch (error) {
    console.error('Unexpected error unpublishing blog post:', error);
    return { error: 'Failed to unpublish blog post' };
  }
}
