'use client';

import type { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  createClient,
  debugSupabaseKey,
} from '@/utils/supabase/elevatedClient';
import type { Database } from '../../../database.types';
import { columns, type UserData } from './user-table/columns';
import { DataTable } from './user-table/data-table';

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole?: string;
}

export function UserInviteDialog({
  open,
  onOpenChange,
  currentUserRole,
}: UserInviteDialogProps) {
  // Create client once when component mounts
  const supabase = useMemo(() => {
    const client = createClient();
    console.log(
      'UserInviteDialog: Supabase client created with key info:',
      debugSupabaseKey()
    );
    return client;
  }, []);

  // Fix: Corrected the type - removed quotes from the enum type
  const [selectedRole, setSelectedRole] = useState<
    Database['public']['Enums']['user-role'] | undefined
  >('user');
  const { toast } = useToast();
  // Track selected users
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>(
    {}
  );

  // Get list of users from Supabase Auth
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', open], // Add open to dependencies
    queryFn: async () => {
      if (!open) return [];

      console.log('UserInviteDialog: Attempting to list users with client');
      try {
        const { data, error } = await supabase.auth.admin.listUsers();

        if (error) {
          console.error('Error fetching users:', error);
          toast({
            title: 'Error',
            description: `Failed to fetch users: ${error.message}`,
            variant: 'destructive',
          });
          return [];
        }

        console.log(
          `UserInviteDialog: Successfully fetched ${data.users.length} users`
        );
        return data.users.map((user: User) => ({
          id: user.id,
          email: user.email || 'No email',
        }));
      } catch (error: unknown) {
        console.error('Exception fetching users:', error);
        toast({
          title: 'Error',
          description: `Exception: ${(error as Error)?.message || 'Unknown error'}`,
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: open,
    staleTime: 30000, // Cache for 30 seconds
  });

  const handleInviteUsers = async () => {
    try {
      console.log('UserInviteDialog: Handling invite users');
      // Get selected users from the selectedUsers state
      const selectedIds = Object.keys(selectedUsers).filter(
        id => selectedUsers[id]
      );
      const userEmails = users
        .filter(user => selectedIds.includes(user.id))
        .map(user => user.email);

      if (userEmails.length === 0) {
        toast({
          title: 'No users selected',
          description: 'Please select at least one user to invite',
          variant: 'destructive',
        });
        return;
      }

      // If current user doesn't have role or trying to assign higher role
      const roleHierarchy = ['user', 'moderator', 'admin', 'owner'];
      const currentUserRoleIndex = currentUserRole
        ? roleHierarchy.indexOf(currentUserRole)
        : -1;
      const selectedRoleIndex = roleHierarchy.indexOf(selectedRole ?? 'user');

      if (
        currentUserRoleIndex === -1 ||
        selectedRoleIndex > currentUserRoleIndex
      ) {
        toast({
          title: 'Permission Denied',
          description: `You cannot assign a role higher than your own (${currentUserRole})`,
          variant: 'destructive',
        });
        return;
      }

      console.log(
        `UserInviteDialog: Inviting ${userEmails.length} users with role ${selectedRole}`
      );

      // Add users to adminuseraccount table with the selected role
      const promises = userEmails.map(async email => {
        console.log(
          `UserInviteDialog: Adding user ${email} with role ${selectedRole}`
        );
        const { error } = await supabase.from('adminuseraccount').upsert({
          email,
          user_role: selectedRole,
          user_id: users.find(u => u.email === email)?.id || '',
        });

        if (error) {
          console.error(`Error adding user ${email}:`, error);
          throw error;
        }
      });

      await Promise.all(promises);

      toast({
        title: 'Success',
        description: `${userEmails.length} user(s) have been granted ${selectedRole} privileges`,
        variant: 'default',
      });

      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Error inviting users:', error);
      toast({
        title: 'Error',
        description: `Failed to invite users: ${(error as Error)?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[800px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Moderators</DialogTitle>
          <DialogDescription>
            Select users to grant moderation privileges. You can only assign
            roles up to your current role level.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center mb-4 gap-2 justify-end">
          <div className="text-sm text-muted-foreground">
            Roles available for {currentUserRole}
          </div>
          <Select
            value={selectedRole}
            onValueChange={(value: string) =>
              setSelectedRole(value as Database['public']['Enums']['user-role'])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="user">User</SelectItem>
                {(currentUserRole === 'moderator' ||
                  currentUserRole === 'admin' ||
                  currentUserRole === 'owner') && (
                  <SelectItem value="moderator">Moderator</SelectItem>
                )}
                {(currentUserRole === 'admin' ||
                  currentUserRole === 'owner') && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
                {currentUserRole === 'owner' && (
                  <SelectItem value="owner">Owner</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users as UserData[]}
            onRowSelectionChange={setSelectedUsers}
            rowSelection={selectedUsers}
          />
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInviteUsers}>Invite Selected Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
