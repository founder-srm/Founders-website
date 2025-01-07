import { sanityFetch } from '@/sanity/lib/live';
import { FEATURES_QUERY } from '@/sanity/lib/queries';
import ShineCard from './ui/shine-card';

const Feature43 = async () => {
  const { data: reasons } = await sanityFetch({ query: FEATURES_QUERY });

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl heading-gradient">
            What we do in Founder&apos;s Club.
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons?.map(reason => (
            <ShineCard key={reason._id} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature43;
