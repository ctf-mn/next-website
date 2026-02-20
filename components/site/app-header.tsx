import Link from "next/link";

import type { AppNav } from "@/lib/ctf/types";

export function AppHeader({ nav }: { nav: AppNav }) {
  const coreLinks = nav.links.filter((entry) => ["/challenge/list", "/scoreboard", "/activity"].includes(entry.href));
  const authLinks = nav.links.filter((entry) => ["/login", "/register"].includes(entry.href));

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          CTF.mn
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {coreLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-slate-700 hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          {authLinks.length > 0 ? <span className="text-slate-400">|</span> : null}
          {authLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-slate-700 hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          {nav.isAuthenticated ? (
            <form action="/logout" method="post">
              <button type="submit" className="font-medium text-slate-700 hover:text-slate-900">
                Logout
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
