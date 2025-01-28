import { AlertCircle, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { Event } from '@/types/events';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { getRecentEvents } from '@/actions/admin/events';
import { Badge } from '../ui/badge';

function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton>
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function NavWorkspaces() {
  const supabase = createClient();
  const {
    data: RecentEvents,
    error,
    isLoading,
  } = useQuery<Event[]>(getRecentEvents(supabase));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <SidebarMenuItem>
              <SidebarMenuButton>
                <AlertCircle className="text-destructive" />
                <span>Error loading events</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : RecentEvents?.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton>
                <span className="text-muted-foreground">No events found</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <>
              {RecentEvents?.map(event => (
                <Collapsible key={event.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/admin/events/view/${event.slug}`}>
                        <span>{event.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                        showOnHover
                      >
                        <ChevronRight />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <SidebarMenuAction asChild showOnHover>
                      <Link href="/admin/events/create/new-event">
                        <Plus />
                      </Link>
                    </SidebarMenuAction>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span>
                              {formatInTimeZone(
                                new Date(event.start_date),
                                'Asia/Kolkata',
                                'dd MMMM yyyy, hh:mm a zzz'
                              )}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <div className="flex flex-nowrap gap-1">
                              {event.tags?.map((tag, index) => (
                                <Badge key={index} variant="default">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-sidebar-foreground/70"
                  asChild
                >
                  <Link href="/admin/events">
                    <MoreHorizontal />
                    <span>More</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
