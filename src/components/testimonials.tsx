import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Testimonial10 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="mb-16 max-w-4xl px-8 font-medium lg:text-3xl">
            &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.&rdquo;
          </p>
          <div className="flex items-center gap-2 md:gap-4">
            <Avatar className="size-12 md:size-16">
              <AvatarImage src="https://shadcnblocks.com/images/block/avatar-1.webp" />
              <AvatarFallback>Customer Name</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium md:text-base">Customer Name</p>
              <p className="text-sm text-muted-foreground md:text-base">Role</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial10;
