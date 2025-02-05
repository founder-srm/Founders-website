import config from '@/lib/config';
import { getAllPosts } from '@/lib/mdx';
import { sanityFetch } from '@/sanity/lib/live';
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries';
import { createClient } from '@/utils/supabase/server';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.baseUrl;
  const posts = await getAllPosts();
  const { data: events } = await sanityFetch({ query: ALL_EVENTS_QUERY });
  
  const supabase = await createClient();
  const { data: upcomingEvents } = await supabase.from('events').select('slug, created_at');

  return [
    {
      url: `${baseUrl}/`,
      priority: 1.0,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/about`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/about/team`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/blog`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/upcoming`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/contact-us`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/events`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/recruitments`,
      priority: 0.8,
      lastModified: new Date().toISOString(),
    },
    ...posts.map(post => ({
      url: `${baseUrl}/blog/posts/${post.slug}`,
      priority: 0.8,
      lastModified: post.created_at,
    })),
    ...events.map(event => ({
      url: `${baseUrl}/events/writeup/${event.slug}`,
      priority: 0.8,
      lastModified: event.published || new Date().toISOString(),
    })),
    ...(upcomingEvents?.map(event => ({
      url: `${baseUrl}/upcoming/more-info/${event.slug}`,
      priority: 0.9,
      lastModified: event.created_at || new Date().toISOString(),
    })) ?? []),
  ];
}
