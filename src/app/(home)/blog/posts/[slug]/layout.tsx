'use client';
import type React from 'react';
import { Suspense, useRef } from 'react';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Suspense unstable_expectedLoadTime={10} fallback={<div>Loading...</div>}>
      <main className="overflow-hidden w-full h-full relative">
        <div
          className="h-[95vh] overflow-y-auto px-8 pb-16 pt-16"
          suppressHydrationWarning
          ref={containerRef}
        >
          <div className="pointer-events-none absolute left-0 top-0 h-24 w-full to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] bg-neutral-950" />
          <div className="pointer-events-none absolute left-0 top-0 w-full">
            <div className="absolute left-0 top-0 h-0.5 w-full bg-[#111111]" />
            <ScrollProgress
              className="absolute top-0 h-0.5 bg-[linear-gradient(to_right,rgba(255,255,255,0),#ffffff_75%,#ffffff_100%)]"
              containerRef={containerRef}
              springOptions={{
                stiffness: 280,
                damping: 18,
                mass: 0.3,
              }}
            />
          </div>
          {children}
        </div>
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            '[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] '
          )}
        />
      </main>
    </Suspense>
  );
}
