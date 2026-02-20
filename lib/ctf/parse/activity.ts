import type { ActivityPage } from "@/lib/ctf/types";
import { cleanText, parseDocument, parseNav, parseTitle, relativePath, type HtmlSource } from "@/lib/ctf/parse/common";

export function parseActivityPage(source: HtmlSource): ActivityPage {
  const $ = parseDocument(source);
  const nav = parseNav($);

  const rows = $("tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const userLink = cells.eq(1).find("a").first();
      const challengeLink = cells.eq(2).find("a").first();
      const status = cleanText(cells.eq(3).text());

      return {
        time: cleanText(cells.eq(0).text()),
        user: cleanText(userLink.text()),
        userHref: relativePath(userLink.attr("href")),
        challenge: cleanText(challengeLink.text()),
        challengeHref: relativePath(challengeLink.attr("href")),
        status,
        correct: status.toLowerCase() === "correct",
      };
    })
    .get()
    .filter((entry) => entry.user.length > 0);

  return {
    title: parseTitle($),
    nav,
    rows,
  };
}
