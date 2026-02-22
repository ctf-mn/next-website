import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChallengeDetailPage from "./page";
import { readFlash } from "@ctf-mn/api/flash";
import { getChallenge } from "@ctf-mn/api/service";
import type { ChallengeDetailPage as ChallengeDetailData } from "@ctf-mn/api/types";

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

vi.mock("@/components/site/flash-alert", () => ({
  FlashAlert: () => null,
}));

vi.mock("@/components/challenge/challenge-markdown", () => ({
  ChallengeMarkdown: ({ markdown }: { markdown: string }) => <div>{markdown}</div>,
}));

vi.mock("@ctf-mn/api/service", () => ({
  getChallenge: vi.fn(),
}));

vi.mock("@ctf-mn/api/flash", () => ({
  readFlash: vi.fn(),
}));

const baseChallenge: ChallengeDetailData = {
  title: "Warmup",
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
  id: 1,
  challengeTitle: "Warmup",
  category: "misc",
  categoryHref: "/challenge/list?category=misc",
  event: "main",
  eventHref: "/challenge/list?event=main",
  author: "alice",
  authorHref: "/author/alice",
  solved: 10,
  score: 100,
  markdown: "description",
  solvedUsers: [],
  csrfToken: "csrf-token",
  loginRequired: false,
  alreadySolved: false,
};

describe("ChallengeDetailPage solved indicator", () => {
  beforeEach(() => {
    vi.mocked(readFlash).mockResolvedValue(null);
  });

  it("shows an explicit solved message when challenge is already solved", async () => {
    vi.mocked(getChallenge).mockResolvedValue({
      ...baseChallenge,
      alreadySolved: true,
    });

    const page = await ChallengeDetailPage({ params: Promise.resolve({ id: "1" }) });
    render(page);

    const solvedMessage = screen.getByText("Congratulations! You already solved this challenge.");
    expect(solvedMessage).toBeTruthy();
    expect(screen.queryByPlaceholderText("Flag")).toBeNull();
    expect(screen.queryByRole("button", { name: "Submit Flag" })).toBeNull();
  });

  it("does not show solved message for unsolved challenge", async () => {
    vi.mocked(getChallenge).mockResolvedValue({
      ...baseChallenge,
      alreadySolved: false,
    });

    const page = await ChallengeDetailPage({ params: Promise.resolve({ id: "1" }) });
    render(page);

    const solvedMessage = screen.queryByText("Congratulations! You already solved this challenge.");
    expect(solvedMessage).toBeNull();
    expect(screen.getByPlaceholderText("Flag")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit Flag" })).toBeTruthy();
  });
});
