import React from 'react';
import { Link } from 'wouter';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function Nav() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-background/80 border-b border-border">
      <Link href="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
        RAVEN
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <button onClick={() => {
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Packages
          </button>
          <a href="mailto:hello@ravendigital.com" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle theme"
          data-testid="button-toggle-theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
