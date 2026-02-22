import { load, type CheerioAPI } from "cheerio";

import { toEnglish } from "@/lib/i18n/en-normalize";

export type HtmlSource = string | CheerioAPI;

export function parseDocument(source: HtmlSource): CheerioAPI {
  return typeof source === "string" ? load(source) : source;
}

export function parseTitle(source: HtmlSource): string {
  const $ = parseDocument(source);
  return toEnglish($("title").text().trim() || "CTF.mn");
}

export function parseNav(source: HtmlSource) {
  const $ = parseDocument(source);
  const links: Array<{ href: string; label: string }> = [];
  $("header a[href]").each((_, element) => {
    const href = normalizeNavHref(relativePath($(element).attr("href")));
    const label = toEnglish($(element).text().trim());
    links.push({ href, label });
  });

  const isAuthenticated = !links.some((e) => e.href === "/login" || e.href === "/register");
  const headerUsername = extractHeaderUsername($);
  const currentUserLink =
    links.find((e) => e.href.startsWith("/user/")) ??
    (isAuthenticated
      ? links.find((e) => !NON_USER_NAV_PATHS.has(e.href) && e.label.length > 0)
      : undefined);
  const currentUser = currentUserLink
    ? { name: currentUserLink.label, href: currentUserLink.href }
    : isAuthenticated && headerUsername
      ? { name: headerUsername, href: `/user/${encodeURIComponent(headerUsername)}` }
      : null;

  return { links, isAuthenticated, currentUser };
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function toNumber(text: string): number {
  const parsed = Number(text.replace(/[^0-9-]/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function relativePath(input: string | null | undefined): string {
  if (!input) {
    return "#";
  }
  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      const u = new URL(input);
      return `${u.pathname}${u.search}`;
    } catch {
      return input;
    }
  }
  return input;
}

const NON_USER_NAV_PATHS = new Set(["/", "/challenge/list", "/scoreboard", "/activity", "/login", "/register", "/logout"]);

function normalizeNavHref(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

function extractHeaderUsername($: CheerioAPI): string | null {
  const value = toEnglish($("header span.font-semibold").last().text().trim());
  return value.length > 0 ? value : null;
}
