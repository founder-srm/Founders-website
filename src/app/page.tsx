import CTA11 from '@/components/cta1';
import Faq1 from '@/components/faqs';
import { InfiniteSliderBanner } from '@/components/fc-banner-home';
import Feature43 from '@/components/features';
import Hero from '@/components/hero';
import Blog8 from '@/components/recent-events';
import RelatedPosts from '@/components/related-posts';
import Testimonial10 from '@/components/testimonials';
import { SanityLive } from '@/sanity/lib/live';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full overflow-x-hidden relative">
      <section className='md:px-16'>
        <Hero />
      </section>
      <section className='z-50 overflow-clip'>
        <InfiniteSliderBanner />
      </section>
      <section className='md:px-16'>
        <Feature43 />
        <RelatedPosts />
        <Blog8 />
        <Testimonial10 />
        <Faq1 />
        <CTA11 />
      </section>
      <SanityLive />
    </main>
  );
}
