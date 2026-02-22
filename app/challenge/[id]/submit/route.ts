import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { ctfGetDocument, ctfPostDocument } from "@ctf-mn/api/client";
import { setFlash } from "@ctf-mn/api/flash";
import { parseChallengeDetailPage, parseFlashFromChallengeHtml } from "@ctf-mn/api/parse/challenge-detail";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const formData = await request.formData();
  const view = await ctfGetDocument(`/challenge/${id}`, { persistCookies: true });
  const token = parseChallengeDetailPage(view.document, Number(id)).csrfToken;
  if (token) {
    formData.set("_csrf_token", token);
  }

  const response = await ctfPostDocument(`/challenge/${id}`, formData);

  if (response.status >= 300 && response.status < 400 && response.location) {
    redirect(`/challenge/${id}`);
  }

  const flash = parseFlashFromChallengeHtml(response.document);
  if (flash) {
    await setFlash(flash);
  }

  redirect(`/challenge/${id}`);
}
