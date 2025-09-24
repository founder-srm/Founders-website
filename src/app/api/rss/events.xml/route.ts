import { NextResponse } from 'next/server';
import config from '@/lib/config';
import { sanityFetch } from '@/sanity/lib/live';
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries';

export async function GET() {
  try {
    const { data: events } = await sanityFetch({ query: ALL_EVENTS_QUERY });
    const baseUrl = config.baseUrl || 'https://www.thefoundersclub.in';

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Founders Club - Events</title>
    <description>Latest events from The Founders Club</description>
    <link>${baseUrl}/events</link>
    <atom:link href="${baseUrl}/api/rss/events.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Feed</generator>
    <image>
      <title>Founders Club</title>
      <url>${baseUrl}/favicon.ico</url>
      <link>${baseUrl}/events</link>
    </image>
${events
  .map(
    (event) => `    <item>
      <title><![CDATA[${event.title}]]></title>
      <description><![CDATA[${event.summary || event.title}]]></description>
      <link>${baseUrl}/events/writeup/${event.slug}</link>
      <guid isPermaLink="true">${baseUrl}/events/writeup/${event.slug}</guid>
      <pubDate>${event.published ? new Date(event.published).toUTCString() : new Date(event._createdAt).toUTCString()}</pubDate>
      <author>${event.author?.name || 'Founders Club'}</author>
      <category>${event.type || 'Event'}</category>
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
    console.error('Error generating events RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}