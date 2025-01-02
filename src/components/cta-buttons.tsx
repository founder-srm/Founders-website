'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CTA } from '@/sanity/lib/sanity.types';

interface CTAButtonsProps {
  ctaData: CTA;
}

const CTAButtons = ({ ctaData }: CTAButtonsProps) => {
  return (
    <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
      <Button
        className={cn(ctaData.variant && "w-full sm:w-auto")}
        onClick={() => window.open(ctaData.primaryButtonLink)}
        variant="outline"
      >
        {ctaData.primaryButtonText}
      </Button>
      {ctaData.activateSecondaryButton && (
        <Button
          className={cn(ctaData.variant && "w-full sm:w-auto")}
          onClick={() => window.open(ctaData.secondaryButtonLink)}
        >
          {ctaData.secondaryButtonText}
        </Button>
      )}
    </div>
  );
};

export default CTAButtons;
