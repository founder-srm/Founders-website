import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { ctaQuery } from "@/sanity/lib/queries/ctaQuery";

const CTA11 = async () => {
  const ctaData = await client.fetch(ctaQuery);
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            {ctaData.title}
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {ctaData.description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
            <Button className="w-full sm:w-auto">Get Started</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA11;
