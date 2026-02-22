import { NextRequest, NextResponse } from "next/server";

import type { ChallengeListApiResponse } from "@ctf-mn/api/types";
import { getChallengeList } from "@ctf-mn/api/service";

export async function GET(request: NextRequest) {
  const data = await getChallengeList(request.nextUrl.searchParams);

  const body: ChallengeListApiResponse = {
    categories: data.categories,
    events: data.events,
    statuses: data.statuses,
    items: data.items,
  };

  return NextResponse.json(body, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
