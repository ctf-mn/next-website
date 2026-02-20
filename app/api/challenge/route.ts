import { NextRequest, NextResponse } from "next/server";

import { ctfPost } from "@/lib/ctf/client";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const response = await ctfPost("/api/challenge", formData);

  return new NextResponse(response.html, {
    status: response.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
