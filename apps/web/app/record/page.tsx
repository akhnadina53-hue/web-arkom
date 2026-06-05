"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Square,
  Save,
  Trash2,
  Languages,
  Settings2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordingTimer } from "@/components/recorder/RecordingTimer";
import {
  StatusIndicator,
  type PipelineStep,
} from "@/components/recorder/StatusIndicator";
import { ChunkUploader } from "@/components/recorder/ChunkUploader";
import { AudioUploader } from "@/components/recorder/AudioUploader";
import { useRecordingStore } from "@/lib/store/recordingStore";

type InputMode = "record" | "upload";

const BAR_HEIGHTS = Array.from({ length: 40 }, () => Math.random() * 80 + 20);
const BAR_DURATIONS = Array.from(
  { length: 40 },
  () => 0.5 + Math.random() * 0.5,
);

export default function RecordPage() {
  const { isRecording, duration, setIsRecording, setDuration, reset } =
    useRecordingStore();
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("IDLE");
  const [sessionId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("record");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setDuration(duration + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, duration, setDuration]);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setPipelineStep("UPLOADING");
    } else {
      reset();
      setDuration(0);
      setIsRecording(true);
      setPipelineStep("RECORDING");
    }
  };

  const handleDiscard = () => {
    reset();
    setDuration(0);
    setPipelineStep("IDLE");
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-slate-900 pt-12 pb-24 px-6">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-1000",
            isRecording
              ? "bg-red-500/6 scale-110"
              : inputMode === "upload"
                ? "bg-violet-500/6"
                : "bg-teal-500/6",
          )}
        />
      </div>

      {/* Mode Switcher Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-1 p-1 bg-slate-900/70 border border-slate-800 rounded-2xl mb-10 z-10 w-full max-w-[320px]"
      >
        <button
          id="tab-record"
          onClick={() => setInputMode("record")}
          className={cn(
            "flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
            inputMode === "record"
              ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          <Mic className="w-4 h-4" />
          Record Live
        </button>
        <button
          id="tab-upload"
          onClick={() => setInputMode("upload")}
          className={cn(
            "flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
            inputMode === "upload"
              ? "bg-violet-500 text-slate-900 shadow-lg shadow-violet-500/20"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          <Upload className="w-4 h-4" />
          Upload Audio
        </button>
      </motion.div>

      {/* Panel Content */}
      <AnimatePresence mode="wait">
        {/* UPLOAD PANEL */}
        {inputMode === "upload" && (
          <motion.div
            key="upload-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl z-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Upload Voice Recording
              </h1>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Recorded on your phone? Upload it here and our AI will
                <br />
                transcribe and summarize it for you.
              </p>
            </div>
            <AudioUploader
              onUploadComplete={(uploadedSessionId, fileName) => {
                setPipelineStep("TRANSCRIBING");
                console.info(
                  `Upload complete: ${fileName} → session ${uploadedSessionId}`,
                );
              }}
            />
          </motion.div>
        )}

        {/* RECORD PANEL */}
        {inputMode === "record" && (
          <motion.div
            key="record-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full z-10"
          >
            {/* Studio Indicator */}
            <div className="flex items-center gap-2 mb-14">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : pipelineStep !== "IDLE"
                      ? "bg-teal-500 animate-pulse"
                      : "bg-slate-700",
                )}
              />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
                {isRecording
                  ? "Recording Active"
                  : pipelineStep !== "IDLE"
                    ? "Processing…"
                    : "Studio Standby"}
              </span>
            </div>

            {/* Timer */}
            <div className="mb-10">
              <RecordingTimer seconds={duration} isRecording={isRecording} />
            </div>

            {/* Waveform Visualizer */}
            <div className="w-full max-w-2xl h-24 flex items-center justify-center gap-1 mb-14 overflow-hidden">
              {BAR_HEIGHTS.map((maxH, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isRecording ? [10, maxH, 10] : 8,
                    opacity: isRecording ? [0.3, 0.8, 0.3] : 0.2,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: BAR_DURATIONS[i],
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "w-1.5 rounded-full",
                    i % 3 === 0
                      ? "bg-teal-500"
                      : i % 3 === 1
                        ? "bg-emerald-500"
                        : "bg-teal-400",
                  )}
                  style={{ height: 8 }}
                />
              ))}
            </div>

            {/* Record / Stop Button */}
            <div className="flex items-center gap-8 mb-10">
              <motion.button
                id="btn-record-toggle"
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleRecord}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-colors shadow-2xl relative group",
                  isRecording
                    ? "bg-slate-900 border-2 border-red-500 text-red-500"
                    : "bg-teal-500 text-slate-950 hover:bg-teal-400",
                )}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 fill-current" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity",
                    isRecording ? "bg-red-500" : "bg-teal-500",
                  )}
                />
              </motion.button>
            </div>

            {/* Pipeline Status */}
            <AnimatePresence>
              {pipelineStep !== "IDLE" && pipelineStep !== "RECORDING" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="w-full max-w-md mb-8"
                >
                  <StatusIndicator step={pipelineStep} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Post-recording action buttons */}
            <AnimatePresence>
              {!isRecording && duration > 0 && pipelineStep === "UPLOADING" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex gap-4"
                >
                  <button className="px-8 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl transition-all flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Process &amp; Save
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-8 py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-2xl transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Discard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Invisible background uploader */}
            <ChunkUploader
              sessionId={sessionId}
              onChunkUploaded={(idx, total) =>
                console.info(`Chunk ${idx + 1}/${total} uploaded`)
              }
              onError={(err) => console.error("Chunk upload error:", err)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Settings Bar */}
      <div className="fixed bottom-24 md:bottom-8 flex flex-col sm:flex-row items-center gap-3 text-slate-500 text-xs font-medium z-10 w-full sm:w-auto px-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-800">
          <Languages className="w-3.5 h-3.5" />
          Indonesian (Auto-detect)
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-800">
          <Settings2 className="w-3.5 h-3.5" />
          Whisper Large-v3
        </div>
      </div>
    </div>
  );
}
