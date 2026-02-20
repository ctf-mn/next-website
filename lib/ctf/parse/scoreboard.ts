import type { ScoreboardPage } from "@/lib/ctf/types";
import { cleanText, parseDocument, parseNav, parseTitle, relativePath, toNumber, type HtmlSource } from "@/lib/ctf/parse/common";

export function parseScoreboardPage(source: HtmlSource): ScoreboardPage {
  const $ = parseDocument(source);
  const nav = parseNav($);

  const rows = $("tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const userLink = cells.eq(1).find("a").first();

      return {
        rank: toNumber(cells.eq(0).text()),
        user: cleanText(userLink.text()),
        userHref: relativePath(userLink.attr("href")),
        solved: toNumber(cells.eq(2).text()),
        score: toNumber(cells.eq(3).text()),
      };
    })
    .get()
    .filter((entry) => entry.user.length > 0);

  const pages = $("a")
    .map((_, anchor) => {
      const href = relativePath($(anchor).attr("href"));
      const text = cleanText($(anchor).text());
      if (!href.startsWith("/scoreboard?page=") || !/^\d+$/.test(text)) {
        return null;
      }
      return {
        page: Number(text),
        href,
        current: $(anchor).attr("aria-current") === "page" || false,
      };
    })
    .get()
    .filter((entry): entry is { page: number; href: string; current: boolean } => Boolean(entry));

  return {
    title: parseTitle($),
    nav,
    rows,
    pages,
  };
}
