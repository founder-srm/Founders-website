'use client';

import { SmartLink } from '@/once-ui/components';
import type { ReactNode } from 'react';

interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string; // Make href optional to match HTML anchor element type
  prefixIcon?: string;
  suffixIcon?: string;
  iconSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
  style?: React.CSSProperties;
  className?: string;
  selected?: boolean;
  unstyled?: boolean;
  children: ReactNode;
}

export function MDXLink({ href = '#', children, ...props }: MDXLinkProps) {
  return (
    <SmartLink
      href={href}
      className="text-primary hover:underline"
      iconSize="xs"
      {...props}
    >
      {children}
    </SmartLink>
  );
}
