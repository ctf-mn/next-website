import { load } from "cheerio";

import type { AuthPage } from "@/lib/ctf/types";
import { cleanText, parseTitle } from "@/lib/ctf/parse/common";
import { toEnglish } from "@/lib/i18n/en-normalize";

export function parseAuthPage(html: string): AuthPage {
  const $ = load(html);

  const fieldErrors: Record<string, string> = {};
  const fieldValues: Record<string, string> = {};

  $("input[name]").each((_, input) => {
    const name = $(input).attr("name");
    if (!name || name === "_csrf_token") {
      return;
    }

    fieldValues[name] = $(input).attr("value") ?? "";

    const parent = $(input).closest("div");
    const error = cleanText(parent.find("p.text-red-600").first().text());
    if (error) {
      fieldErrors[name] = toEnglish(error);
    }
  });

  const alert = cleanText($("[role='alert'] div").last().text()) || null;

  return {
    title: parseTitle(html),
    csrfToken: $("input[name='_csrf_token']").attr("value") ?? null,
    alert: alert ? toEnglish(alert) : null,
    fieldErrors,
    fieldValues,
  };
}
