import { BANNER_QUERY } from '@/sanity/lib/queries';
import Banner from '../banner';
import { sanityFetch } from '@/sanity/lib/live';

export default async function BannerProvider() {
  const { data } = await sanityFetch({ query: BANNER_QUERY });
  return <Banner bannerData={data} />;
}
