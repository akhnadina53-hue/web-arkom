"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { AlertTriangle } from "lucide-react";

interface DangerZoneProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function DangerZone({
  title = "Danger Zone",
  description,
  children,
}: DangerZoneProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="mb-3 px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5"
          style={{ color: "var(--error)" }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {title}
        </h3>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
      </div>

      <div
        className="overflow-hidden rounded-2xl p-5"
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid rgba(224, 92, 92, 0.25)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}
