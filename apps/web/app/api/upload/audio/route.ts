import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { encryptAndSaveFile, decryptAndReadFile } from "@/lib/secure-storage";
import db from "@/lib/db";

const ALLOWED_MIME_TYPES = new Set([
  "audio/mpeg",
  "video/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/flac",
  "audio/x-flac",
  "audio/3gpp",
  "audio/3gpp2",
  "audio/amr",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".wav",
  ".ogg",
  ".webm",
  ".aac",
  ".flac",
  ".3gp",
  ".3g2",
  ".amr",
  ".mpeg",
  ".mpg",
]);

const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const INTERNAL_API_SECRET =
  process.env.INTERNAL_API_SECRET || "fren-edu-super-secret-key-2026";

export async function POST(req: NextRequest) {
  let recordingSessionId: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: "MISSING_FILE", message: "No audio file provided." } },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: {
            code: "FILE_TOO_LARGE",
            message: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit.`,
          },
        },
        { status: 413 },
      );
    }

    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FILE_TYPE",
            message: `File type "${file.type}" is not supported.`,
          },
        },
        { status: 415 },
      );
    }

    const fileName = file.name.toLowerCase();
    const ext = "." + fileName.split(".").pop();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FILE_EXTENSION",
            message: `File extension "${ext}" is not supported.`,
          },
        },
        { status: 415 },
      );
    }

    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 12));
    if (!checkAudioMagicBytes(header, mimeType)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FILE_CONTENT",
            message: "The file content does not match a valid audio format.",
          },
        },
        { status: 415 },
      );
    }

    const nodeBuffer = Buffer.from(buffer);

    const { storagePath, ivHex, fileSize } = await encryptAndSaveFile(
      nodeBuffer,
      file.name,
    );

    const secureAudio = await db.secureAudio.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileSize,
        mimeType,
        storagePath,
        iv: ivHex,
      },
    });

    const recordingSession = await db.recordingSession.create({
      data: {
        userId: session.user.id,
        title: file.name.replace(/\.[^/.]+$/, ""), 
        status: "TRANSCRIBING",
        language: "id",
        secureAudioId: secureAudio.id,
      },
    });
    recordingSessionId = recordingSession.id;

    console.info(
      `[Upload API] Session ${recordingSession.id} created for user ${session.user.id}, file: ${file.name}`,
    );

    const decryptedBuffer = await decryptAndReadFile(storagePath, ivHex);

    const aiFormData = new FormData();
    const audioBlob = new Blob([decryptedBuffer], { type: mimeType });
    aiFormData.append("file", audioBlob, file.name);

    console.info(
      `[Upload API] Sending ${(decryptedBuffer.length / 1024 / 1024).toFixed(2)}MB to AI service for transcription...`,
    );

    const aiResponse = await fetch(`${AI_SERVICE_URL}/transcribe/`, {
      method: "POST",
      headers: {
        "X-Api-Key": INTERNAL_API_SECRET,
      },
      body: aiFormData,
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(
        `AI Service transcription failed (${aiResponse.status}): ${errText}`,
      );
    }

    const transcribeData = await aiResponse.json();

    const durationSeconds = Math.round(transcribeData.duration || 0);
    const wordCount = transcribeData.transcript?.split(/\s+/).length || 0;

    await db.recordingSession.update({
      where: { id: recordingSession.id },
      data: {
        transcript: transcribeData.transcript,
        duration: durationSeconds,
        status: "TRANSCRIBED",
      },
    });

    console.info(
      `[Upload API] Session ${recordingSession.id} transcribed successfully. Words: ${wordCount}, Duration: ${durationSeconds}s`,
    );

    return NextResponse.json({
      data: {
        sessionId: recordingSession.id,
        fileName: file.name,
        fileSize: nodeBuffer.length,
        mimeType,
        duration: durationSeconds,
        wordCount,
        status: "TRANSCRIBED",
        message: "Audio transcribed successfully.",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[Upload API] Error:", message);

    if (recordingSessionId) {
      await db.recordingSession
        .update({
          where: { id: recordingSessionId },
          data: { status: "ERROR" },
        })
        .catch((e) =>
          console.error("[Upload API] Failed to set session to ERROR:", e),
        );
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 },
    );
  }
}

function checkAudioMagicBytes(header: Uint8Array, mimeType: string): boolean {
  const h = header;
  const isMP3 =
    (h[0] === 0x49 && h[1] === 0x44 && h[2] === 0x33) ||
    (h[0] === 0xff && (h[1] === 0xfb || h[1] === 0xf3 || h[1] === 0xe3));

  const isMP4 =
    h[4] === 0x66 && h[5] === 0x74 && h[6] === 0x79 && h[7] === 0x70;

  const isWAV =
    h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46;

  const isOGG =
    h[0] === 0x4f && h[1] === 0x67 && h[2] === 0x67 && h[3] === 0x53;

  const isEBML =
    h[0] === 0x1a && h[1] === 0x45 && h[2] === 0xdf && h[3] === 0xa3;

  const isFLAC =
    h[0] === 0x66 && h[1] === 0x4c && h[2] === 0x61 && h[3] === 0x43;

  const isAAC = h[0] === 0xff && (h[1] === 0xf1 || h[1] === 0xf9);

  const isAMR =
    h[0] === 0x23 && h[1] === 0x21 && h[2] === 0x41 && h[3] === 0x4d;

  const is3GP = isMP4;

  const isMPEG =
    (h[0] === 0x00 &&
      h[1] === 0x00 &&
      h[2] === 0x01 &&
      (h[3] === 0xba || h[3] === 0xb3)) ||
    isMP3;

  if (mimeType.includes("video/mpeg")) return isMPEG;
  if (mimeType.includes("audio/mpeg") || mimeType.includes("mp3"))
    return isMP3 || isMPEG;
  if (mimeType.includes("mp4") || mimeType.includes("m4a"))
    return isMP4 || isMP3;
  if (mimeType.includes("wav")) return isWAV;
  if (mimeType.includes("ogg")) return isOGG;
  if (mimeType.includes("webm")) return isEBML;
  if (mimeType.includes("flac")) return isFLAC;
  if (mimeType.includes("aac")) return isAAC || isMP4;
  if (mimeType.includes("amr")) return isAMR;
  if (mimeType.includes("3gp")) return is3GP;

  return (
    isMP3 || isMP4 || isWAV || isOGG || isEBML || isFLAC || isAAC || isAMR || isMPEG
  );
}
