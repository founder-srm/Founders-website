'use client';

interface MDXPreProps extends React.HTMLAttributes<HTMLPreElement> {}

export function MDXPre({ children, ...props }: MDXPreProps) {
  return (
    <pre className="p-4 bg-muted rounded-lg overflow-x-auto" {...props}>
      {children}
    </pre>
  );
}
