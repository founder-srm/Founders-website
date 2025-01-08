import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Avoid running on server-side
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        // Initial check
        setMatches(mediaQuery.matches);

        // Create listener
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        mediaQuery.addEventListener('change', listener);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', listener);
    }, [query]);

    return matches;
}