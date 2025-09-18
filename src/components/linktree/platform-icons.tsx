import {
  Dribbble,
  Figma,
  Globe2,
  Instagram,
  Link as LinkIcon,
  Mail,
} from 'lucide-react';
import type React from 'react';

const DeviantArtIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M15.18 3 13.4 6.37l.41.63H19v4h-3.18l-.72 1.26.41.74H19v4h-4.59L8.82 21H5v-3.74l1.78-3.37-.41-.63H5V9h3.18l.72-1.26-.41-.74H5V3h4.59L15.18 3Z"
    />
  </svg>
);

const BeeFreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 2c.6 0 1.15.27 1.52.74l2.28 2.86c.3.38.47.84.47 1.33v9.14c0 .49-.17.95-.47 1.33l-2.28 2.86c-.37.47-.92.74-1.52.74s-1.15-.27-1.52-.74l-2.28-2.86A2.1 2.1 0 0 1 8 16.07V6.93c0-.49.17-.95.47-1.33l2.28-2.86C10.85 2.27 11.4 2 12 2Zm0 4.25c-.69 0-1.25.56-1.25 1.25v9c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-9c0-.69-.56-1.25-1.25-1.25Z"
      opacity=".4"
    />
    <path
      fill="currentColor"
      d="M6.5 8h-2a.5.5 0 0 0-.5.5v7c0 .28.22.5.5.5h2c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm13 0h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z"
    />
  </svg>
);

export const platformConfig: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { label: string; icon: React.ComponentType<any>; className?: string }
> = {
  instagram: {
    label: 'Instagram',
    icon: Instagram,
    className: 'text-pink-500',
  },
  dribbble: { label: 'Dribbble', icon: Dribbble, className: 'text-pink-400' },
  deviantart: {
    label: 'DeviantArt',
    icon: DeviantArtIcon,
    className: 'text-green-500',
  },
  figma: { label: 'Figma', icon: Figma, className: 'text-violet-500' },
  beefree: { label: 'BeeFree', icon: BeeFreeIcon, className: 'text-amber-500' },
  custom: { label: 'Link', icon: LinkIcon },
  email: { label: 'Email', icon: Mail },
  website: { label: 'Website', icon: Globe2 },
};

export function resolvePlatformIcon(platform?: string, iconOverride?: string) {
  if (iconOverride && platformConfig[iconOverride.toLowerCase()]) {
    return platformConfig[iconOverride.toLowerCase()].icon;
  }
  return platformConfig[platform || 'custom']?.icon || LinkIcon;
}
