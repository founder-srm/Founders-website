'use client';
import React, { useRef, useEffect } from 'react';
import CardChangeComponent from '@/components/custom/CardChangeComponent';
import Footer from '@/components/footer';
import gsap from 'gsap';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isStuck = useRef(false); // Track sticky state

  // Leverage GSAP ScrollTrigger for precise scroll tracking
  useEffect(() => {
    if (stickyRef.current && mainRef.current) {
      const scrollTrigger = gsap.timeline({
        paused: true,
      });

      scrollTrigger
        .to(stickyRef.current, {
          y: 0,
          duration: 0.3, // Adjust duration for smooth scrolling
          ease: 'power3.inOut', // Customize easing for desired animation
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scroller: mainRef.current,
            scrub: true, // Continuously update animation based on scroll
            onUpdate: self => {
              // Update isStuck state based on scroll position
              isStuck.current = self.progress >= 1; // Fully in view
            },
          },
        })
        .to(stickyRef.current, {
          y: '100%', // Adjust offset for reverse behavior (optional)
          duration: 0.3, // Adjust duration for smooth scrolling
          ease: 'power3.inOut', // Customize easing for desired animation
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'bottom bottom',
            end: 'top top',
            scroller: mainRef.current,
            scrub: true, // Continuously update animation based on scroll
            onUpdate: self => {
              // Update isStuck state based on scroll position (reverse)
              isStuck.current = self.progress <= 0; // Completely out of view
            },
          },
        });

      return () => {
        scrollTrigger.kill(); // Cleanup ScrollTrigger on unmount
        return undefined;
      };
    }
  }, [stickyRef, mainRef]);

  // Conditionally apply sticky behavior with GSAP
  useEffect(() => {
    if (isStuck.current) {
      gsap.to(stickyRef.current, {
        y: 0, // Fix the sticky element in place
        duration: 0.3, // Adjust duration for smooth transition
      });
    } else {
      gsap.to(stickyRef.current, {
        y: 'unset', // Restore default position when out of view
        duration: 0.3, // Adjust duration for smooth transition
      });
    }
  }, []);

  return (
    <main
      className="flex h-full min-h-screen w-full flex-col overflow-y-auto"
      ref={mainRef}
    >
      <section className="h-screen w-full pl-[60px] pt-[60px]">Content</section>

      <div ref={stickyRef} className="">
        <CardChangeComponent />
      </div>

      <div className="h-36 w-full"></div>
      <Footer />
    </main>
  );
}