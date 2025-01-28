'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { createElement, type MouseEvent } from 'react';
import {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
} from 'lucide-react';

type ShineCardProps = {
  reason: {
    _id: string;
    _createdAt: string;
    title: string | null;
    description: string | null;
    icon: string | null;
  };
};

const iconComponents = {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
};

function Noise() {
  return (
    <div
      className="pointer-events-none w-full h-full overflow-hidden absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: 'url(/textures/pixels.png)',
        backgroundSize: '30%',
      }}
    />
  );
}

export default function ShineCard({ reason }: ShineCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative max-w-md rounded-xl border border-white/10 bg-accent px-8 py-8 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(100, 100, 100, 0.2),
              transparent 80%
            )
          `,
        }}
      />
      <div key={reason._id} className="flex flex-col items-start">
        <div className="mb-5 flex size-16 rounded-full items-start justify-start bg-accent">
          {iconComponents[reason.icon as keyof typeof iconComponents] &&
            createElement(
              iconComponents[reason.icon as keyof typeof iconComponents],
              { size: 24 }
            )}
        </div>
        <h3 className="mb-3 text-xl font-semibold">{reason.title}</h3>
        <p className="text-muted-foreground">{reason.description}</p>
      </div>
      <Noise />
    </div>
  );
}
