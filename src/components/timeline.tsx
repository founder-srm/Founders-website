'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import TimelineItem from './timeline-item';

const timelineItems = [
  {
    title: 'Straightforward Pricing',
    description:
      'Clear, upfront pricing with no hidden fees. Get an instant quote through our simple online form.',
    image: 'https://shadcnblocks.com/images/block/placeholder-1.svg',
  },
  {
    title: 'Structured Development',
    description:
      "Regular progress updates and defined milestones ensure complete visibility throughout your project's lifecycle.",
    image: 'https://shadcnblocks.com/images/block/placeholder-2.svg',
  },
  {
    title: 'Scalable Architecture',
    description:
      'Built with scalability in mind, our solutions grow with your needs while maintaining consistent performance.',
    image: 'https://shadcnblocks.com/images/block/placeholder-3.svg',
  },
  {
    title: 'Dedicated Support',
    description:
      'Access our dedicated support team through multiple channels for quick resolution of any concerns.',
    image: 'https://shadcnblocks.com/images/block/placeholder-4.svg',
  },
  {
    title: 'Satisfaction Guaranteed',
    description:
      "Your satisfaction is our priority. If our solution doesn't meet your expectations.",
    image: 'https://shadcnblocks.com/images/block/placeholder-5.svg',
  },
];

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        <div className="relative grid gap-16 md:grid-cols-2">
          <div ref={ref} className="top-40 h-fit md:sticky">
            <p className="font-medium text-muted-foreground">Our Approach</p>
            <h2 className="mb-6 mt-4 text-4xl font-semibold md:text-5xl">
              Experience the difference with us
            </h2>
            <p className="font-medium md:text-xl">
              We believe in creating lasting partnerships with our clients.
            </p>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
              <Button>Start Now</Button>
              <Button variant="outline">Book a demo</Button>
            </div>
          </div>
          <div className="flex flex-col gap-12 md:gap-20">
            {timelineItems.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
