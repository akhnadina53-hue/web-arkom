"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";

export const ACCENT_PRESETS = [
  { id: "smurf",    hex: "#A7D7C5", label: "Smurf Green" },
  { id: "moss",     hex: "#74B49B", label: "Deep Moss" },
  { id: "snitch",   hex: "#F4A261", label: "Golden Snitch" },
  { id: "sky",      hex: "#5B9BD5", label: "Sky Blue" },
  { id: "lavender", hex: "#A89BD9", label: "Lavender" },
  { id: "coral",    hex: "#E07B7B", label: "Coral Rose" },
] as const;

interface AccentColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function AccentColorPicker({ value, onChange }: AccentColorPickerProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_PRESETS.map(({ id, hex, label }) => {
        const isActive = value === hex;
        return (
          <button
            key={id}
            onClick={() => onChange(hex)}
            aria-label={label}
            title={label}
            className="relative w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform"
            style={{
              background: hex,
              boxShadow: isActive
                ? `0 0 0 3px var(--bg-page), 0 0 0 5px ${hex}`
                : "var(--shadow-sm)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            {isActive && (
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 25 }
                }
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );
}
