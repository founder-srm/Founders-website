'use client';
import React, { useRef, useEffect } from 'react';
import CardChangeComponent from '@/components/custom/CardChangeComponent';
import Footer from '@/components/footer';
import gsap from 'gsap';
import HeroSection from '@/components/home/hero-section';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isStuck = useRef(false); 

  useEffect(() => {
    if (stickyRef.current && mainRef.current) {
      const scrollTrigger = gsap.timeline({
        paused: true,
      });

      scrollTrigger
        .to(stickyRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scroller: mainRef.current,
            scrub: true,
            onUpdate: self => {
              isStuck.current = self.progress >= 1; 
            },
          },
        })
        .to(stickyRef.current, {
          y: '100%', 
          duration: 0.3, 
          ease: 'power3.inOut', 
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'bottom bottom',
            end: 'top top',
            scroller: mainRef.current,
            scrub: true, 
            onUpdate: self => {
              
              isStuck.current = self.progress <= 0; // Completely out of view
            },
          },
        });

      return () => {
        scrollTrigger.kill(); 
        return undefined;
      };
    }
  }, [stickyRef, mainRef]);

  
  useEffect(() => {
    if (isStuck.current) {
      gsap.to(stickyRef.current, {
        y: 0, 
        duration: 0.3,
      });
    } else {
      gsap.to(stickyRef.current, {
        y: 'unset', 
        duration: 0.3, 
      });
    }
  }, []);

  return (
    <main
      className="flex h-full min-h-screen w-full flex-col overflow-y-auto"
      ref={mainRef}
    >
      <HeroSection />
      <div ref={stickyRef} className="">
        <CardChangeComponent />
      </div>

      <div className="h-96 w-full"></div>
      <Footer />
    </main>
  );
}