'use client';
import { EventAgentProvider } from '@/components/providers/EventAgentProvider';
import { ReactQueryClientProvider } from '@/components/providers/QueryClientProvider';
import { SidebarLeft } from '@/components/sidebar/sidebar-left';
import { SidebarRight } from '@/components/sidebar/sidebar-right';
import { ModeToggle } from '@/components/theme/theme-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getRouteDisplayName } from '@/config/admin-routes';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCurrentRoute } from '@/hooks/useCurrentRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAdminCheck();
  const { pathname } = useCurrentRoute();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
        <p className="ml-4">Checking permissions...</p>
      </div>
    );
  }

  return (
    <ReactQueryClientProvider>
      <EventAgentProvider>
        <TooltipProvider>
          <SidebarProvider className="">
            <SidebarLeft />
            <SidebarInset className="overflow-x-hidden">
              <header className="sticky top-0 z-[60] w-full flex h-14 shrink-0 items-center gap-2 border-b bg-background">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <SidebarTrigger />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Toggle Sidebar (Ctrl+B)
                    </TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbPage className="line-clamp-1">
                          {getRouteDisplayName(pathname)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <Separator orientation="vertical" className="ml-2 h-4" />
                  <ModeToggle />
                </div>
              </header>
              <div className="flex-1 overflow-x-hidden">{children}</div>
            </SidebarInset>
            <SidebarRight />
          </SidebarProvider>
        </TooltipProvider>
      </EventAgentProvider>
    </ReactQueryClientProvider>
  );
}
