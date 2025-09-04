import { ArrowRight, MapPin, XCircle } from 'lucide-react';
import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/live';
import { JOBS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600;

export default async function CareersLarge() {
  const { data: jobCategories } = await sanityFetch({ query: JOBS_QUERY });

  return (
    <section className="w-full py-32 flex flex-col items-center">
      <div className="container px-1">
        <div className="border-x border-dashed">
          <div className="relative flex flex-col gap-6 border-b border-dashed px-4 pb-10 pt-10 sm:items-center md:pb-20">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,transparent_60%,#000_100%)]" />
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground w-fit">
              Our Recruitments
            </div>
            <h1 className="text-2xl font-bold md:text-4xl">
              Openings at Founders Club
            </h1>
            <p className="text-muted-foreground">
              Don&apos;t see a role for you?
              <Link href="/contact-us" className="ml-1 underline">
                Reach out anyways.
              </Link>
            </p>
          </div>
          <div>
            {jobCategories && jobCategories.length > 0 ? (
              jobCategories.map(jobCategory => (
                <div key={jobCategory.category}>
                  <h2 className="px-6 pt-6 text-xl font-bold">
                    {jobCategory.category}
                  </h2>
                  {jobCategory.openings?.map(job => (
                    <div
                      key={job.title}
                      className="grid items-center gap-6 border-b border-dashed px-6 py-10 lg:grid-cols-4"
                    >
                      <h3 className="text-lg">{job.title}</h3>
                      <div className="col-span-2 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8 lg:justify-center">
                        <div className="flex gap-2">
                          <MapPin className="h-auto w-4" />
                          {job.location}
                        </div>
                      </div>
                      <Link
                        href={job.link || '#'}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-fit gap-1 lg:ml-auto cursor-pointer"
                      >
                        Apply
                        <ArrowRight className="h-auto w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <XCircle className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">
                  We are currently not recruiting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
