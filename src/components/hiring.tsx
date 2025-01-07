import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { sanityFetch } from '@/sanity/lib/live';
import { JOBS_QUERY } from '@/sanity/lib/queries';

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
            {jobs?.map(jobCategory => (
              <div key={jobCategory.category} className="grid w-full">
                <h2 className="border-b pb-4 text-xl font-bold">
                  {jobCategory.category}
                </h2>
                {jobCategory.openings?.map(job => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between gap-32 border-b py-4 w-full"
                  >
                    <a
                      href={job.link || ''}
                      className="font-semibold hover:underline"
                    >
                      {job.title}
                    </a>

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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers4;
