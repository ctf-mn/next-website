import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { MobileNavDrawer } from "@/components/site/mobile-nav-drawer";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/site/theme-switcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

describe("MobileNavDrawer", () => {
  it("closes when clicking the overlay", () => {
    render(
      <MobileNavDrawer
        coreLinks={[
          { href: "/challenge/list", label: "Challenges" },
          { href: "/scoreboard", label: "Scoreboard" },
        ]}
        authLinks={[
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ]}
        isAuthenticated={false}
        currentUser={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close menu overlay" }));
    expect(screen.queryByRole("dialog", { name: "Menu" })).toBeNull();
  });

  it("closes when pressing Escape", () => {
    render(
      <MobileNavDrawer
        coreLinks={[{ href: "/challenge/list", label: "Challenges" }]}
        authLinks={[{ href: "/login", label: "Login" }]}
        isAuthenticated={false}
        currentUser={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Menu" })).toBeNull();
  });
});
