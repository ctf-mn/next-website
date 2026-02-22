import { readFileSync } from "node:fs";
import path from "node:path";

import { Bench } from "tinybench";

import { parseActivityPage } from "../src/parse/activity";
import { parseAuthPage } from "../src/parse/auth";
import { parseChallengeDetailPage } from "../src/parse/challenge-detail";
import { parseChallengeListPage } from "../src/parse/challenge-list";
import { parseAuthorProfilePage, parseUserProfilePage } from "../src/parse/profiles";
import { parseScoreboardPage } from "../src/parse/scoreboard";

function fixture(name: string): string {
  return readFileSync(path.join(process.cwd(), "benchmarks", "fixtures", name), "utf8");
}

function extractFirstMatch(source: string, pattern: RegExp): string | null {
  const match = source.match(pattern);
  return match?.[1] ?? null;
}

const challengeListPageHtml = fixture("challenge-list.html");
const scoreboardPageHtml = fixture("scoreboard.html");
const activityPageHtml = fixture("activity.html");
const challengeDetailPageHtml = fixture("challenge-detail.html");
const userProfilePageHtml = fixture("user-profile.html");
const authorProfilePageHtml = fixture("author-profile.html");
const loginAuthPageHtml = fixture("login.html");
const registerAuthPageHtml = fixture("register.html");
const challengeId = Number(extractFirstMatch(challengeListPageHtml, /href="\/challenge\/(\d+)"/) ?? "473");
const authorName = extractFirstMatch(authorProfilePageHtml, /h1[^>]*>([^<]+)</) ?? "fallback-author";

const suite = new Bench({ time: 200, warmupTime: 30 });

suite.add("parseChallengeListPage", () => {
  parseChallengeListPage(challengeListPageHtml);
});

suite.add("parseScoreboardPage", () => {
  parseScoreboardPage(scoreboardPageHtml);
});

suite.add("parseActivityPage", () => {
  parseActivityPage(activityPageHtml);
});

suite.add("parseChallengeDetailPage", () => {
  parseChallengeDetailPage(challengeDetailPageHtml, challengeId);
});

suite.add("parseUserProfilePage", () => {
  parseUserProfilePage(userProfilePageHtml);
});

suite.add("parseAuthorProfilePage", () => {
  parseAuthorProfilePage(authorProfilePageHtml, authorName);
});

suite.add("parseAuthPage (login)", () => {
  parseAuthPage(loginAuthPageHtml);
});

suite.add("parseAuthPage (register)", () => {
  parseAuthPage(registerAuthPageHtml);
});

(async () => {
  await suite.run();
  console.table(suite.table());
})();
