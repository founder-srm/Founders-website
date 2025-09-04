'use client';

import {
  Archive,
  ArrowLeft,
  Blocks,
  FilePlus2,
  FileSearch,
  Home,
  Loader2,
  MessageCircleQuestion,
  Rss,
  Settings2,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { createClient } from '@/utils/supabase/client';
import type { Json } from '../../../database.types';
import { RegistrationTable } from './registration-table';

interface CommandBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type RegistrationSearchResult = {
  id: string;
  created_at: string;
  ticket_id: number; // Changed from string to number
  event_id: string;
  event_title: string;
  application_id: string;
  details: Json;
  attendance: 'Present' | 'Absent'; // Updated to match the enum
  registration_email: string;
  is_approved: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'INVALID'; // Updated to match the enum
};

export function CommandBox({ open, setOpen }: CommandBoxProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMode, setSearchMode] = React.useState<
    'command' | 'registration'
  >('command');
  const [searchResults, setSearchResults] = React.useState<
    RegistrationSearchResult[]
  >([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Create supabase client
  const supabase = createClient();

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Open command dialog with Ctrl/Cmd+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
        setSearchMode('command');
      }

      // Switch to registration search mode with Tab
      if (open && e.key === 'Tab' && !e.shiftKey && searchMode === 'command') {
        e.preventDefault();
        setSearchMode('registration');
      }

      // Switch back to command mode with Shift+Tab
      if (
        open &&
        e.key === 'Tab' &&
        e.shiftKey &&
        searchMode === 'registration'
      ) {
        e.preventDefault();
        setSearchMode('command');
      }

      // Also switch back to command mode with Escape
      if (open && e.key === 'Escape' && searchMode === 'registration') {
        e.preventDefault();
        setSearchMode('command');
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, searchMode, setOpen]);

  // Handle search query changes
  useEffect(() => {
    // Reset search results when switching modes
    if (searchMode === 'command') {
      setSearchResults([]);
    }
  }, [searchMode]);

  // Perform registration search
  const performRegistrationSearch = useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase.rpc(
          'extended_search_registrations',
          {
            search_query: query,
          }
        );

        if (error) {
          console.error('Search error:', error.message);
          return;
        }

        // Type assertion to ensure compatibility
        setSearchResults((data as RegistrationSearchResult[]) || []);
      } catch (err) {
        console.error('Exception during search:', err);
      } finally {
        setIsSearching(false);
      }
    },
    [supabase]
  );

  // Debounce search for registration mode
  useEffect(() => {
    if (searchMode === 'registration') {
      const timer = setTimeout(() => {
        performRegistrationSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, searchMode, performRegistrationSearch]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      setSearchMode('command');
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (!isOpen) {
          // Reset state when closing dialog
          setSearchMode('command');
          setSearchQuery('');
          setSearchResults([]);
        }
      }}
    >
      <VisuallyHidden>
        <DialogTitle>Command Menu</DialogTitle>
      </VisuallyHidden>
      <CommandInput
        placeholder={
          searchMode === 'command'
            ? 'Type a command or search... (Tab for registration search)'
            : 'Search registrations by email, title or details...'
        }
        value={searchQuery}
        onValueChange={setSearchQuery}
        autoFocus
      />
      <CommandList>
        {searchMode === 'command' ? (
          /* Command mode */
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem
                onSelect={() => runCommand(() => router.push('/admin'))}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push('/admin/registrations'))
                }
              >
                <Archive className="mr-2 h-4 w-4" />
                <span>All Registrations</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() =>
                    router.push('/admin/events/create/new-event')
                  )
                }
              >
                <FilePlus2 className="mr-2 h-4 w-4" />
                <span>New Event</span>
              </CommandItem>
              <CommandItem onSelect={() => setSearchMode('registration')}>
                <FileSearch className="mr-2 h-4 w-4" />
                <span>Search Registrations</span>
                <CommandShortcut>Tab</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem
                onSelect={() => runCommand(() => router.push('/admin/devblog'))}
              >
                <Rss className="mr-2 h-4 w-4" />
                <span>DevBlog</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => console.log('Settings'))}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => console.log('Templates'))}
              >
                <Blocks className="mr-2 h-4 w-4" />
                <span>Templates</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => console.log('Trash'))}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Trash</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => console.log('Help'))}
              >
                <MessageCircleQuestion className="mr-2 h-4 w-4" />
                <span>Help</span>
              </CommandItem>
            </CommandGroup>
          </>
        ) : (
          /* Registration search mode */
          <>
            <CommandItem
              onSelect={() => setSearchMode('command')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Commands</span>
              <CommandShortcut>Shift+Tab</CommandShortcut>
            </CommandItem>
            <CommandSeparator />
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchQuery.length < 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            ) : searchResults.length === 0 ? (
              <CommandEmpty>No registrations found.</CommandEmpty>
            ) : (
              <div className="px-1 py-2 overflow-y-auto max-h-[400px]">
                <RegistrationTable data={searchResults} />
              </div>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
