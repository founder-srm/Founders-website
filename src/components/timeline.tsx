import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sanityFetch } from '@/sanity/lib/live';
import { TIMELINE_QUERY } from '@/sanity/lib/queries';
import TimelineItem from './timeline-item';

export const revalidate = 3600; // revalidate every hour

export default async function Timeline() {
  const { data } = await sanityFetch({ query: TIMELINE_QUERY });

  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        <div className="relative grid gap-16 md:grid-cols-2">
          <div className="top-40 h-fit md:sticky">
            <p className="font-medium text-muted-foreground">
              {data?.subtitle}
            </p>
            <h2 className="mb-6 mt-4 text-4xl font-semibold md:text-5xl">
              {data?.title}
            </h2>
            <p className="font-medium md:text-xl">{data?.description}</p>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
              <Button asChild>
                <Link href={data?.buttonLink || '/'}>{data?.buttonText}</Link>
              </Button>
              {data?.showSecondaryButton && (
                <Button variant="outline" asChild>
                  <Link href={data?.secondaryButtonLink || '/'}>
                    {data.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-12 md:gap-20">
            {data?.items?.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
