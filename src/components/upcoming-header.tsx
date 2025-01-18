import { sanityFetch } from '@/sanity/lib/live';
import { UPCOMING_HEADER_QUERY } from '@/sanity/lib/queries';

export async function EventsHeader() {
  const { data } = await sanityFetch({ query: UPCOMING_HEADER_QUERY });
  return (
    <div className="mb-8 md:mb-14 lg:mb-16">
      <p className="text-wider mb-4 text-sm font-medium text-muted-foreground">
        {data?.badge}
      </p>
      <h1 className="mb-4 w-full text-4xl font-medium md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl">
        {data?.title}
      </h1>
      <p>{data?.description}</p>
    </div>
  );
}
