import { describe, expect, it } from "vitest";

import { withEllipsis } from "@/lib/ctf/pagination";

describe("withEllipsis", () => {
  it("returns pages unchanged when there are no gaps", () => {
    const items = withEllipsis([
      { page: 1, href: "/scoreboard?page=1", current: false },
      { page: 2, href: "/scoreboard?page=2", current: true },
      { page: 3, href: "/scoreboard?page=3", current: false },
    ]);

    expect(items).toEqual([
      { type: "page", value: { page: 1, href: "/scoreboard?page=1", current: false } },
      { type: "page", value: { page: 2, href: "/scoreboard?page=2", current: true } },
      { type: "page", value: { page: 3, href: "/scoreboard?page=3", current: false } },
    ]);
  });

  it("inserts an ellipsis token when there is a gap", () => {
    const items = withEllipsis([
      { page: 1, href: "/scoreboard?page=1", current: false },
      { page: 3, href: "/scoreboard?page=3", current: false },
      { page: 4, href: "/scoreboard?page=4", current: true },
      { page: 10, href: "/scoreboard?page=10", current: false },
    ]);

    expect(items).toEqual([
      { type: "page", value: { page: 1, href: "/scoreboard?page=1", current: false } },
      { type: "ellipsis", key: "ellipsis-1-3" },
      { type: "page", value: { page: 3, href: "/scoreboard?page=3", current: false } },
      { type: "page", value: { page: 4, href: "/scoreboard?page=4", current: true } },
      { type: "ellipsis", key: "ellipsis-4-10" },
      { type: "page", value: { page: 10, href: "/scoreboard?page=10", current: false } },
    ]);
  });
});
