'use client';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function subscribe(cb: () => void) {
  // No external store to subscribe to; mounting is a one-time event.
  return () => {};
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true, // client snapshot: always mounted
    () => false // server snapshot: never mounted
  );
  const { theme, setTheme } = useTheme();

  const safeTheme = theme ?? 'system';
  const cycle = () => {
    if (safeTheme === 'light') setTheme('dark');
    else if (safeTheme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Monitor className="w-4 h-4" />
      </Button>
    );
  }

  const Icon = safeTheme === 'light' ? Sun : safeTheme === 'dark' ? Moon : Monitor;
  const label =
    safeTheme === 'light'
      ? 'Switch to dark mode'
      : safeTheme === 'dark'
        ? 'Switch to system theme'
        : 'Switch to light mode';
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
