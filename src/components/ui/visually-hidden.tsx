import { cn } from '@/lib/utils';
import React from 'react';

type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0',
          'clip-[rect(0_0_0_0)]',
          className
        )}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
