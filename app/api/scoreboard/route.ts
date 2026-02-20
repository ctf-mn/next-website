import { NextRequest, NextResponse } from "next/server";

import type { ScoreboardApiResponse } from "@/lib/ctf/types";
import { getScoreboard } from "@/lib/ctf/service";

export async function GET(request: NextRequest) {
  const data = await getScoreboard(request.nextUrl.searchParams);

  const body: ScoreboardApiResponse = {
    rows: data.rows,
    pages: data.pages,
  };

  return NextResponse.json(body, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
