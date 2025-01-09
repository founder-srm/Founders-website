'use client';

import type * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="fun" 
      enableSystem
      themes={['dark', 'fun']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
