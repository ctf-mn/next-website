import { redirect } from "next/navigation";

import { ctfPost } from "@ctf-mn/api/client";
import { clearCookieJar } from "@ctf-mn/api/session";

export async function POST() {
  const formData = new FormData();
  await ctfPost("/logout", formData);
  await clearCookieJar();
  redirect("/login");
}
