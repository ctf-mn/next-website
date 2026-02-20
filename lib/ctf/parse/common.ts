import { load } from "cheerio";

import { toEnglish } from "@/lib/i18n/en-normalize";

export function parseDocument(html: string) {
  return load(html);
}

export function parseTitle(html: string): string {
  const $ = load(html);
  return toEnglish($("title").text().trim() || "CTF.mn");
}

export function parseNav(html: string) {
  const $ = load(html);
  const links: Array<{ href: string; label: string }> = [];
  $("header a.x-link").each((_, element) => {
    const href = $(element).attr("href") ?? "#";
    const label = toEnglish($(element).text().trim());
    links.push({ href, label });
  });

  const isAuthenticated = !links.some((e) => e.href === "/login");
  return { links, isAuthenticated };
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
