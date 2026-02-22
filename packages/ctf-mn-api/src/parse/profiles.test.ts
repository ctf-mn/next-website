import { describe, expect, it } from "vitest";

import { parseAuthorProfilePage } from "@ctf-mn/api/parse/profiles";

describe("parseAuthorProfilePage", () => {
  it("parses author challenge rows when a leading rank column exists", () => {
    const html = `
      <html>
        <head><title>Author: author1</title></head>
        <body>
          <header>
            <a class="x-link" href="/challenge/list">Challenges</a>
          </header>
          <h1>Author: <strong>author1</strong></h1>
          <table>
            <tbody>
              <tr>
                <td>1.</td>
                <td><a href="/challenge/42">Byte Maze</a></td>
                <td><a href="/challenge/list?category=web">Web</a></td>
                <td><a href="/challenge/list?category=all&event=2026">Winter 2026</a></td>
                <td>12</td>
                <td>450</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const parsed = parseAuthorProfilePage(html, "fallback-author");

    expect(parsed.author).toBe("author1");
    expect(parsed.rows).toEqual([
      {
        title: "Byte Maze",
        challengeHref: "/challenge/42",
        category: "Web",
        categoryHref: "/challenge/list?category=web",
        event: "Winter 2026",
        eventHref: "/challenge/list?category=all&event=2026",
        solved: 12,
        score: 450,
      },
    ]);
  });

  it("uses fallback author name when heading is missing", () => {
    const html = `
      <html>
        <head><title>Author</title></head>
        <body>
          <table><tbody></tbody></table>
        </body>
      </html>
    `;

    const parsed = parseAuthorProfilePage(html, "fallback-author");

    expect(parsed.author).toBe("fallback-author");
    expect(parsed.rows).toEqual([]);
  });
});
