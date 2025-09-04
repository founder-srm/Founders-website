'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AlertCircle, ArrowUpRight, Link2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { getRecentRegistrations } from '@/actions/admin/registrations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';
import config from '@/lib/config';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';

function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton>
            <SidebarMenuSkeleton />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function NavFavorites() {
  const { isMobile } = useSidebar();
  const supabase = createClient();
  const {
    data: RecentRegistrations,
    error,
    isLoading,
  } = useQuery<Registration[]>(getRecentRegistrations(supabase));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Registrations</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <SidebarMenuItem>
            <SidebarMenuButton>
              <AlertCircle className="text-destructive" />
              <span>Error loading registrations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : RecentRegistrations?.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span className="text-muted-foreground">
                No recent registrations
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <>
            {RecentRegistrations?.map(registration => (
              <SidebarMenuItem key={registration.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/admin/registrations/view/${registration.id}`}>
                    <span className="text-nowrap">
                      {registration.event_title}:
                    </span>
                    <span>{registration.ticket_id}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${config.baseUrl}/admin/registrations/view/${registration.id}`
                        )
                      }
                    >
                      <Link2 className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `/admin/registrations/view/${registration.id}`,
                          '_blank'
                        )
                      }
                    >
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>Open in New Tab</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70" asChild>
                <Link href="/admin/registrations">
                  <MoreHorizontal />
                  <span>More</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
