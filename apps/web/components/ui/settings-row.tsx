"use client";

import { motion } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function SettingsRow({
  label,
  description,
  children,
  className,
  htmlFor,
}: SettingsRowProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <motion.div
      className={`flex items-center justify-between py-3 px-2 rounded-xl ${className ?? ""}`}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              backgroundColor: "var(--color-smurf-100)",
              transition: { duration: 0.15 },
            }
      }
    >
      <div className="flex-1 min-w-0 mr-4">
        {htmlFor ? (
          <label
            htmlFor={htmlFor}
            className="text-[14px] font-medium block cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </label>
        ) : (
          <p
            className="text-[14px] font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </p>
        )}
        {description && (
          <p
            className="text-[13px] mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </motion.div>
  );
}
