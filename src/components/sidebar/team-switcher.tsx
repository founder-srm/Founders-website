'use client';

import * as React from 'react';
import { ChevronDown, Shield, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUser } from '@/stores/session';
import { createClient, debugSupabaseKey } from '@/utils/supabase/elevatedClient';
import { UserInviteDialog } from './user-invite-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function TeamSwitcher() {
  const user = useUser();
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  
  // Create client once when component mounts
  const supabase = React.useMemo(() => {
    const client = createClient();
    console.log("Supabase client created with key info:", debugSupabaseKey());
    return client;
  }, []);

  // Fetch current user's moderation level
  const { data: moderationData, isLoading } = useQuery({
    queryKey: ['moderationLevel', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      try {
        console.log("Fetching moderation data for:", user.email);
        const { data, error } = await supabase
          .from('adminuseraccount')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (error) {
          console.error('Error fetching moderation level:', error);
          return null;
        }
        
        console.log("Moderation data retrieved:", data);
        return data;
      } catch (error) {
        console.error('Error in moderation level query:', error);
        return null;
      }
    },
    enabled: !!user?.email,
  });

  const handleEscalationRequest = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Role escalation request will be available in a future update.",
      variant: "default"
    });
  };

  // Add debug info to check client initialization
  React.useEffect(() => {
    console.log("TeamSwitcher mounted, user:", user?.email);
  }, [user?.email]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Shield className="size-3" />
              </div>
              <span className="truncate font-semibold">
                {isLoading ? 'Loading...' : 'Moderation'}
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Moderation Settings
            </DropdownMenuLabel>
            
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-2">
              <div className="text-sm font-medium">Current Role</div>
              <Badge variant="outline" className="font-normal">
                {moderationData?.user_role || 'No Role Assigned'}
              </Badge>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={handleEscalationRequest}
            >
              <Shield className="size-4" />
              <div className="font-medium">Request Role Escalation</div>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <UserPlus className="size-4" />
              <div className="font-medium">Invite Moderators</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      
      <UserInviteDialog 
        open={isInviteDialogOpen} 
        onOpenChange={setIsInviteDialogOpen}
        currentUserRole={moderationData?.user_role}
      />
    </SidebarMenu>
  );
}
