import type { ChallengeDetailPage, FlashMessage } from "@/lib/ctf/types";
import { cleanText, parseDocument, parseNav, parseTitle, relativePath, toNumber, type HtmlSource } from "@/lib/ctf/parse/common";
import { toEnglish } from "@/lib/i18n/en-normalize";

export function parseChallengeDetailPage(source: HtmlSource, id: number): ChallengeDetailPage {
  const $ = parseDocument(source);
  const nav = parseNav($);

  const challengeTitle = cleanText($(".text-xl.font-medium").first().text());
  const metaLinks = $(".text-slate-500 a");

  const categoryLink = metaLinks.eq(0);
  const eventLink = metaLinks.eq(1);
  const authorLink = metaLinks.eq(2);

  const rightMeta = cleanText($(".text-slate-500 > div").last().text());
  const solvedMatch = rightMeta.match(/Solved:\s*([0-9]+)/i);
  const scoreMatch = rightMeta.match(/Score:\s*([0-9]+)/i);

  const markdown = $("[data-page-content]").first().text().trim();
  const csrfToken = $("input[name='_csrf_token']").attr("value") ?? null;

  const solvedUsers = $("table tbody tr")
    .map((_, row) => {
      const cells = $(row).find("td");
      const userLink = cells.eq(1).find("a").first();
      return {
        time: cleanText(cells.eq(0).text()),
        user: cleanText(userLink.text()),
        userHref: relativePath(userLink.attr("href")),
      };
    })
    .get()
    .filter((entry) => entry.user.length > 0);

  const pageText = $.root().text().toLowerCase();

  return {
    title: parseTitle($),
    nav,
    id,
    challengeTitle,
    category: cleanText(categoryLink.text()),
    categoryHref: relativePath(categoryLink.attr("href")),
    event: cleanText(eventLink.text()),
    eventHref: relativePath(eventLink.attr("href")),
    author: cleanText(authorLink.text()),
    authorHref: relativePath(authorLink.attr("href")),
    solved: solvedMatch ? toNumber(solvedMatch[1]) : 0,
    score: scoreMatch ? toNumber(scoreMatch[1]) : 0,
    markdown,
    solvedUsers,
    csrfToken,
    loginRequired: pageText.includes("login required"),
    alreadySolved: pageText.includes("already solved"),
  };
}

export function parseFlashFromChallengeHtml(source: HtmlSource): FlashMessage | null {
  const $ = parseDocument(source);
  const alertText = cleanText($("[role='alert']").text());
  if (!alertText) {
    return null;
  }

  const english = toEnglish(alertText);
  const lower = english.toLowerCase();

  if (lower.includes("correct")) {
    return { type: "success", message: english };
  }
  if (lower.includes("incorrect") || lower.includes("failed") || lower.includes("required")) {
    return { type: "error", message: english };
  }
  return { type: "info", message: english };
}
