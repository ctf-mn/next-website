import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { ctfGetDocument, ctfPostDocument } from "@/lib/ctf/client";
import { setFlash } from "@/lib/ctf/flash";
import { parseChallengeDetailPage, parseFlashFromChallengeHtml } from "@/lib/ctf/parse/challenge-detail";

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
