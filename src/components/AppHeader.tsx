import Link from 'next/link';
import { QrCode, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <QrCode className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight">QR Studio</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Free QR Code Generator</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1 mr-2">
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">Blog</Link>
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">About</Link>
          </nav>
          <ThemeToggle />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="About QR Studio">
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Generate custom QR codes for 40+ types — WiFi, vCard, Bitcoin, UPI and more. All processing happens in your browser.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
