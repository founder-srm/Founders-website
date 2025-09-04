// Performance optimization utilities for the blog editor

import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing content changes to reduce API calls
 * and improve performance when typing in the editor
 */
export function useDebounce<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Performance monitoring hook to track render count (development only)
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} rendered ${renderCount.current} times`);
  }

  return renderCount.current;
}
