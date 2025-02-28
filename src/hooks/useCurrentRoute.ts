'use client';

import { usePathname } from 'next/navigation';

export function useCurrentRoute() {
  const pathname = usePathname();
  
  // Get the route segments after /admin/
  const routeAfterAdmin = pathname.split('/admin/')[1] || '';
  
  return {
    pathname,
    routeAfterAdmin,
    isRootAdmin: pathname === '/admin' || pathname === '/admin/',
  };
}
