import { load } from "cheerio";

import type { AuthorProfilePage, UserProfilePage } from "@/lib/ctf/types";
import { cleanText, parseNav, parseTitle, relativePath, toNumber } from "@/lib/ctf/parse/common";

export function parseUserProfilePage(html: string): UserProfilePage {
  const $ = load(html);
  const nav = parseNav(html);

  const heading = cleanText($("h1").first().text());
  const user = heading.replace(/^User:\s*/i, "");

  const summaryText = cleanText($("h1").first().parent().find("span").first().text());
  const solvedMatch = summaryText.match(/Solved:\s*([0-9]+)/i);
  const scoreMatch = summaryText.match(/Score:\s*([0-9]+)/i);

  const rows = $("tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const challengeLink = cells.eq(1).find("a").first();

      return {
        time: cleanText(cells.eq(0).text()),
        challenge: cleanText(challengeLink.text()),
        challengeHref: relativePath(challengeLink.attr("href")),
        score: toNumber(cells.eq(2).text()),
        status: cleanText(cells.eq(3).text()),
      };
    })
    .get()
    .filter((entry) => entry.challenge.length > 0);

  return {
    title: parseTitle(html),
    nav,
    user,
    solvedCount: solvedMatch ? toNumber(solvedMatch[1]) : 0,
    score: scoreMatch ? toNumber(scoreMatch[1]) : 0,
    rows,
  };
}

export function parseAuthorProfilePage(html: string, fallbackName: string): AuthorProfilePage {
  const $ = load(html);
  const nav = parseNav(html);
  const heading = cleanText($("h1").first().text());
  const author = heading.replace(/^Author:\s*/i, "") || fallbackName;

  const rows = $("tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const links = cells.find("a");
      const challengeLink = links.eq(0);
      const categoryLink = links.eq(1);
      const eventLink = links.eq(2);
      const solvedCell = cells.eq(cells.length - 2);
      const scoreCell = cells.eq(cells.length - 1);

      return {
        title: cleanText(challengeLink.text()),
        challengeHref: relativePath(challengeLink.attr("href")),
        category: cleanText(categoryLink.text()),
        categoryHref: relativePath(categoryLink.attr("href")),
        event: cleanText(eventLink.text()),
        eventHref: relativePath(eventLink.attr("href")),
        solved: toNumber(solvedCell.text()),
        score: toNumber(scoreCell.text()),
      };
    })
    .get()
    .filter((entry) => entry.title.length > 0);

  return {
    title: parseTitle(html),
    nav,
    author,
    rows,
  };
}
