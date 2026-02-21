import Link from "next/link";
import type { ReactNode } from "react";

import { MobileLoadingNavDrawer } from "@/components/site/mobile-loading-nav-drawer";
import { Skeleton } from "@/components/site/page-skeletons";
import { ThemeSwitcher } from "@/components/site/theme-switcher";

export function PageLoadingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CTF.mn
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm md:flex">
              <Link href="/challenge/list" className="font-medium text-muted-foreground hover:text-foreground">
                Challenges
              </Link>
              <Link href="/scoreboard" className="font-medium text-muted-foreground hover:text-foreground">
                Scoreboard
              </Link>
              <Link href="/activity" className="font-medium text-muted-foreground hover:text-foreground">
                Activity
              </Link>
              <span className="text-muted-foreground">|</span>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
              <ThemeSwitcher />
            </nav>
            <MobileLoadingNavDrawer />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
