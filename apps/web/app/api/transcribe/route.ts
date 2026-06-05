import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const AI = process.env.AI_SERVICE_URL || "http://localhost:4000";
    const contentType = request.headers.get("content-type") || "";

    let fetchOptions: any = { method: "POST", headers: {} };

    if (contentType.includes("application/json")) {
      const body = await request.json();
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    } else {
      const buf = await request.arrayBuffer();
      fetchOptions.body = Buffer.from(buf);
      fetchOptions.headers["Content-Type"] =
        contentType || "application/octet-stream";
    }

    const res = await fetch(`${AI}/transcribe/`, fetchOptions);
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
