"use client";

import { MDXRemote } from "next-mdx-remote";
import { MDXProvider } from "@/lib/mdx-provider";
import components from "@/components/mdx/mdx-components";

export function MDXWrapper({ source }: { source: any }) {
  return (
    <MDXProvider components={components}>
      <MDXRemote {...source} components={components} />
    </MDXProvider>
  );
}