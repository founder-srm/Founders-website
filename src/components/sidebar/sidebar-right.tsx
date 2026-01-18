'use client';

import { usePathname } from 'next/navigation';
import type * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useUser } from '@/stores/session';
import { AgentChat } from './agent-chat';
import { NavUser } from './nav-user';

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const pathname = usePathname();
  
  // Check if we're on the new event page
  const isNewEventPage = pathname?.includes('/admin/events/create/new-event');

  if (!user) return null;
  
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser {...user} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        {isNewEventPage ? (
          <AgentChat />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
            <p className="text-sm">Select a page to see contextual actions</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
