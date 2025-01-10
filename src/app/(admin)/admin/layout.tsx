'use client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarLeft } from '@/components/sidebar/sidebar-left';
import { SidebarRight } from '@/components/sidebar/sidebar-right';
import { ModeToggle } from '@/components/theme/theme-toggle';
import { ReactQueryClientProvider } from '@/components/providers/QueryClientProvider';

export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const { isLoading } = useAdminCheck();

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
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <header className="sticky top-0 z-[1000] flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      Project Management & Task Tracking
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Separator orientation="vertical" className="ml-2 h-4" />
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
        <SidebarRight />
      </SidebarProvider>
    </ReactQueryClientProvider>
  );
}
