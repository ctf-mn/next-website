import { cookies } from "next/headers";

import type { AuthPage } from "@ctf-mn/api/types";

const COOKIE_PREFIX = "ctfmn_auth_state_";

function cookieName(kind: "login" | "register") {
  return `${COOKIE_PREFIX}${kind}`;
}

export async function setAuthState(kind: "login" | "register", data: AuthPage) {
  const store = await cookies();
  store.set(cookieName(kind), Buffer.from(JSON.stringify(data)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60,
  });
}

export async function readAuthState(kind: "login" | "register"): Promise<AuthPage | null> {
  const store = await cookies();
  const key = cookieName(kind);
  const value = store.get(key)?.value;
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AuthPage;
  } catch {
    return null;
  }
}
