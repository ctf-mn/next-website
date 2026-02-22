import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = "https://ctf.mn";
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const FIXTURES_DIR = path.join(process.cwd(), "benchmarks", "fixtures");

async function fetchText(pathname: string): Promise<string> {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${pathname}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function firstMatch(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

async function main() {
  await mkdir(FIXTURES_DIR, { recursive: true });

  const challengeListHtml = await fetchText("/challenge/list");
  await writeFile(path.join(FIXTURES_DIR, "challenge-list.html"), challengeListHtml, "utf8");
  const scoreboardHtml = await fetchText("/scoreboard");
  await writeFile(path.join(FIXTURES_DIR, "scoreboard.html"), scoreboardHtml, "utf8");
  const activityHtml = await fetchText("/activity");
  await writeFile(path.join(FIXTURES_DIR, "activity.html"), activityHtml, "utf8");

  const challengeId = firstMatch(challengeListHtml, /href="\/challenge\/(\d+)"/) ?? "473";
  const userName = firstMatch(challengeListHtml, /href="\/user\/([^"]+)"/) ??
    firstMatch(scoreboardHtml, /href="\/user\/([^"]+)"/) ??
    "ByamB4";

  const challengeDetailHtml = await fetchText(`/challenge/${challengeId}`);
  await writeFile(path.join(FIXTURES_DIR, "challenge-detail.html"), challengeDetailHtml, "utf8");
  const authorName =
    firstMatch(challengeListHtml, /href="\/author\/([^"]+)"/) ||
    firstMatch(challengeDetailHtml, /href="\/author\/([^"]+)"/) ||
    "enhbold";

  const loginHtml = await fetchText("/login");
  await writeFile(path.join(FIXTURES_DIR, "login.html"), loginHtml, "utf8");
  const registerHtml = await fetchText("/register");
  await writeFile(path.join(FIXTURES_DIR, "register.html"), registerHtml, "utf8");
  const userProfileHtml = await fetchText(`/user/${userName}`);
  await writeFile(path.join(FIXTURES_DIR, "user-profile.html"), userProfileHtml, "utf8");
  const authorProfileHtml = await fetchText(`/author/${authorName}`);
  await writeFile(path.join(FIXTURES_DIR, "author-profile.html"), authorProfileHtml, "utf8");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
