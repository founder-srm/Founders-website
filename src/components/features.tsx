import {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
} from 'lucide-react';
import { sanityFetch } from '@/sanity/lib/live';
import { FEATURES_QUERY } from '@/sanity/lib/queries';
import type { Feature } from '@/sanity/lib/sanity.types';
import { createElement } from 'react';

const iconComponents = {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
};

const Feature43 = async () => {
  const { data: reasons } = await sanityFetch({ query: FEATURES_QUERY });

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Why Work With Us?
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons?.map((reason: Feature) => (
            <div key={reason._id} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {iconComponents[reason.icon as keyof typeof iconComponents] &&
                  createElement(
                    iconComponents[reason.icon as keyof typeof iconComponents]
                  )}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature43;
