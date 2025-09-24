import type { Metadata } from 'next';
import CareersRecruitment from '@/components/careers-recruitment';
import config from '@/lib/config';
import { sanityFetch } from '@/sanity/lib/live';
import { JOBS_QUERY } from '@/sanity/lib/queries';
import { SanityLive } from '@/sanity/lib/live';

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  // biome-ignore lint/correctness/noEmptyPattern: no need for params
  {}: { params: Params }
): Promise<Metadata> {
  return {
    title: 'Job Openings',
    description: 'Job openings at Founders Club',
    creator: 'Founders Club',
    publisher: 'Founders Club',
    authors: [
      {
        name: 'Founders Club',
        url: 'https://www.thefoundersclub.in/recruitments',
      },
    ],
    openGraph: {
      images: [
        `${config.baseUrl}/FC-logo2.jpeg`,
        `${config.baseUrl}/FC-logo1.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@foundersclubsrm',
      title: 'Job Openings',
      description: 'Job openings at Founders Club',
      creator: '@foundersclubsrm',
      images: {
        url: `${config.baseUrl}/FC-logo2.jpeg`,
        alt: `Preview image for Founders Club's job openings`,
      },
    },
  };
}

export default async function Recruitments() {
  const { data: jobCategories } = await sanityFetch({ query: JOBS_QUERY });

  return (
    <main className="flex flex-col items-center w-full ">
      <CareersRecruitment jobCategories={jobCategories || []} />
      <SanityLive />
    </main>
  );
}
