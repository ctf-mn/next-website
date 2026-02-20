import { describe, expect, it } from "vitest";

import { parseNav } from "@/lib/ctf/parse/common";

describe("parseNav", () => {
  it("captures current user from authenticated header links", () => {
    const html = `
      <header>
        <a class="x-link" href="/challenge/list">Challenges</a>
        <a class="x-link" href="/scoreboard">Scoreboard</a>
        <a class="x-link" href="/user/alice">alice</a>
      </header>
    `;

    const nav = parseNav(html);

    expect(nav.isAuthenticated).toBe(true);
    expect(nav.currentUser).toEqual({ name: "alice", href: "/user/alice" });
  });

  it("keeps current user null when header shows login/register links", () => {
    const html = `
      <header>
        <a class="x-link" href="/challenge/list">Challenges</a>
        <a class="x-link" href="/login">Login</a>
        <a class="x-link" href="/register">Register</a>
      </header>
    `;

    const nav = parseNav(html);

    expect(nav.isAuthenticated).toBe(false);
    expect(nav.currentUser).toBeNull();
  });
});
