import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { setAuthState } from "@/lib/ctf/auth-state";
import { ctfGet, ctfPost } from "@/lib/ctf/client";
import { parseAuthPage } from "@/lib/ctf/parse/auth";

export async function POST(request: NextRequest) {
  const [formData, loginGet] = await Promise.all([
    request.formData(),
    ctfGet("/login", { persistCookies: true }),
  ]);
  const token = parseAuthPage(loginGet.html).csrfToken;
  if (token) {
    formData.set("_csrf_token", token);
  }
  const response = await ctfPost("/login", formData);

  if (response.status >= 300 && response.status < 400) {
    redirect("/challenge/list");
  }

  await setAuthState("login", parseAuthPage(response.html));
  redirect("/login");
}
