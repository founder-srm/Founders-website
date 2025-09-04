import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/live';
import { JOBS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600; // revalidate every hour

const Careers4 = async () => {
  const { data: jobs } = await sanityFetch({ query: JOBS_QUERY });

  return (
    <section className="py-32 w-full container">
      <div className=" container w-full">
        <div className="mx-auto w-full">
          <div className="text-center lg:text-left">
            <h1 className="text-left text-3xl font-medium md:text-4xl">
              Job Openings
            </h1>
          </div>
          <div className="mx-auto mt-6 flex flex-col gap-16 md:mt-14 w-full">
            {jobs && jobs.length > 0 ? (
              jobs.map(jobCategory => (
                <div key={jobCategory.category} className="grid w-full">
                  <h2 className="border-b pb-4 text-xl font-bold">
                    {jobCategory.category}
                  </h2>
                  {jobCategory.openings?.map(job => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between gap-32 border-b py-4 w-full"
                    >
                      <Link
                        href={job.link || '#'}
                        className="font-semibold hover:underline"
                      >
                        {job.title}
                      </Link>

                      <div
                        className={cn(
                          buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          }),
                          'pointer-events-none rounded-full'
                        )}
                      >
                        {job.location}
                      </div>
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
};

export default Careers4;
