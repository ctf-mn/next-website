"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { MobileDrawerShell } from "@/components/site/mobile-drawer-shell";
import { ThemeSwitcher } from "@/components/site/theme-switcher";
import { Button } from "@/components/ui/button";

type NavLink = { href: string; label: string };

export function MobileNavDrawer({
  coreLinks,
  authLinks,
  isAuthenticated,
  currentUser,
}: {
  coreLinks: NavLink[];
  authLinks: NavLink[];
  isAuthenticated: boolean;
  currentUser: { name: string; href: string } | null;
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="h-9 w-9 p-0"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="h-4 w-4" aria-hidden />
      </Button>

      <MobileDrawerShell id="mobile-nav-drawer" title="Menu" open={open} onOpenChange={setOpen}>
        <nav className="flex flex-col gap-2 text-sm">
          {coreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2 font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4">
          <div className="flex flex-col gap-2 text-sm">
            {isAuthenticated && currentUser ? (
              <Link
                href={currentUser.href}
                className="rounded-md px-2 py-2 font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={closeMenu}
              >
                {currentUser.name}
              </Link>
            ) : null}

            {isAuthenticated ? (
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="w-full rounded-md px-2 py-2 text-left font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                >
                  Logout
                </button>
              </form>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-2 font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <ThemeSwitcher />
        </div>
      </MobileDrawerShell>
    </div>
  );
}
