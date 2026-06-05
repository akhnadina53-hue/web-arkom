import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const ALLOWED_MIME_TYPES = new Set([
  "audio/mpeg", // .mp3
  "audio/mp4", // .m4a, .mp4 audio
  "audio/x-m4a", // .m4a (Apple variant)
  "audio/m4a", // .m4a (some encoders)
  "audio/wav", // .wav
  "audio/x-wav", // .wav (variant)
  "audio/ogg", // .ogg
  "audio/webm", // .webm (browser recording)
  "audio/aac", // .aac
  "audio/flac", // .flac
  "audio/x-flac", // .flac (variant)
  "audio/3gpp", // .3gp (Android recorder)
  "audio/3gpp2", // .3g2
  "audio/amr", // .amr (old phone recordings)
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
]);

const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: { code: "UNAUTHORIZED", message: "Authentication required." },
        },
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
            message: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit. Please compress your audio and try again.`,
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
            message: `File type "${file.type}" is not supported. Please upload an audio file (MP3, M4A, WAV, OGG, etc.).`,
            details: { received: file.type, allowed: [...ALLOWED_MIME_TYPES] },
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
            message: `File extension "${ext}" is not supported. Please upload a voice recording file.`,
          },
        },
        { status: 415 },
      );
    }

    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 12));
    const isValidAudioHeader = checkAudioMagicBytes(header, mimeType);
    if (!isValidAudioHeader) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FILE_CONTENT",
            message:
              "The file content does not match a valid audio format. Upload rejected.",
          },
        },
        { status: 415 },
      );
    }

    const fakeSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.info(
      `[Upload API] Audio upload from user ${session.user.id}: ${file.name} (${file.size} bytes, ${mimeType})`,
    );

    return NextResponse.json({
      data: {
        sessionId: fakeSessionId,
        fileName: file.name,
        fileSize: file.size,
        mimeType,
        status: "QUEUED",
        message: "File received. Transcription will begin shortly.",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[Upload API] Error:", message);
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

  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return isMP3;
  if (mimeType.includes("mp4") || mimeType.includes("m4a"))
    return isMP4 || isMP3;
  if (mimeType.includes("wav")) return isWAV;
  if (mimeType.includes("ogg")) return isOGG;
  if (mimeType.includes("webm")) return isEBML;
  if (mimeType.includes("flac")) return isFLAC;
  if (mimeType.includes("aac")) return isAAC || isMP4;
  if (mimeType.includes("amr")) return isAMR;
  if (mimeType.includes("3gp")) return is3GP;

  return isMP3 || isMP4 || isWAV || isOGG || isEBML || isFLAC || isAAC || isAMR;
}
