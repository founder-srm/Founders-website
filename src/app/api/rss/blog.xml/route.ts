import { NextResponse } from 'next/server';
import config from '@/lib/config';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '../../../../../database.types';

type BlogPost = Database['public']['Tables']['posts']['Row'];

async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    const baseUrl = config.baseUrl || 'https://www.thefoundersclub.in';

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Founders Club - Blog</title>
    <description>Latest blog posts from The Founders Club</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/api/rss/blog.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Feed</generator>
    <image>
      <title>Founders Club</title>
      <url>${baseUrl}/favicon.ico</url>
      <link>${baseUrl}/blog</link>
    </image>
${posts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.summary || post.title}]]></description>
      <link>${baseUrl}/blog/posts/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/posts/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>${post.author}</author>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating blog RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}