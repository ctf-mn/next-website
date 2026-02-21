"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { MobileDrawerShell } from "@/components/site/mobile-drawer-shell";
import { Skeleton } from "@/components/site/page-skeletons";
import { ThemeSwitcher } from "@/components/site/theme-switcher";
import { Button } from "@/components/ui/button";

const coreLinks = [
  { href: "/challenge/list", label: "Challenges" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/activity", label: "Activity" },
];

export function MobileLoadingNavDrawer() {
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
        aria-controls="mobile-loading-nav-drawer"
        className="h-9 w-9 p-0"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="h-4 w-4" aria-hidden />
      </Button>

      <MobileDrawerShell id="mobile-loading-nav-drawer" title="Menu" open={open} onOpenChange={setOpen}>
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <ThemeSwitcher />
        </div>
      </MobileDrawerShell>
    </div>
  );
}
