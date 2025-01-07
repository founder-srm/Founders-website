'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Extract language from className if provided (e.g., "language-typescript" -> "typescript")
  const languageClass =
    language || className?.replace('language-', '') || 'plaintext';

  return (
    <div className="relative w-full group">
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition">
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8 hover:bg-muted/80 bg-background/80"
        >
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      <pre
        className={cn(
          'px-4 py-4 overflow-x-auto rounded-lg border',
          'relative font-mono text-sm leading-6',
          'bg-muted/50 dark:bg-muted/80',
          className
        )}
      >
        <code className={`language-${languageClass} min-w-full inline-block`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
