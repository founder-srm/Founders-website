'use client';

import { Button } from '@/components/ui/button';
import { TicketPercent, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BannerHeader } from '../../sanity.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const isPathExcluded = (pathname: string, excludedPaths: string[]) => {
  return excludedPaths.some(path => {
    if (path.endsWith('/*')) {
      const prefix = path.slice(0, -2); // Remove /* from the end
      return pathname.startsWith(prefix);
    }
    return pathname === path;
  });
};

export default function Banner({ bannerData }: { bannerData: BannerHeader }) {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const excludedRoutes = [
    '/studio/*',
    '/events/writeup/*',
    '/blog/posts/*',
    '/upcoming/*',
    '/auth/*',
    '/signup',
    '/admin/*',
  ];

  useEffect(() => {
    if (!bannerData?.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = bannerData.endDate
        ? new Date(bannerData.endDate).getTime()
        : 0;
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [bannerData?.endDate]);

  if (isPathExcluded(pathname, excludedRoutes)) {
    return null;
  }

  if (
    !bannerData ||
    !isVisible ||
    !bannerData.isVisible ||
    timeLeft.isExpired
  ) {
    return null;
  }

  return (
    <div className="dark bg-muted px-4 py-3 text-foreground">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
            aria-hidden="true"
          >
            <TicketPercent className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{bannerData.title}</p>
              <p className="text-sm text-muted-foreground">
                {bannerData.description}
              </p>
            </div>
            <div className="flex gap-3 max-md:flex-wrap">
              <div className="flex items-center divide-x divide-primary-foreground rounded-lg bg-primary/15 text-sm tabular-nums">
                {timeLeft.days > 0 && (
                  <span className="flex h-8 items-center justify-center p-2">
                    {timeLeft.days}
                    <span className="text-muted-foreground">d</span>
                  </span>
                )}
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.hours.toString().padStart(2, '0')}
                  <span className="text-muted-foreground">h</span>
                </span>
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                  <span className="text-muted-foreground">m</span>
                </span>
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                  <span className="text-muted-foreground">s</span>
                </span>
              </div>
              <Button size="sm" className="text-sm" asChild>
                <Link href={bannerData.buttonLink || '/'}>
                  {bannerData.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
