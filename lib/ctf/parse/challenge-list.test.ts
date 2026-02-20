import { describe, expect, it } from "vitest";

import { parseChallengeListPage } from "@/lib/ctf/parse/challenge-list";

describe("parseChallengeListPage", () => {
  it("marks solved challenges from upstream solved row styles", () => {
    const html = `
      <html>
        <head><title>Challenges</title></head>
        <body>
          <header>
            <a class="x-link" href="/challenge/list">Challenges</a>
            <a class="x-link" href="/scoreboard">Scoreboard</a>
            <a class="x-link" href="/user/alice">alice</a>
          </header>
          <form>
            <select id="input-category">
              <option value="all" selected>All</option>
            </select>
            <select id="input-event">
              <option value="all" selected>All</option>
            </select>
            <select id="input-status">
              <option value="all" selected>All</option>
              <option value="solved">Solved</option>
            </select>
          </form>
          <table>
            <tbody>
              <tr class="h-12 border-t bg-green-50">
                <td>1</td>
                <td><a class="x-link !text-green-600" href="/challenge/1">Warmup</a></td>
                <td>misc</td>
                <td><a href="/author/alice">alice</a></td>
                <td>10</td>
                <td>100</td>
              </tr>
              <tr class="h-12 border-t">
                <td>2</td>
                <td><a class="x-link" href="/challenge/2">Crypto 101</a></td>
                <td>crypto</td>
                <td><a href="/author/bob">bob</a></td>
                <td>5</td>
                <td>200</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const page = parseChallengeListPage(html);

    expect(page.items).toHaveLength(2);
    expect(page.items[0]?.isSolved).toBe(true);
    expect(page.items[1]?.isSolved).toBe(false);
  });
});
