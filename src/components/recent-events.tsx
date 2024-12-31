import { ArrowRight } from "lucide-react";

const webinars = [
  {
    id: "webinar-1",
    title: "Duis sem sem, gravida vel porttitor eu, volutpat ut arcu",
    summary:
      "Pellentesque eget quam ligula. Sed felis ante, consequat nec ultrices ut, ornare quis metus. Vivamus sit amet tortor vel enim sollicitudin hendrerit.",
    label: "Ut varius dolor turpis",
    author: "Jane Doe",
    published: "1 Jan 2024",
    href: "#",
    image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
  },
  {
    id: "webinar-2",
    title: "Duis sem sem, gravida vel porttitor eu, volutpat ut arcu",
    summary:
      "Pellentesque eget quam ligula. Sed felis ante, consequat nec ultrices ut, ornare quis metus. Vivamus sit amet tortor vel enim sollicitudin hendrerit.",
    label: "Ut varius dolor turpis",
    author: "Jane Doe",
    published: "1 Jan 2024",
    href: "#",
    image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
  },
];

const Blog8 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-16">
        <h2 className="mx-auto mb-3 text-pretty text-center text-2xl font-semibold md:mb-4 md:text-3xl lg:mb-6 lg:max-w-3xl">
          Webinars
        </h2>
        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {webinars.map((webinar) => (
            <a
              key={webinar.id}
              href={webinar.href}
              className="group order-last grid gap-y-6 sm:order-first sm:col-span-12 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:col-span-10 lg:col-start-2 lg:gap-x-12"
            >
              <div className="sm:col-span-5">
                <div className="mb-4 md:mb-6">
                  <div className="flex text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="mr-3 md:mr-5 lg:mr-6">Webinar</span>
                    <span className="mr-3 md:mr-5 lg:mr-6">
                      Employer of record
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                  Engaging Talent, Embracing Change: Uncover the Value of an
                  Employer of Record
                </h3>
                <div className="mt-4 flex items-center space-x-2 md:mt-5">
                  <span className="font-semibold md:text-base">Read more</span>
                  <ArrowRight className="ml-2 size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="order-first sm:order-last sm:col-span-5">
                <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                  <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.05]"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog8;
