import { load } from "cheerio";

import type { ActivityPage } from "@/lib/ctf/types";
import { cleanText, parseNav, parseTitle, relativePath } from "@/lib/ctf/parse/common";

export function parseActivityPage(html: string): ActivityPage {
  const $ = load(html);
  const nav = parseNav(html);

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
    title: parseTitle(html),
    nav,
    rows,
  };
}
