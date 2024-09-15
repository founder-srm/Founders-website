'use client';
import CardChangeComponent from '@/components/custom/CardChangeComponent';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import Footer from '@/components/footer';
import { useRef } from 'react';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: mainRef });

  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (stickyRef.current && mainRef.current) {
      const stickyRect = stickyRef.current.getBoundingClientRect();
      const mainRect = mainRef.current.getBoundingClientRect();

      if (stickyRect.top <= mainRect.top && stickyRect.bottom >= mainRect.bottom) {
        // Pass scroll reference to StickyScroll component
        stickyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  return (
    <main className="flex h-full min-h-screen w-full flex-col overflow-y-auto" ref={mainRef}>
      <section className="h-screen w-full pl-[60px] pt-[60px]">e</section>
      <div ref={stickyRef} className="">
        <CardChangeComponent />
      </div>
      <div className="h-36 w-full"></div>
      <Footer />
    </main>
  );
}
