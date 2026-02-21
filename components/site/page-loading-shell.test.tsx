import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { PageLoadingShell } from "@/components/site/page-loading-shell";

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

describe("PageLoadingShell", () => {
  it("renders mobile sidebar menu during loading state", () => {
    render(
      <PageLoadingShell>
        <div>Loading content</div>
      </PageLoadingShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const menu = screen.getByRole("dialog", { name: "Menu" });
    expect(menu).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Challenges" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Scoreboard" })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: "Activity" })).toBeTruthy();
  });
});
