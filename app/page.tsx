'use client';
import CardChangeComponent from "@/components/custom/CardChangeComponent";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Footer from "@/components/footer";
import { useRef } from "react";

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: mainRef });

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (stickyRef.current && mainRef.current){
      const stickyRect = stickyRef.current.getBoundingClientRect();
      const mainRect = mainRef.current.getBoundingClientRect();
  
      if (stickyRect.top <= mainRect.top && stickyRect.bottom >= mainRect.bottom) {
        // Pass scroll reference to StickyScroll component
        stickyRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  return (
    <main className="w-full min-h-screen h-full flex flex-col overflow-y-auto" ref={mainRef}>
      <section className="pl-[60px] pt-[60px] h-screen w-full">e</section>
      <div ref={stickyRef} className="">
        <CardChangeComponent />
      </div>
      <div className="w-full h-36"></div>
      <Footer />
    </main>
  );
}
