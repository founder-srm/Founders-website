'use client';

import { cn } from '@/lib/utils';

import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';

interface MDXAlertProps {
  children: React.ReactNode;
  variant: 'default' | 'destructive';
}

export function MDXAlert({ children, variant }: MDXAlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 ',
        variant === 'destructive' && 'text-red-600 border-red-500/50 ',
        variant === 'default' &&
          'border-emerald-500/50 px-4 py-3 text-emerald-600'
      )}
    >
      <p className="text-sm">
        {variant === 'destructive' && (
          <FaCircleExclamation
            className="-mt-0.5 me-3 inline-flex opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        {variant === 'default' && (
          <FaCircleCheck
            className="-mt-0.5 me-3 inline-flex opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        {children}
      </p>
    </div>
  );
}
