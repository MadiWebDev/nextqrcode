'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const safeTheme = theme ?? 'system';
  const cycle = () => {
    if (safeTheme === 'light') setTheme('dark');
    else if (safeTheme === 'dark') setTheme('system');
    else setTheme('light');
  };
  const Icon = safeTheme === 'light' ? Sun : safeTheme === 'dark' ? Moon : Monitor;
  const label = safeTheme === 'light' ? 'Switch to dark mode' : safeTheme === 'dark' ? 'Switch to system theme' : 'Switch to light mode';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={cycle} aria-label={label}>
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
