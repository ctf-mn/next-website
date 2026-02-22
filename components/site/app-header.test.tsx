import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/site/app-header";
import type { AppNav } from "@ctf-mn/api/types";

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

function makeNav(overrides: Partial<AppNav> = {}): AppNav {
  return {
    isAuthenticated: false,
    currentUser: null,
    links: [
      { href: "/challenge/list", label: "Challenges" },
      { href: "/scoreboard", label: "Scoreboard" },
      { href: "/activity", label: "Activity" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
    ...overrides,
  };
}

describe("AppHeader", () => {
  it("shows signed-in username link when authenticated", () => {
    render(
      <AppHeader
        nav={makeNav({
          isAuthenticated: true,
          currentUser: { name: "alice", href: "/user/alice" },
          links: [
            { href: "/challenge/list", label: "Challenges" },
            { href: "/scoreboard", label: "Scoreboard" },
            { href: "/activity", label: "Activity" },
            { href: "/user/alice", label: "alice" },
          ],
        })}
      />,
    );

    const userLink = screen.getByRole("link", { name: "alice" });
    expect(userLink.getAttribute("href")).toBe("/user/alice");
    expect(screen.getByRole("button", { name: "Logout" })).toBeTruthy();
  });

  it("does not show username when unauthenticated", () => {
    render(<AppHeader nav={makeNav()} />);

    expect(screen.queryByRole("link", { name: "alice" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Logout" })).toBeNull();
  });

  it("opens mobile menu with all nav actions", () => {
    render(<AppHeader nav={makeNav()} />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const menu = screen.getByRole("dialog", { name: "Menu" });
    expect(menu).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Challenges" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Scoreboard" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Activity" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Login" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Register" })).toBeTruthy();
  });

  it("shows profile and logout inside mobile menu for authenticated users", () => {
    render(
      <AppHeader
        nav={makeNav({
          isAuthenticated: true,
          currentUser: { name: "alice", href: "/user/alice" },
          links: [
            { href: "/challenge/list", label: "Challenges" },
            { href: "/scoreboard", label: "Scoreboard" },
            { href: "/activity", label: "Activity" },
            { href: "/user/alice", label: "alice" },
          ],
        })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("dialog", { name: "Menu" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "alice" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: "Logout" }).length).toBeGreaterThanOrEqual(1);
  });
});
