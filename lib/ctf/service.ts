import { notFound } from "next/navigation";

import { ctfGet } from "@/lib/ctf/client";
import { parseActivityPage } from "@/lib/ctf/parse/activity";
import { parseAuthPage } from "@/lib/ctf/parse/auth";
import { parseChallengeDetailPage } from "@/lib/ctf/parse/challenge-detail";
import { parseChallengeListPage } from "@/lib/ctf/parse/challenge-list";
import { parseAuthorProfilePage, parseUserProfilePage } from "@/lib/ctf/parse/profiles";
import { parseScoreboardPage } from "@/lib/ctf/parse/scoreboard";
import { toEnglish } from "@/lib/i18n/en-normalize";

function ensureOkOrThrow(status: number) {
  if (status === 404) {
    notFound();
  }
  if (status >= 400) {
    throw new Error(`Upstream request failed with status ${status}`);
  }
}

export async function getChallengeList(searchParams: URLSearchParams) {
  const query = searchParams.toString();
  const path = query ? `/challenge/list?${query}` : "/challenge/list";
  const response = await ctfGet(path);
  ensureOkOrThrow(response.status);
  return parseChallengeListPage(response.html);
}

export async function getScoreboard(searchParams: URLSearchParams) {
  const query = searchParams.toString();
  const path = query ? `/scoreboard?${query}` : "/scoreboard";
  const response = await ctfGet(path);
  ensureOkOrThrow(response.status);
  return parseScoreboardPage(response.html);
}

export async function getActivity() {
  const response = await ctfGet("/activity");
  ensureOkOrThrow(response.status);

  const page = parseActivityPage(response.html);
  page.rows = page.rows.map((row) => ({
    ...row,
    status: toEnglish(row.status),
  }));
  return page;
}

export async function getChallenge(id: number) {
  const response = await ctfGet(`/challenge/${id}`);
  ensureOkOrThrow(response.status);
  return parseChallengeDetailPage(response.html, id);
}

export async function getUserProfile(name: string) {
  const response = await ctfGet(`/user/${encodeURIComponent(name)}`);
  ensureOkOrThrow(response.status);

  const page = parseUserProfilePage(response.html);
  page.rows = page.rows.map((entry) => ({ ...entry, status: toEnglish(entry.status) }));
  return page;
}

export async function getAuthorProfile(name: string) {
  const response = await ctfGet(`/author/${encodeURIComponent(name)}`);
  ensureOkOrThrow(response.status);
  return parseAuthorProfilePage(response.html, name);
}

export async function getLoginPage() {
  const response = await ctfGet("/login");
  ensureOkOrThrow(response.status);
  return parseAuthPage(response.html);
}

export async function getRegisterPage() {
  const response = await ctfGet("/register");
  ensureOkOrThrow(response.status);
  return parseAuthPage(response.html);
}
