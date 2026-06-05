import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("chunk") as Blob;
    const sessionId = formData.get("sessionId") as string;

    if (!file || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing chunk or sessionId" },
        { status: 400 },
      );
    }

    // Mocking Upload ke Supabase Storage
    // Dalam implementasi ril, akan dipanggil `supabase.storage.from("audio-bucket").upload(...)`
    console.log(
      `[Upload API] Received chunk for session ${sessionId}, size: ${file.size} bytes`,
    );

    return NextResponse.json({
      success: true,
      // Fake URL representing the chunk written to supabase
      url: `https://fake-supabase-storage.com/audio-chunks/${sessionId}/chunk_${Date.now()}.m4a`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
