import { headers } from "next/headers";

import { CTF_BASE_URL } from "@/lib/ctf/constants";
import { getCookieHeader, mergeSetCookieHeaders } from "@/lib/ctf/session";

export type CtfResponse = {
  status: number;
  location: string | null;
  html: string;
};

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${CTF_BASE_URL}${path}`;
}

async function getForwardedUserAgent(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") ?? "next-ctf-mn";
}

type RequestOptions = {
  persistCookies?: boolean;
};

async function request(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<CtfResponse> {
  const cookieHeader = await getCookieHeader();
  const userAgent = await getForwardedUserAgent();

  const response = await fetch(toAbsoluteUrl(path), {
    ...init,
    redirect: "manual",
    headers: {
      "user-agent": userAgent,
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(init.headers ?? {}),
    },
  });

  const setCookie = response.headers.getSetCookie?.() ?? [];
  if (options.persistCookies && setCookie.length > 0) {
    await mergeSetCookieHeaders(setCookie);
  }

  return {
    status: response.status,
    location: response.headers.get("location"),
    html: await response.text(),
  };
}

export async function ctfGet(path: string, options: RequestOptions = {}) {
  return request(path, { method: "GET" }, options);
}

export async function ctfPost(path: string, formData: FormData, options: RequestOptions = { persistCookies: true }) {
  const body = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    body.append(key, String(value));
  }

  return request(
    path,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    },
    options,
  );
}
