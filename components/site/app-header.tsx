import Link from "next/link";

import { ThemeSwitcher } from "@/components/site/theme-switcher";
import type { AppNav } from "@/lib/ctf/types";

export function AppHeader({ nav }: { nav: AppNav }) {
  const coreLinks = nav.links.filter((entry) => ["/challenge/list", "/scoreboard", "/activity"].includes(entry.href));
  const authLinks = nav.links.filter((entry) => ["/login", "/register"].includes(entry.href));

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          CTF.mn
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {coreLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {authLinks.length > 0 ? <span className="text-muted-foreground">|</span> : null}
          {authLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {nav.isAuthenticated ? (
            <form action="/logout" method="post">
              <button type="submit" className="font-medium text-muted-foreground hover:text-foreground">
                Logout
              </button>
            </form>
          ) : null}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
