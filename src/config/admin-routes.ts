type RouteMap = {
  [key: string]: string;
};

export const adminRouteNames: RouteMap = {
  '/admin': 'Events Overview',
  '/admin/registrations': 'Overall Registrations Dashboard',
  '/admin/events': 'Overall Events Dashboard',
  '/admin/events/create/new-event': 'Create New Event [Alpha: WIP]',
  '/admin/registrations/view/': 'Registration Details',
  '/admin/events/view/': 'Event Details',
};

export function getRouteDisplayName(route: string): string {
  // First try to match the exact route
  if (route in adminRouteNames) {
    return adminRouteNames[route];
  }

  // Try to match routes with slug parameters by checking prefixes
  // For routes like "/admin/events/view/[id]", match with "/admin/events/view/"
  for (const definedRoute in adminRouteNames) {
    // Check if the given route starts with any defined route pattern that ends with '/'
    if (definedRoute.endsWith('/') && route.startsWith(definedRoute)) {
      return adminRouteNames[definedRoute];
    }
  }

  // Try to find the closest parent route
  // Sort routes by length to check more specific routes first
  const sortedRoutes = Object.keys(adminRouteNames).sort(
    (a, b) => b.length - a.length
  );
  for (const definedRoute of sortedRoutes) {
    if (route.startsWith(definedRoute)) {
      return adminRouteNames[definedRoute];
    }
  }

  // Default fallback
  return 'Admin Dashboard';
}
