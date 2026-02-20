import { load } from "cheerio";

import type { ChallengeListPage } from "@/lib/ctf/types";
import { cleanText, parseNav, parseTitle, relativePath, toNumber } from "@/lib/ctf/parse/common";

export function parseChallengeListPage(html: string): ChallengeListPage {
  const $ = load(html);
  const nav = parseNav(html);

  const categories = $("#input-category option")
    .map((_, element) => ({
      value: $(element).attr("value") ?? "",
      label: cleanText($(element).text()),
      selected: $(element).is("[selected]"),
    }))
    .get();

  const events = $("#input-event option")
    .map((_, element) => ({
      value: $(element).attr("value") ?? "",
      label: cleanText($(element).text()),
      selected: $(element).is("[selected]"),
    }))
    .get();

  const statuses = $("#input-status option")
    .map((_, element) => ({
      value: $(element).attr("value") ?? "",
      label: cleanText($(element).text()),
      selected: $(element).is("[selected]"),
    }))
    .get();

  const items = $("tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const challengeLink = cells.eq(1).find("a").first();
      const authorLink = cells.eq(3).find("a").first();
      const rowClass = ($(row).attr("class") ?? "").toLowerCase();
      const challengeClass = (challengeLink.attr("class") ?? "").toLowerCase();
      const isSolved =
        rowClass.includes("bg-green-50") ||
        rowClass.includes("table-success") ||
        challengeClass.includes("text-green-600");

      return {
        rank: toNumber(cells.eq(0).text()),
        href: relativePath(challengeLink.attr("href")),
        title: cleanText(challengeLink.text()),
        category: cleanText(cells.eq(2).text()),
        author: cleanText(authorLink.text()),
        authorHref: relativePath(authorLink.attr("href")),
        solved: toNumber(cells.eq(4).text()),
        score: toNumber(cells.eq(5).text()),
        isSolved,
      };
    })
    .get()
    .filter((entry) => entry.title.length > 0);

  return {
    title: parseTitle(html),
    nav,
    categories,
    events,
    statuses,
    items,
  };
}
