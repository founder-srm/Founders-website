import { sanityFetch } from '@/sanity/lib/live';
import { BANNER_QUERY } from '@/sanity/lib/queries';
import Banner from '../banner';

export default async function BannerProvider() {
  const { data } = await sanityFetch({ query: BANNER_QUERY });
  return <Banner bannerData={data} />;
}
