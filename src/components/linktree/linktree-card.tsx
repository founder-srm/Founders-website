'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { platformConfig, resolvePlatformIcon } from './platform-icons';

interface LinkTreeCardProps {
  title: string;
  description?: string;
  themeColor?: string;
  avatarUrl?: string; // direct URL fallback
  // raw sanity image value (with asset ref)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  avatarValue?: any;
  // optional secondary logo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logoValue?: any;
  links: {
    _key: string;
    label: string;
    platform?: string;
    url: string;
    iconOverride?: string;
    highlight?: boolean;
    pinned?: boolean;
    order?: number;
    active?: boolean;
  }[];
}

export const LinkTreeCard: React.FC<LinkTreeCardProps> = ({
  title,
  description,
  themeColor,
  avatarUrl,
  avatarValue,
  logoValue,
  links,
}) => {
  const accent = themeColor || 'hsl(var(--primary))';

  const ordered = [...links]
    .filter(l => l.active !== false)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (b.pinned && !a.pinned) return 1;
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return a.label.localeCompare(b.label);
    });

  return (
    <div className="max-w-md w-full mx-auto">
      <Card
        className="overflow-hidden border-muted/50"
        style={{ '--accent': accent } as React.CSSProperties}
      >
        <CardHeader className="flex items-center flex-col gap-4 text-center">
          <div
            className="h-24 w-24 rounded-full ring-4 ring-offset-2 ring-offset-background ring-[color:var(--accent)] bg-muted flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#111' }}
          >
            {avatarUrl || logoValue || avatarValue ? (
              <Image
                src={
                  avatarUrl ||
                  (logoValue
                    ? urlFor(logoValue).width(192).height(192).url()
                    : avatarValue
                      ? urlFor(avatarValue).width(192).height(192).url()
                      : '')
                }
                alt={title}
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-4xl font-semibold text-muted-foreground">
                {title?.[0] || '•'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm mt-2 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {ordered.map(link => {
            const Icon = resolvePlatformIcon(link.platform, link.iconOverride);
            const platform = link.platform?.toLowerCase();
            const highlightClasses = link.highlight
              ? 'border-[color:var(--accent)] shadow-[0_0_0_1px_var(--accent)]'
              : 'border-muted/40';

            return (
              <a
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group flex items-center gap-3 w-full rounded-md border px-4 py-3 transition-colors bg-card hover:bg-accent/10',
                  highlightClasses
                )}
                style={
                  link.highlight
                    ? {
                        background:
                          'linear-gradient(90deg,var(--accent),transparent 120%)',
                        color: 'white',
                      }
                    : {}
                }
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md bg-muted shrink-0 group-hover:scale-105 transition-transform',
                    platform && platformConfig[platform]?.className
                  )}
                  style={
                    link.highlight
                      ? {
                          background: 'rgba(0,0,0,0.25)',
                          backdropFilter: 'blur(4px)',
                          color: 'white',
                        }
                      : undefined
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1 font-medium truncate">
                  {link.label}
                </span>
                <Button
                  size="sm"
                  variant={link.highlight ? 'secondary' : 'outline'}
                  className={cn(
                    'ml-auto',
                    link.highlight &&
                      'border-white/50 text-white hover:text-white'
                  )}
                >
                  <ExternalLink />
                </Button>
              </a>
            );
          })}
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          Powered by Founders Club
        </CardFooter>
      </Card>
    </div>
  );
};
