'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Archive,
  Blocks,
  Calendar,
  FilePlus2,
  Home,
  MessageCircleQuestion,
  Search,
  Settings2,
  Trash2,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from './team-switcher';
import { NavMain } from './nav-main';
import { NavFavorites } from './nav-favorites';
import { NavWorkspaces } from './nav-workspaces';
import { NavSecondary } from './nav-secondary';
import { CommandBox } from '@/components/command/command-box';

const data = {
  navMain: [
    {
      title: 'Search',
      url: '#',
      icon: Search,
      onClick: (setCommandOpen: (open: boolean) => void) => {
        setCommandOpen(true);
        return false; // Prevent default navigation
      },
    },
    {
      title: 'Home',
      url: '/admin',
      icon: Home,
    },
    {
      title: 'All Registrations',
      url: '/admin/registrations',
      icon: Archive,
    },
    {
      title: 'New Event',
      url: '/admin/events/create/new-event',
      icon: FilePlus2,
    },
  ],
  navSecondary: [
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Templates',
      url: '#',
      icon: Blocks,
    },
    {
      title: 'Trash',
      url: '#',
      icon: Trash2,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
          <NavMain
            items={data.navMain}
            onSearchClick={() => setCommandOpen(true)}
          />
        </SidebarHeader>
        <SidebarContent className=" overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
          <NavFavorites />
          <NavWorkspaces />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <CommandBox open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
}
