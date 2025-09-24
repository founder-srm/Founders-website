'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type * as React from 'react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="fun"
      enableSystem
      themes={['light', 'dark', 'fun', 'purple', 'system']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
