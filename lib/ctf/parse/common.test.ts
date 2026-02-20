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

  it("captures current user when header links do not use x-link class", () => {
    const html = `
      <header>
        <a href="/">CTF.mn</a>
        <a href="/challenge/list/">Challenges</a>
        <a href="/scoreboard/">Scoreboard</a>
        <a href="/profile">alice</a>
        <a href="/logout">Logout</a>
      </header>
    `;

    const nav = parseNav(html);

    expect(nav.isAuthenticated).toBe(true);
    expect(nav.currentUser).toEqual({ name: "alice", href: "/profile" });
    expect(nav.links.some((entry) => entry.href === "/challenge/list")).toBe(true);
  });

  it("captures current user from authenticated welcome text in header", () => {
    const html = `
      <header>
        <div>
          <a class="x-link" href="/challenge/list">Challenges</a>
          <a class="x-link" href="/scoreboard">Scoreboard</a>
          <a class="x-link" href="/activity">Activity</a>
          <span>
            <span class="text-gray-500">Welcome</span>
            <span class="font-semibold">alice</span>
          </span>
          <form action="/logout" method="post">
            <button class="x-link" type="submit">Logout</button>
          </form>
        </div>
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
