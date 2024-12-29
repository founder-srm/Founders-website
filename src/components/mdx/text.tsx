"use client";

interface MDXTextProps {
  children: React.ReactNode;
}

export function MDXText({ children }: MDXTextProps) {
  return <div className="text-base leading-7 mb-6">{children}</div>;
}