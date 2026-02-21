"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

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

      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[9999]">
              <button
                type="button"
                aria-label="Close menu overlay"
                className="absolute inset-0 z-[9999] bg-background/70 backdrop-blur-sm"
                onClick={closeMenu}
              />
              <section
                id="mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="fixed inset-y-0 right-0 z-[10000] flex h-dvh w-72 max-w-[85vw] flex-col gap-5 border-l border-border bg-card p-4 shadow-xl transition-transform duration-200 motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between">
                  <h2 id={titleId} className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Menu
                  </h2>
                  <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0" aria-label="Close menu" onClick={closeMenu}>
                    <X className="h-4 w-4" aria-hidden />
                  </Button>
                </div>

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
              </section>
            </div>
            ,
            document.body,
          )
        : null}
    </div>
  );
}
