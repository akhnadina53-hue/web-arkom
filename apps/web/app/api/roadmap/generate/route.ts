import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import rateLimit from "@/lib/rate-limit";
import db from "@/lib/db";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token =
      session.user?.id || req.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(5, token);
    } catch {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a minute before trying again.",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { sessionId, ...fastApiBody } = body;

    const backendSecret =
      process.env.INTERNAL_API_SECRET || "fren-edu-super-secret-key-2026";

    const backendUrl = process.env.API_HOST || "http://127.0.0.1:8000";

    const backendResponse = await fetch(`${backendUrl}/roadmap/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": backendSecret,
      },
      body: JSON.stringify(fastApiBody),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend Error: ${errorText}`);
    }

    const data = await backendResponse.json();

    // Save to Database if sessionId is provided
    if (sessionId) {
      try {
        await db.recordingSession.update({
          where: { id: sessionId },
          data: { roadmap: JSON.stringify(data) },
        });
      } catch (dbError) {
        console.error("Failed to save roadmap to DB:", dbError);
        // Continue and return data even if DB save fails
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Roadmap Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap from AI service" },
      { status: 500 },
    );
  }
}
