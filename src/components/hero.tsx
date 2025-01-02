import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Particles from './ui/particles';
// import type { Hero as HeroType } from '@/sanity/lib/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { HERO_QUERY } from '@/sanity/lib/queries';
import { sanityFetch } from '@/sanity/lib/live';
import InteractiveHoverButton from './ui/interactive-hover-button';

export default async function Hero() {
  const { data } = await sanityFetch({ query: HERO_QUERY });

  const link = data.buttonLink.startsWith('/') ? data.buttonLink : '/';

  return (
    <section className="overflow-hidden w-full relative pb-32 pt-12">
      <Particles className="absolute inset-0 -z-10" />
      <div className="container w-full">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row xl:gap-20">
          {/* Text Content */}
          <div className="flex w-full flex-col items-start text-left pt-12 ">
            <h1 className="mb-8 text-pretty text-4xl font-normal md:text-7xl">
              {data.title}
            </h1>
            <p className="mb-12 max-w-[70%] text-xl font-normal text-muted-foreground">
              {data.subtitle}
            </p>
            <div className="flex w-full justify-start md:justify-start">
              {/* <Button asChild className="group">
                <Link href={link}>
                  {data.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button> */}
              <InteractiveHoverButton link={link} text={data.buttonText} />
            </div>
          </div>

          {/* Image Section */}
          <div className="relative flex h-[600px] w-full rounded-md sm:h-[750px]">
            <div className="absolute flex h-[600px] w-screen rounded-md bg-gradient-to-b from-muted/50 to-muted sm:h-[750px]">
              <Image
                src={urlFor(data.image1).url()}
                alt="Largest"
                width={3840}
                height={2160}
                className="my-auto ml-20 block h-5/6 w-auto rounded-md object-cover md:w-3/5"
                loading="eager"
                priority
              />
              <div className="absolute -left-5 top-1/2 md:-left-20 lg:-left-44">
                <Image
                  src={urlFor(data.image2).url()}
                  alt="Tops small"
                  width={265}
                  height={142}
                  className="mb-6 h-[135px] w-[230px] rounded-lg object-cover shadow-md lg:h-[142px] lg:w-[265px]"
                  loading="eager"
                  priority
                />
                <Image
                  src={urlFor(data.image3).url()}
                  alt="Bottom small"
                  width={265}
                  height={142}
                  className="h-[135px] w-[230px] rounded-lg bg-muted2 object-cover shadow-md lg:h-[142px] lg:w-[265px]"
                  loading="eager"
                  priority
                />
              </div>
              <Image
                src={urlFor(data.image4).url()}
                alt="Bottom right"
                width={265}
                height={156}
                className="absolute -left-5 bottom-[70%] h-[146px] w-[230px] rounded-lg bg-muted2 shadow-md md:bottom-8 md:left-1/4 lg:h-[156px] lg:w-[265px] 2xl:left-32"
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
