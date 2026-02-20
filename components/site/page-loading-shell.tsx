import type { ReactNode } from "react";

export function PageLoadingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-semibold tracking-tight">CTF.mn</div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-16 rounded skeleton" />
            <div className="h-4 w-16 rounded skeleton" />
            <div className="h-4 w-16 rounded skeleton" />
            <div className="h-8 w-8 rounded-full skeleton" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
