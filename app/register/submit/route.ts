import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { setAuthState } from "@/lib/ctf/auth-state";
import { ctfGetDocument, ctfPostDocument } from "@/lib/ctf/client";
import { parseAuthPage } from "@/lib/ctf/parse/auth";

export async function POST(request: NextRequest) {
  const [formData, registerGet] = await Promise.all([
    request.formData(),
    ctfGetDocument("/register", { persistCookies: true }),
  ]);
  const token = parseAuthPage(registerGet.document).csrfToken;
  if (token) {
    formData.set("_csrf_token", token);
  }
  const response = await ctfPostDocument("/register", formData);

  if (response.status >= 300 && response.status < 400) {
    redirect("/challenge/list");
  }

  await setAuthState("register", parseAuthPage(response.document));
  redirect("/register");
}
