import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChallengeListFilters } from "@/components/challenge/challenge-list-filters";
import type { ChallengeListApiResponse } from "@/lib/ctf/types";

const replaceMock = vi.fn();
const routerMock = { replace: replaceMock };

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => "/challenge/list",
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const initialData: ChallengeListApiResponse = {
  categories: [
    { value: "all", label: "All", selected: true },
    { value: "web", label: "Web", selected: false },
  ],
  events: [
    { value: "all", label: "All", selected: true },
    { value: "main", label: "Main", selected: false },
  ],
  statuses: [
    { value: "all", label: "All", selected: true },
    { value: "solved", label: "Solved", selected: false },
  ],
  items: [
    {
      rank: 1,
      href: "/challenge/1",
      title: "Warmup",
      category: "misc",
      author: "alice",
      authorHref: "/author/alice",
      solved: 10,
      score: 100,
      isSolved: true,
    },
    {
      rank: 2,
      href: "/challenge/2",
      title: "Crypto 101",
      category: "crypto",
      author: "bob",
      authorHref: "/author/bob",
      solved: 5,
      score: 200,
      isSolved: false,
    },
  ],
};

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("ChallengeListFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replaceMock.mockReset();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("debounces filter changes for 300ms and syncs URL", async () => {
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetchMock);

    renderWithQuery(
      <ChallengeListFilters
        initialData={initialData}
        initialFilters={{ category: "all", event: "all", status: "all" }}
      />,
    );

    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "web" } });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/challenge/list?category=web", expect.any(Object));
    expect(replaceMock).toHaveBeenCalledWith("/challenge/list?category=web", { scroll: false });
  });

  it("clears URL params when filters return to all and skips fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderWithQuery(
      <ChallengeListFilters
        initialData={initialData}
        initialFilters={{ category: "all", event: "all", status: "all" }}
      />,
    );

    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "web" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "all" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replaceMock).toHaveBeenCalledWith("/challenge/list", { scroll: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a solved indicator only for solved challenges", () => {
    renderWithQuery(
      <ChallengeListFilters
        initialData={initialData}
        initialFilters={{ category: "all", event: "all", status: "all" }}
      />,
    );

    const warmupRow = screen.getByRole("link", { name: "Warmup" }).closest("tr");
    const cryptoRow = screen.getByRole("link", { name: "Crypto 101" }).closest("tr");

    expect(warmupRow).toBeTruthy();
    expect(cryptoRow).toBeTruthy();
    expect(warmupRow?.textContent).toContain("Solved");
    expect(cryptoRow?.textContent).not.toContain("Solved");
  });
});
