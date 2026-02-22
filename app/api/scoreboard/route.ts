import { NextRequest, NextResponse } from "next/server";

import type { ScoreboardApiResponse } from "@ctf-mn/api/types";
import { getScoreboard } from "@ctf-mn/api/service";

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
