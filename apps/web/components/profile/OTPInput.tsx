"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { otpBoxEntry } from "@/lib/motion/variants";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";

type OTPStatus = "idle" | "error" | "success";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  status?: OTPStatus;
  disabled?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  status = "idle",
  disabled = false,
}: OTPInputProps) {
  const shouldReduceMotion = useAppReducedMotion();
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const digit = e.target.value.replace(/\D/g, "").slice(-1);
      const newValue = value.split("");
      newValue[index] = digit;
      const joined = newValue.join("").slice(0, length);
      onChange(joined);

      if (digit && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        refs.current[index - 1]?.focus();
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      }
      if (e.key === "ArrowLeft" && index > 0) {
        refs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      onChange(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      refs.current[focusIndex]?.focus();
    },
    [onChange, length],
  );

  const getBoxState = (index: number) => {
    if (status === "error") return "error";
    if (status === "success") return "success";
    if (value[index]) return "filled";
    return "idle";
  };

  return (
    <div
      className="flex gap-3 justify-center"
      role="group"
      aria-label="Verification code input"
    >
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          variants={shouldReduceMotion ? undefined : otpBoxEntry}
          initial="idle"
          animate={getBoxState(i)}
          disabled={disabled}
          className="w-12 h-14 text-center font-mono font-medium text-[20px] rounded-xl border-2 outline-none transition-colors"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            borderColor:
              status === "error"
                ? "var(--error)"
                : status === "success"
                  ? "var(--success)"
                  : value[i]
                    ? "var(--border-focus)"
                    : "var(--border-default)",
          }}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
