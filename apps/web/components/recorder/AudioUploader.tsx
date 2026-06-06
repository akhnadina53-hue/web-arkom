"use client";

import {
  useRef,
  useState,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Music,
  CheckCircle2,
  AlertCircle,
  X,
  FileAudio,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_MIME_TYPES = [
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
];

const ACCEPTED_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".wav",
  ".ogg",
  ".webm",
  ".aac",
  ".flac",
  ".3gp",
  ".amr",
  ".mpeg",
  ".mpg",
];
const MAX_FILE_SIZE_MB = 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const DISPLAY_FORMATS = "MP3 · M4A · WAV · OGG · FLAC · AAC";

type UploadStatus =
  | "idle"
  | "dragging"
  | "validating"
  | "uploading"
  | "done"
  | "error";

interface AudioUploaderProps {
  onUploadComplete?: (sessionId: string, fileName: string) => void;
  className?: string;
}

interface SelectedFile {
  file: File;
  sizeLabel: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFileClient(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large (${formatFileSize(file.size)}). Maximum is ${MAX_FILE_SIZE_MB}MB.`;
  }
  if (file.type && !ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase())) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ACCEPTED_EXTENSIONS.includes(`.${ext}`)) {
      return `"${file.name}" is not a supported audio file. Please upload MP3, M4A, WAV, OGG, FLAC, or AAC.`;
    }
  }
  return null;
}

export function AudioUploader({
  onUploadComplete,
  className,
}: AudioUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedSession, setUploadedSession] = useState<string | null>(null);

  const resetState = () => {
    setStatus("idle");
    setSelected(null);
    setProgress(0);
    setErrorMsg(null);
    setUploadedSession(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = useCallback(
    async (file: File) => {
      setStatus("validating");
      const clientError = validateFileClient(file);
      if (clientError) {
        setErrorMsg(clientError);
        setStatus("error");
        return;
      }

      setSelected({ file, sizeLabel: formatFileSize(file.size) });

      setStatus("uploading");
      setProgress(0);

      const formData = new FormData();
      formData.append("audio", file);

      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 8 + 2, 90));
      }, 300);

      try {
        const res = await fetch("/api/upload/audio", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        const body = await res.json();

        if (!res.ok) {
          setErrorMsg(
            body?.error?.message ?? "Upload failed. Please try again.",
          );
          setStatus("error");
          return;
        }

        setProgress(100);
        setUploadedSession(body.data.sessionId);
        setStatus("done");
        onUploadComplete?.(body.data.sessionId, file.name);
        // Redirect to session page after a short delay
        setTimeout(() => {
          router.push(`/session/${body.data.sessionId}`);
        }, 1200);
      } catch {
        clearInterval(progressInterval);
        setErrorMsg(
          "Network error. Please check your connection and try again.",
        );
        setStatus("error");
      }
    },
    [onUploadComplete],
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setStatus("dragging");
  };
  const handleDragLeave = () => {
    if (status === "dragging") setStatus("idle");
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const isDragging = status === "dragging";
  const isUploading = status === "uploading";
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <AnimatePresence mode="wait">
        {/* === Done State === */}
        {isDone && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[28px] bg-emerald-500/10 border border-emerald-500/30 p-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Upload Complete!</p>
              <p className="text-slate-400 text-sm mt-1">
                {selected?.file.name}
              </p>
              <p className="text-emerald-400/70 text-xs mt-2 font-mono">
                {uploadedSession}
              </p>
            </div>
            <p className="text-slate-500 text-sm">
              Your audio is queued for transcription. We&apos;ll notify you when
              it&apos;s ready.
            </p>
            <button
              onClick={resetState}
              className="mt-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
            >
              Upload another file
            </button>
          </motion.div>
        )}

        {/* === Uploading State === */}
        {isUploading && selected && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[28px] bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-bold text-white">Uploading audio…</p>
              <p className="text-slate-500 text-sm mt-1 truncate max-w-xs">
                {selected.file.name} · {selected.sizeLabel}
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <p className="text-slate-600 text-xs">{Math.round(progress)}%</p>
          </motion.div>
        )}

        {/* === Error State === */}
        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[28px] bg-red-500/8 border border-red-500/30 p-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white">Upload Rejected</p>
              <p className="text-red-400/80 text-sm mt-2 leading-relaxed max-w-sm">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={resetState}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* === Idle / Dragging Drop Zone === */}
        {(status === "idle" || isDragging || status === "validating") && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative rounded-[28px] border-2 border-dashed p-10 flex flex-col items-center gap-5 cursor-pointer transition-all group",
                isDragging
                  ? "border-teal-400 bg-teal-500/10 scale-[1.01]"
                  : "border-slate-700 bg-slate-900/30 hover:border-teal-500/50 hover:bg-teal-500/5",
              )}
            >
              {/* Icon */}
              <motion.div
                animate={{ y: isDragging ? -4 : 0 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  isDragging
                    ? "bg-teal-500/20"
                    : "bg-slate-800 group-hover:bg-teal-500/10",
                )}
              >
                {isDragging ? (
                  <Music className="w-8 h-8 text-teal-400" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-teal-400 transition-colors" />
                )}
              </motion.div>

              {/* Text */}
              <div className="text-center">
                <p className="font-bold text-white text-lg">
                  {isDragging ? "Drop it!" : "Drop audio file here"}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  or{" "}
                  <span className="text-teal-400 font-semibold group-hover:text-teal-300 transition-colors">
                    click to browse
                  </span>
                </p>
              </div>

              {/* Accepted formats */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {ACCEPTED_EXTENSIONS.map((ext) => (
                  <span
                    key={ext}
                    className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                  >
                    {ext.replace(".", "")}
                  </span>
                ))}
              </div>

              {/* Size limit */}
              <p className="text-slate-600 text-xs">
                Maximum file size: {MAX_FILE_SIZE_MB}MB
              </p>

              {/* Rejected formats hint */}
              <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-2">
                <X className="w-3 h-3 text-red-500/60 shrink-0" />
                <p className="text-red-500/60 text-[11px] font-medium">
                  PDF, images, and video files are not accepted
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={
                ACCEPTED_MIME_TYPES.join(",") +
                "," +
                ACCEPTED_EXTENSIONS.join(",")
              }
              className="hidden"
              onChange={handleFileChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
