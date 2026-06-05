import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const AI = process.env.AI_SERVICE_URL || "http://localhost:4000";
    const body = await request.json();

    const res = await fetch(`${AI}/tts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
