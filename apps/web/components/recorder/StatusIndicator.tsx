"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, AlertCircle, Clock } from "lucide-react";

export type PipelineStep =
  | "IDLE"
  | "RECORDING"
  | "UPLOADING"
  | "PROCESSING"
  | "TRANSCRIBING"
  | "SUMMARIZING"
  | "DONE"
  | "ERROR";

const STEP_ORDER: PipelineStep[] = [
  "RECORDING",
  "UPLOADING",
  "TRANSCRIBING",
  "SUMMARIZING",
  "DONE",
];

const STEP_LABELS: Record<PipelineStep, string> = {
  IDLE: "Standby",
  RECORDING: "Recording",
  UPLOADING: "Uploading chunks",
  PROCESSING: "Processing audio",
  TRANSCRIBING: "Transcribing with Whisper",
  SUMMARIZING: "Generating summary",
  DONE: "Complete",
  ERROR: "Failed",
};

interface StatusIndicatorProps {
  step: PipelineStep;
  errorMessage?: string;
  className?: string;
}

export function StatusIndicator({ step, errorMessage, className }: StatusIndicatorProps) {
  if (step === "IDLE") return null;

  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Status Badge */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide w-fit mx-auto mb-6",
          step === "DONE"
            ? "bg-emerald-500/15 text-emerald-400"
            : step === "ERROR"
              ? "bg-red-500/15 text-red-400"
              : "bg-teal-500/15 text-teal-400"
        )}
      >
        {step === "DONE" ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : step === "ERROR" ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        )}
        {STEP_LABELS[step]}
      </div>

      {/* Step Progress Track */}
      {step !== "RECORDING" && step !== "ERROR" && (
        <div className="flex items-center gap-1">
          {STEP_ORDER.filter((s) => s !== "RECORDING").map((s, i) => {
            const stepIdx = STEP_ORDER.indexOf(s);
            const isDone = stepIdx < currentIndex;
            const isCurrent = s === step;

            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "h-1 w-full rounded-full transition-all duration-500",
                    isDone || isCurrent
                      ? "bg-teal-500"
                      : "bg-slate-800"
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] font-semibold tracking-wider hidden sm:block",
                    isCurrent ? "text-teal-400" : isDone ? "text-slate-500" : "text-slate-700"
                  )}
                >
                  {STEP_LABELS[s].split(" ")[0].toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Error message */}
      {step === "ERROR" && errorMessage && (
        <p className="text-center text-xs text-red-400/80 mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
