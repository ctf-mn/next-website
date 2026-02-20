import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import ScoreboardPage from "./page";
import { getScoreboard } from "@/lib/ctf/service";
import type { ScoreboardPage as ScoreboardData } from "@/lib/ctf/types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/site/page-shell", () => ({
  PageShell: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/lib/ctf/service", () => ({
  getScoreboard: vi.fn(),
}));

const baseData: ScoreboardData = {
  title: "Scoreboard",
  nav: {
    isAuthenticated: true,
    currentUser: { name: "alice", href: "/user/alice" },
    links: [
      { href: "/challenge/list", label: "Challenges" },
      { href: "/scoreboard", label: "Scoreboard" },
      { href: "/activity", label: "Activity" },
      { href: "/user/alice", label: "alice" },
    ],
  },
  rows: [{ rank: 1, user: "alice", userHref: "/user/alice", solved: 10, score: 1000 }],
  pages: [],
};

describe("Scoreboard pagination", () => {
  it("derives active page from query when upstream current marker is missing", async () => {
    vi.mocked(getScoreboard).mockResolvedValue({
      ...baseData,
      pages: [
        { page: 1, href: "/scoreboard?page=1", current: false },
        { page: 2, href: "/scoreboard?page=2", current: false },
        { page: 3, href: "/scoreboard?page=3", current: false },
      ],
    });

    const page = await ScoreboardPage({ searchParams: Promise.resolve({ page: "2" }) });
    render(page);

    const activeLink = screen.getByRole("link", { name: "2" });
    expect(activeLink.getAttribute("aria-current")).toBe("page");
  });

  it("marks the active page with aria-current and active styles", async () => {
    vi.mocked(getScoreboard).mockResolvedValue({
      ...baseData,
      pages: [
        { page: 1, href: "/scoreboard?page=1", current: false },
        { page: 2, href: "/scoreboard?page=2", current: true },
        { page: 3, href: "/scoreboard?page=3", current: false },
      ],
    });

    const page = await ScoreboardPage({ searchParams: Promise.resolve({ page: "2" }) });
    render(page);

    const activeLink = screen.getByRole("link", { name: "2" });
    expect(activeLink.getAttribute("aria-current")).toBe("page");
    expect(activeLink.querySelector("div")?.className).toContain("ring-2");
    expect(activeLink.querySelector("div")?.className).toContain("font-bold");

    const inactiveLink = screen.getByRole("link", { name: "1" });
    expect(inactiveLink.getAttribute("aria-current")).toBeNull();
  });

  it("renders ellipsis between non-consecutive pages", async () => {
    vi.mocked(getScoreboard).mockResolvedValue({
      ...baseData,
      pages: [
        { page: 1, href: "/scoreboard?page=1", current: false },
        { page: 4, href: "/scoreboard?page=4", current: false },
        { page: 5, href: "/scoreboard?page=5", current: true },
        { page: 10, href: "/scoreboard?page=10", current: false },
      ],
    });

    const page = await ScoreboardPage({ searchParams: Promise.resolve({ page: "5" }) });
    render(page);

    expect(screen.getAllByText("...")).toHaveLength(2);
  });
});
