import { sanityFetch } from '@/sanity/lib/live';
import { CTA_QUERY } from '@/sanity/lib/queries';
import CTAButtons from './cta-buttons';

export const revalidate = 3600; // revalidate every hour

function Noise() {
  return (
    <div
      className="pointer-events-none w-full h-full overflow-hidden absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: 'url(/textures/pixels.png)',
        backgroundSize: '10%',
      }}
    />
  );
}

const CTA11 = async () => {
  const { data } = await sanityFetch({ query: CTA_QUERY });
  const ctaData = data[0];

  if (!ctaData.showCTA) {
    return <></>;
  }

  return ctaData.variant ? (
    <section className="py-32 w-full container">
      <div className="container relative">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 heading-gradient">
            {ctaData.title}
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {ctaData.description}
          </p>
          <CTAButtons ctaData={ctaData} />
        </div>
        <Noise />
      </div>
    </section>
  ) : (
    <section className="py-32 w-full container">
      <div className="container relative">
        <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 heading-gradient">
              {ctaData.title}
            </h3>
            <p className="text-muted-foreground lg:text-lg">
              {ctaData.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <CTAButtons ctaData={ctaData} />
          </div>
        </div>
        <Noise />
      </div>
    </section>
  );
};

export default CTA11;
