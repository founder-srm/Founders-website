'use client';

import { Moon, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const handleLightTheme = (): void => {
    toast({
      title: 'Seriously? Light theme? 🤮',
      description: 'Have the Fun theme instead! 🎉',
    });
    setTheme('fun');
  };

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sparkles className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[1000]">
        <DropdownMenuItem onClick={() => setTheme('fun')}>Fun</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('purple')}>Purple</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLightTheme}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
