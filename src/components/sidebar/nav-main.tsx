'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { KeyboardShortcut } from '@/components/ui/keyboard-shortcut';
import { cn } from '@/lib/utils';

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: (callback: any) => boolean; // New onClick handler
  }[];
  className?: string;
  onSearchClick?: () => void; // New prop for handling search click
}

export function NavMain({ items, className, onSearchClick }: NavMainProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.url;

        // Special handling for Search button
        if (item.title === 'Search' && onSearchClick) {
          return (
            <button
              type="button"
              key={item.title}
              onClick={onSearchClick}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start px-2 group relative',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
              <div className="ml-auto">
                <KeyboardShortcut
                  keys={['Ctrl', 'K']}
                  size="sm"
                  className="opacity-60 group-hover:opacity-100"
                />
              </div>
            </button>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'justify-start px-2',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
