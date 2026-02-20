import type { ReactNode } from "react";

import type { AppNav } from "@/lib/ctf/types";
import { AppHeader } from "@/components/site/app-header";

export function PageShell({ nav, children }: { nav: AppNav; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <AppHeader nav={nav} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
