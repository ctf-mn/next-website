import { headers } from "next/headers";
import type { CheerioAPI } from "cheerio";

import { CTF_BASE_URL } from "@ctf-mn/api/constants";
import { parseHtmlFromStream } from "@ctf-mn/api/parse/stream";
import { getCookieHeader, mergeSetCookieHeaders } from "@ctf-mn/api/session";

export type CtfResponse = {
  status: number;
  location: string | null;
  html: string;
};

export type CtfRawResponse = {
  status: number;
  location: string | null;
  headers: Headers;
  body: ReadableStream<Uint8Array> | null;
};

export type CtfParsedResponse = {
  status: number;
  location: string | null;
  document: CheerioAPI;
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

async function requestRaw(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<CtfRawResponse> {
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
    headers: response.headers,
    body: response.body,
  };
}

async function request(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<CtfResponse> {
  const response = await requestRaw(path, init, options);

  return {
    status: response.status,
    location: response.location,
    html: response.body ? await new Response(response.body).text() : "",
  };
}

function buildFormBody(formData: FormData): URLSearchParams {
  const body = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    body.append(key, String(value));
  }
  return body;
}

async function requestDocument(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<CtfParsedResponse> {
  const response = await requestRaw(path, init, options);

  return {
    status: response.status,
    location: response.location,
    document: await parseHtmlFromStream(response.body),
  };
}

export async function ctfGet(path: string, options: RequestOptions = {}) {
  return request(path, { method: "GET" }, options);
}

export async function ctfGetDocument(path: string, options: RequestOptions = {}) {
  return requestDocument(path, { method: "GET" }, options);
}

export async function ctfGetRaw(path: string, options: RequestOptions = {}) {
  return requestRaw(path, { method: "GET" }, options);
}

export async function ctfPost(path: string, formData: FormData, options: RequestOptions = { persistCookies: true }) {
  return request(
    path,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: buildFormBody(formData),
    },
    options,
  );
}

export async function ctfPostDocument(path: string, formData: FormData, options: RequestOptions = { persistCookies: true }) {
  return requestDocument(
    path,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: buildFormBody(formData),
    },
    options,
  );
}

export async function ctfPostRaw(path: string, formData: FormData, options: RequestOptions = { persistCookies: true }) {
  return requestRaw(
    path,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: buildFormBody(formData),
    },
    options,
  );
}
