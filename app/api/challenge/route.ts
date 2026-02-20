import { NextRequest, NextResponse } from "next/server";

import { ctfPostRaw } from "@/lib/ctf/client";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const response = await ctfPostRaw("/api/challenge", formData);

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}
