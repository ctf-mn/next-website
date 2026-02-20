import { redirect } from "next/navigation";

import { ctfPost } from "@/lib/ctf/client";
import { clearCookieJar } from "@/lib/ctf/session";

export async function POST() {
  const formData = new FormData();
  await ctfPost("/logout", formData);
  await clearCookieJar();
  redirect("/login");
}
