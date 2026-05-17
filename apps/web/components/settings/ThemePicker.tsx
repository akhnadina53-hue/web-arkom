"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";

type ThemeOption = "light" | "dark" | "system";

interface ThemePickerProps {
  value: ThemeOption;
  onChange: (theme: ThemeOption) => void;
}

const themes: { id: ThemeOption; label: string; icon: typeof Sun }[] = [
  { id: "light",  label: "Light",  icon: Sun },
  { id: "dark",   label: "Dark",   icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <div className="flex gap-2">
      {themes.map(({ id, label, icon: Icon }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{
              color: isActive ? "var(--color-smurf-700)" : "var(--text-secondary)",
              background: isActive ? "var(--color-smurf-100)" : "transparent",
              border: isActive
                ? "1.5px solid var(--border-brand)"
                : "1.5px solid transparent",
            }}
          >
            {isActive && !shouldReduceMotion && (
              <motion.div
                layoutId="theme-active-bg"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "var(--color-smurf-100)",
                  border: "1.5px solid var(--border-brand)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10 text-xs font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
