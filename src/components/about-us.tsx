import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { ABOUT_HERO_QUERY } from '@/sanity/lib/queries';
import { CircleArrowRight, Files, Settings } from 'lucide-react';
import Image from 'next/image';
import { createElement } from 'react';

const iconComponents = {
  CircleArrowRight,
  Files,
  Settings,
};

export const revalidate = 3600; // revalidate every hour

export default async function About1() {
  const { data } = await sanityFetch({ query: ABOUT_HERO_QUERY });
  return (
    data && (
      <section className=" container">
        <div className="container flex flex-col gap-28 py-32">
          <div className="flex flex-col gap-7">
            <h1 className="text-4xl font-semibold lg:text-7xl">{data.title}</h1>
            <p className="max-w-xl text-lg">{data.subTitle}</p>
          </div>
          <Image
            src={urlFor(data.bannerImage || '').url()}
            alt="placeholder"
            width={1920}
            height={1440}
            className="size-full max-h-96 rounded-2xl object-cover"
            loading="lazy"
          />
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
            <p className="text-sm text-muted-foreground">OUR MISSION</p>
            <p className="text-lg font-medium">{data.ourMission}</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              {data.secondaryHeading}
            </h2>
            <p className="text-muted-foreground">{data.secondarySubHeading}</p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {data.ourValues?.map((value, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  {createElement(
                    iconComponents[value.icon as keyof typeof iconComponents],
                    { size: 20 }
                  )}
                </div>
                <h3 className="mb-3 mt-2 text-lg font-semibold">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-10 text-sm font-medium text-muted-foreground">
              Join Our Team!
            </p>
            {data.aboutUsCtaComponent?.map((cta, index) => (
              <div key={index}>
                <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                  {cta.title}
                </h2>
                <Image
                  src={urlFor(cta?.ctaBannerImage || '').url()}
                  alt="placeholder"
                  width={1200}
                  height={300}
                  className="mb-6 max-h-36 w-full rounded-xl object-cover"
                />
                <p className="text-muted-foreground">{cta?.subTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  );
}
