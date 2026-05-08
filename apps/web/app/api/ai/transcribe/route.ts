import { NextRequest, NextResponse } from "next/server";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, audioUrls } = body;
        
        if (!audioUrls || audioUrls.length === 0) {
            return NextResponse.json({ success: false, error: "No audio URLs provided" }, { status: 400 });
        }

        console.log(`[Transcribe API] Forwarding to AI service for session ${sessionId}`);
        
        // Kita meneruskan audio chunk URL (misalnya digabung jadi 1 URL jika sudah digabung Supabase)
        // Ke FastAPI Python Endpoints
        const aiResponse = await fetch(`${AI_SERVICE_URL}/transcribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                 audio_url: audioUrls[0], // Pada sistem nyata, jika multipart -> orchestrasi FFmpeg/download terlebih dahulu
                 language: "auto" 
            }),
        });
        
        if (!aiResponse.ok) {
             throw new Error(`AI Service returned ${aiResponse.status}`);
        }

        const data = await aiResponse.json();
        
        // Disinilah proses sinkronisasi dan pemicu Summarization (`/api/ai/summarize`) berantai berjalan
        // db.session.update({ where: { id: sessionId }, data: { transcript: data.transcript, status: "TRANSCRIBING" }})
        
        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error("Transcribe API Error:", e.message);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
