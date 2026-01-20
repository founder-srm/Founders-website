'use client';

import { Check, ChevronsUpDown, Loader2, Users, X } from 'lucide-react';
import * as React from 'react';
import { type ClubMember, fetchClubMembers } from '@/actions/club/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface SelectedMember {
  user_id: string;
  email: string;
  full_name?: string;
}

interface MemberSearchSelectProps {
  clubId: string;
  value: SelectedMember[];
  onChange: (members: SelectedMember[]) => void;
  minMembers?: number;
  maxMembers?: number;
}

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function MemberSearchSelect({
  clubId,
  value = [],
  onChange,
  minMembers = 1,
  maxMembers,
}: MemberSearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch members on mount
  React.useEffect(() => {
    async function loadMembers() {
      if (!clubId) return;

      setIsLoading(true);
      const { data, error } = await fetchClubMembers(clubId);

      if (error || !data) {
        console.error('Error fetching members:', error);
        setIsLoading(false);
        return;
      }

      // Only show verified members
      const verifiedMembers = data.filter(m => m.is_verified);
      setMembers(verifiedMembers);
      setIsLoading(false);
    }

    loadMembers();
  }, [clubId]);

  const isSelected = (memberId: string) => {
    return value.some(v => v.user_id === memberId);
  };

  const handleSelect = (member: ClubMember) => {
    if (isSelected(member.user_id)) {
      // Remove member
      onChange(value.filter(v => v.user_id !== member.user_id));
    } else {
      // Check max limit
      if (maxMembers && value.length >= maxMembers) {
        return;
      }
      // Add member
      onChange([
        ...value,
        {
          user_id: member.user_id,
          email: member.email,
          full_name: member.user_metadata?.full_name,
        },
      ]);
    }
  };

  const handleRemove = (userId: string) => {
    onChange(value.filter(v => v.user_id !== userId));
  };

  const selectedCount = value.length;
  const hasMinimum = selectedCount >= minMembers;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Loading club members...
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border rounded-lg text-center">
        <Users className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No verified members found in your club.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Members Display */}
      {value.length > 0 && (
        <div className="space-y-2">
          {/** biome-ignore lint/a11y/noLabelWithoutControl: abstracted from form builder component */}
          <label className="text-sm font-medium">
            Selected Members ({selectedCount}
            {maxMembers ? `/${maxMembers}` : ''})
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30 min-h-[60px]">
            {value.map(member => (
              <Badge
                key={member.user_id}
                variant="secondary"
                className="flex items-center gap-1.5 py-1.5 px-3 pr-1.5"
              >
                <span className="max-w-[150px] truncate">
                  {member.full_name || member.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(member.user_id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Member Search Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11"
            type="button"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              Search and select members...
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search by name or email..." />
            <CommandList>
              <CommandEmpty>No members found.</CommandEmpty>
              <CommandGroup>
                {members.map(member => {
                  const selected = isSelected(member.user_id);
                  const disabled =
                    !selected &&
                    maxMembers !== undefined &&
                    value.length >= maxMembers;

                  return (
                    <CommandItem
                      key={member.user_id}
                      value={`${member.user_metadata?.full_name || ''} ${member.email}`}
                      onSelect={() => !disabled && handleSelect(member)}
                      className={cn(
                        'flex items-center gap-3 py-3 cursor-pointer',
                        disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border shrink-0',
                          selected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={member.user_metadata?.avatar_url}
                          alt={member.user_metadata?.full_name || member.email}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user_metadata?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {member.user_metadata?.full_name || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </span>
                      </div>
                      {member.user_role === 'club_rep' && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shrink-0"
                        >
                          Rep
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Validation Message */}
      {!hasMinimum && (
        <p className="text-sm text-amber-600 dark:text-amber-500">
          Please select at least {minMembers} member{minMembers > 1 ? 's' : ''}{' '}
          to continue.
        </p>
      )}
    </div>
  );
}
