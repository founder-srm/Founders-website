'use client';


import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckmarkIcon, CopyIcon } from '@sanity/icons';

interface CodeProps {
  children: string;
  className?: string;
  language?: string;
}

export function MDXCode({ children, className, language }: CodeProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className={cn('p-4 bg-muted rounded-lg overflow-x-auto', className)}>
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type='button'
            onClick={copyToClipboard}
            className="p-2 rounded-md bg-background/50 hover:bg-background/80 transition-colors"
          >
            {copied ? (
              <CheckmarkIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <code className="text-sm">{children}</code>
      </pre>
    </div>
  );
}
