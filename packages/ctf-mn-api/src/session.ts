import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

import { UPSTREAM_COOKIE_KEY } from "@ctf-mn/api/constants";

type CookieJar = Record<string, string>;

async function getCookieStore() {
  return cookies();
}

export async function getCookieJar(): Promise<CookieJar> {
  const store = await getCookieStore();
  const value = store.get(UPSTREAM_COOKIE_KEY)?.value;
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (parsed && typeof parsed === "object") {
      return parsed as CookieJar;
    }
  } catch {
    return {};
  }

  return {};
}

export async function getCookieHeader(): Promise<string> {
  const jar = await getCookieJar();
  return Object.entries(jar)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

export async function mergeSetCookieHeaders(setCookieHeaders: string[]) {
  const store = await getCookieStore();
  const jar = await getCookieJar();

  for (const entry of setCookieHeaders) {
    const parsed = setCookieParser.parseString(entry);
    if (!parsed?.name) {
      continue;
    }

    if (parsed.value === "" || parsed.maxAge === 0) {
      delete jar[parsed.name];
    } else {
      jar[parsed.name] = parsed.value;
    }
  }

  if (Object.keys(jar).length === 0) {
    store.delete(UPSTREAM_COOKIE_KEY);
    return;
  }

  store.set(UPSTREAM_COOKIE_KEY, Buffer.from(JSON.stringify(jar)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearCookieJar() {
  const store = await getCookieStore();
  store.delete(UPSTREAM_COOKIE_KEY);
}
