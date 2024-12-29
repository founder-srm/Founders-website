"use client";

import { createContext, useContext } from "react";
import type { MDXComponents } from "@/types/mdx";

interface MDXContextType {
  components: Partial<MDXComponents>;
}

const MDXContext = createContext<MDXContextType | undefined>(undefined);

export function MDXProvider({
  children,
  components,
}: {
  children: React.ReactNode;
  components: Partial<MDXComponents>;
}) {
  return (
    <MDXContext.Provider value={{ components }}>
      {children}
    </MDXContext.Provider>
  );
}

export function useMDXComponents() {
  const context = useContext(MDXContext);
  if (!context) {
    throw new Error("useMDXComponents must be used within an MDXProvider");
  }
  return context.components;
}