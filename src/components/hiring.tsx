import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";

const Careers4 = () => {
  const jobs = [
    {
      category: "Engineering",
      openings: [
        {
          title: "Senior Software Engineer",
          location: "Remote",
          link: "#",
        },
        {
          title: "Product Manager",
          location: "Windhoek, Namibia",
          link: "#",
        },
        {
          title: "QA Engineer",
          location: "Remote",
          link: "#",
        },
        {
          title: "Technical Support Specialist",
          location: "Remote",
          link: "#",
        },
      ],
    },
    {
      category: "Marketing",
      openings: [
        {
          title: "Content Writer",
          location: "Fes, Morocco",
          link: "#",
        },
        {
          title: "Social Media Manager",

          location: "Goa, India",
          link: "#",
        },
      ],
    },
  ];

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-screen-lg">
          <div className="text-center lg:text-left">
            <h1 className="text-left text-3xl font-medium md:text-4xl">
              Job Openings
            </h1>
          </div>
          <div className="mx-auto mt-6 flex flex-col gap-16 md:mt-14">
            {jobs.map((jobCategory) => (
              <div key={jobCategory.category} className="grid">
                <h2 className="border-b pb-4 text-xl font-bold">
                  {jobCategory.category}
                </h2>
                {jobCategory.openings.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between border-b py-4"
                  >
                    <a
                      href={job.link}
                      className="font-semibold hover:underline"
                    >
                      {job.title}
                    </a>

                    <div
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "sm",
                        }),
                        "pointer-events-none rounded-full",
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
