import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { setAuthState } from "@/lib/ctf/auth-state";
import { ctfGetDocument, ctfPostDocument } from "@/lib/ctf/client";
import { parseAuthPage } from "@/lib/ctf/parse/auth";

export async function POST(request: NextRequest) {
  const [formData, loginGet] = await Promise.all([
    request.formData(),
    ctfGetDocument("/login", { persistCookies: true }),
  ]);
  const token = parseAuthPage(loginGet.document).csrfToken;
  if (token) {
    formData.set("_csrf_token", token);
  }
  const response = await ctfPostDocument("/login", formData);

  if (response.status >= 300 && response.status < 400) {
    redirect("/challenge/list");
  }

  await setAuthState("login", parseAuthPage(response.document));
  redirect("/login");
}
