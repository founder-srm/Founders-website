import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { OUR_STORY_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';

export const revalidate = 3600; // revalidate every hour

export default async function OurStory() {
  const { data } = await sanityFetch({ query: OUR_STORY_QUERY });

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-start gap-6 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-start gap-24 lg:w-1/2">
            <div className="pr-6">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:mb-10 lg:text-6xl">
                {data?.title}
              </h1>
              <p className="mb-9 lg:text-xl">{data?.mainContent}</p>
              <p className="text-muted-foreground">{data?.secondaryContent}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <Image
                src={urlFor(data?.images?.image1 || '').url()}
                alt={data?.images?.image1?.alt || 'About 1'}
                width={1000}
                height={1428}
                loading="lazy"
                className="aspect-[0.7] brightness-105 w-full rounded-lg  object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <Image
                  src={urlFor(data?.images?.image2 || '').url()}
                  alt={data?.images?.image2?.alt || 'About 2'}
                  width={2040}
                  height={1856}
                  loading="lazy"
                  className="aspect-[1.1] brightness-105 rounded-lg object-cover"
                />
                <Image
                  src={urlFor(data?.images?.image3 || '').url()}
                  alt={data?.images?.image3?.alt || 'About 3'}
                  width={2040}
                  height={2912}
                  loading="lazy"
                  className="aspect-[0.7] brightness-105 rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-12 pt-12 lg:w-1/2 lg:pt-48">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <Image
                src={urlFor(data?.images?.image4 || '').url()}
                alt={data?.images?.image4?.alt || 'About 4'}
                width={2040}
                height={2264}
                loading="lazy"
                className="aspect-[0.9] brightness-105 w-full rounded-lg object-cover md:w-1/2"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <Image
                  src={urlFor(data?.images?.image5 || '').url()}
                  alt={data?.images?.image5?.alt || 'About 5'}
                  width={2040}
                  height={2550}
                  loading="lazy"
                  className="aspect-[0.8] brightness-105 rounded-lg object-cover"
                />
                <Image
                  src={urlFor(data?.images?.image6 || '').url()}
                  alt={data?.images?.image6?.alt || 'About 6'}
                  width={2040}
                  height={2264}
                  loading="lazy"
                  className="aspect-[0.9] brightness-105 rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="px-8">
              <h1 className="mb-8 text-2xl font-semibold lg:mb-6">
                {data?.workplaceTitle}
              </h1>
              <p className="mb-9 lg:text-xl">{data?.workplaceContent}</p>
              <p className="text-muted-foreground">
                {data?.workplaceSecondaryContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
