import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600; // revalidate every hour

const Testimonial10 = async () => {
  const { data: testimonials } = await sanityFetch({
    query: TESTIMONIALS_QUERY,
  });
  const testimonial = testimonials[0];
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="mb-16 max-w-4xl px-8 font-medium lg:text-3xl">
            {testimonial?.quote}
          </p>
          <div className="flex items-center gap-2 md:gap-4">
            <Avatar className="size-12 md:size-16">
              <AvatarImage
                src={urlFor(testimonial.author?.image || '').url()}
              />
              <AvatarFallback>{testimonial.author?.name}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium md:text-base">
                {testimonial.author?.name}
              </p>
              <p className="text-sm text-muted-foreground md:text-base">
                {testimonial.author?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial10;
