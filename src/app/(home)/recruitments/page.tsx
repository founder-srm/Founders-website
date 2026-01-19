import type { Metadata } from 'next';
import CareersLarge from '@/components/careers-large';
import config from '@/lib/config';

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
  return (
    <main className="flex flex-col items-center w-full ">
      <CareersLarge />
    </main>
  );
}
