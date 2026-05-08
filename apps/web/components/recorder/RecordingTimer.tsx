"use client";

import { cn } from "@/lib/utils";

interface RecordingTimerProps {
  seconds: number;
  isRecording: boolean;
  className?: string;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function RecordingTimer({ seconds, isRecording, className }: RecordingTimerProps) {
  return (
    <div className={cn("text-center select-none", className)}>
      {/* Main timer digits */}
      <div
        className={cn(
          "text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tighter tabular-nums transition-all duration-300",
          isRecording ? "text-white" : "text-slate-600"
        )}
      >
        {formatTime(seconds)}
      </div>

      {/* Sub-label */}
      <p
        className={cn(
          "mt-3 text-xs font-bold tracking-[0.25em] uppercase transition-colors",
          isRecording ? "text-red-400 animate-pulse" : "text-slate-600"
        )}
      >
        {isRecording ? "● Recording" : seconds > 0 ? "Paused" : "Ready to record"}
      </p>
    </div>
  );
}
