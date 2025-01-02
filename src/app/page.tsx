import CTA11 from '@/components/cta1';
import Faq1 from '@/components/faqs';
import Feature43 from '@/components/features';
import Hero from '@/components/hero';
// import Careers4 from '@/components/hiring';
import Blog8 from '@/components/recent-events';
import RelatedPosts from '@/components/related-posts';
import { SanityLive } from '@/sanity/lib/live';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full md:px-16">
      <Hero />
      <Feature43 />
      <RelatedPosts />
      <Blog8 />
      {/* <Careers4 /> */}
      <CTA11 />
      <Faq1 />
      <SanityLive />
    </main>
  );
}
