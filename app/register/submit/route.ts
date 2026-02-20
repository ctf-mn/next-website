import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { setAuthState } from "@/lib/ctf/auth-state";
import { ctfGet, ctfPost } from "@/lib/ctf/client";
import { parseAuthPage } from "@/lib/ctf/parse/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const registerGet = await ctfGet("/register", { persistCookies: true });
  const token = parseAuthPage(registerGet.html).csrfToken;
  if (token) {
    formData.set("_csrf_token", token);
  }
  const response = await ctfPost("/register", formData);

  if (response.status >= 300 && response.status < 400) {
    redirect("/challenge/list");
  }

  await setAuthState("register", parseAuthPage(response.html));
  redirect("/register");
}
