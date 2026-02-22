import { cookies } from "next/headers";

import type { FlashMessage } from "@ctf-mn/api/types";

const FLASH_KEY = "ctfmn_flash";

export async function setFlash(message: FlashMessage) {
  const store = await cookies();
  store.set(FLASH_KEY, Buffer.from(JSON.stringify(message)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60,
  });
}

export async function readFlash(): Promise<FlashMessage | null> {
  const store = await cookies();
  const value = store.get(FLASH_KEY)?.value;
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as FlashMessage;
    if (parsed && typeof parsed.message === "string") {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
