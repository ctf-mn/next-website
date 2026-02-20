import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/site/app-header";
import type { AppNav } from "@/lib/ctf/types";

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
});
