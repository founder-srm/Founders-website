import Image from 'next/image';

export default function OurStory() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-start gap-6 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-start gap-24 lg:w-1/2">
            <div className="pr-6">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:mb-10 lg:text-6xl">
                Our Story
              </h1>
              <p className="mb-9 lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
                alias repellendus perferendis earum facilis est soluta
                consequatur placeat hic aliquid exercitationem, ex molestias nam
                veniam distinctio maxime culpa magnam autem.
              </p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Similique dolore quas placeat expedita aliquam rerum tempore
                amet, sequi ipsa ad quam, adipisci exercitationem nihil,
                sapiente laborum minus doloribus consequuntur sed. Quo
                repudiandae nihil quas voluptates, aut beatae reiciendis aliquid
                perspiciatis quae explicabo inventore temporibus laborum,
                nostrum omnis quos excepturi dolorum reprehenderit vel labore
                eaque libero perferendis? Qui illo numquam beatae?
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <Image
                src="https://shadcnblocks.com/images/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
                alt="about 1"
                width={400}
                height={571}
                className="aspect-[0.7] w-full rounded-lg object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <Image
                  src="https://shadcnblocks.com/images/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg"
                  alt="about 2"
                  width={400}
                  height={364}
                  className="aspect-[1.1] rounded-lg object-cover"
                />
                <Image
                  src="https://shadcnblocks.com/images/block/photos/annie-spratt-vGgn0xLdy8s-unsplash.jpg"
                  alt="about 3"
                  width={400}
                  height={571}
                  className="aspect-[0.7] rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-12 pt-12 lg:w-1/2 lg:pt-48">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <Image
                src="https://shadcnblocks.com/images/block/photos/johnson-wang-iI4sR_nkkbc-unsplash.jpg"
                alt="about 4"
                width={400}
                height={444}
                className="aspect-[0.9] w-full rounded-lg object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <Image
                  src="https://shadcnblocks.com/images/block/photos/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg"
                  alt="about 5"
                  width={400}
                  height={500}
                  className="aspect-[0.8] rounded-lg object-cover"
                />
                <Image
                  src="https://shadcnblocks.com/images/block/photos/alvin-engler-bIhpiQA009k-unsplash.jpg"
                  alt="about 6"
                  width={400}
                  height={444}
                  className="aspect-[0.9] rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="px-8">
              <h1 className="mb-8 text-2xl font-semibold lg:mb-6">
                Our Workplace
              </h1>
              <p className="mb-9 lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
                quae vel rem tenetur illum aspernatur. Ea, facere soluta cumque
                laboriosam repudiandae quaerat inventore dolores saepe pariatur,
                adipisci atque voluptate doloribus!
              </p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
                aliquid laudantium minus distinctio exercitationem odio non
                nihil blanditiis quae, beatae assumenda ad reiciendis soluta
                dolorem. Natus repellendus quidem dolorum temporibus!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
