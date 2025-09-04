'use client';
import { Sparkle } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { InfiniteSlider } from './ui/infinite-slider';

interface BannerSingletonProps {
  color: string;
}

const BannerSingleton = memo(({ color }: BannerSingletonProps) => {
  return (
    <div className="w-auto max-h-8 flex items-center justify-center gap-2">
      <Sparkle style={{ color: color }} />
      <h4 className="font-medium text-2xl heading-gradient my-auto">
        FOUNDERS CLUB
      </h4>
    </div>
  );
});

BannerSingleton.displayName = 'BannerSingleton';

export function InfiniteSliderBanner() {
  const presetColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  const [colors, setColors] = useState(
    [...Array(10)].map((_, i) => presetColors[i % presetColors.length])
  );

  useEffect(() => {
    const randomColors = [...Array(10)].map(
      () => presetColors[Math.floor(Math.random() * presetColors.length)]
    );
    setColors(randomColors);
  }, []);

  return (
    <div className="w-screen overflow-hidden z-50 h-fit py-6 md:py-12 relative">
      <div className="absolute inset-0 top-4">
        <InfiniteSlider
          className="rotate-2 blur-[2px] opacity-75 bg-accent/80 py-4 shadow-lg"
          gap={100}
          duration={60}
          durationOnHover={65}
          reverse
        >
          {colors.map((color, index) => (
            <BannerSingleton key={`banner-bg-${index}`} color={color} />
          ))}
        </InfiniteSlider>
      </div>
      <InfiniteSlider
        className="-rotate-2 relative z-10 bg-accent py-4"
        gap={100}
        duration={50}
        durationOnHover={55}
        reverse
      >
        {colors.map((color, index) => (
          <BannerSingleton key={`banner-front-${index}`} color={color} />
        ))}
      </InfiniteSlider>
    </div>
  );
}
