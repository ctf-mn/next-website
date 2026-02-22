import { notFound } from "next/navigation";

import { ctfGetDocument } from "@ctf-mn/api/client";
import { parseActivityPage } from "@ctf-mn/api/parse/activity";
import { parseAuthPage } from "@ctf-mn/api/parse/auth";
import { parseChallengeDetailPage } from "@ctf-mn/api/parse/challenge-detail";
import { parseChallengeListPage } from "@ctf-mn/api/parse/challenge-list";
import { parseAuthorProfilePage, parseUserProfilePage } from "@ctf-mn/api/parse/profiles";
import { parseScoreboardPage } from "@ctf-mn/api/parse/scoreboard";
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
  const response = await ctfGetDocument(path);
  ensureOkOrThrow(response.status);
  return parseChallengeListPage(response.document);
}

export async function getScoreboard(searchParams: URLSearchParams) {
  const query = searchParams.toString();
  const path = query ? `/scoreboard?${query}` : "/scoreboard";
  const response = await ctfGetDocument(path);
  ensureOkOrThrow(response.status);
  return parseScoreboardPage(response.document);
}

export async function getActivity() {
  const response = await ctfGetDocument("/activity");
  ensureOkOrThrow(response.status);

  const page = parseActivityPage(response.document);
  page.rows = page.rows.map((row) => ({
    ...row,
    status: toEnglish(row.status),
  }));
  return page;
}

export async function getChallenge(id: number) {
  const response = await ctfGetDocument(`/challenge/${id}`);
  ensureOkOrThrow(response.status);
  return parseChallengeDetailPage(response.document, id);
}

export async function getUserProfile(name: string) {
  const response = await ctfGetDocument(`/user/${encodeURIComponent(name)}`);
  ensureOkOrThrow(response.status);

  const page = parseUserProfilePage(response.document);
  page.rows = page.rows.map((entry) => ({ ...entry, status: toEnglish(entry.status) }));
  return page;
}

export async function getAuthorProfile(name: string) {
  const response = await ctfGetDocument(`/author/${encodeURIComponent(name)}`);
  ensureOkOrThrow(response.status);
  return parseAuthorProfilePage(response.document, name);
}

export async function getLoginPage() {
  const response = await ctfGetDocument("/login");
  ensureOkOrThrow(response.status);
  return parseAuthPage(response.document);
}

export async function getRegisterPage() {
  const response = await ctfGetDocument("/register");
  ensureOkOrThrow(response.status);
  return parseAuthPage(response.document);
}
