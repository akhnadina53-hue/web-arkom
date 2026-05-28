"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";

interface SaveBarProps {
  visible: boolean;
  onSave: () => void;
  onDiscard: () => void;

  message?: string;
  saveLabel?: string;
  discardLabel?: string;
}

export function SaveBar({
  visible,
  onSave,
  onDiscard,
  message = "Perubahan belum disimpan",
  saveLabel = "Simpan",
  discardLabel = "Batal",
}: SaveBarProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduceMotion ? false : { y: 32, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: 32, opacity: 0, scale: 0.95 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 28 }
          }
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl -translate-x-1/2"
          style={{
            background: "var(--bg-card-glass)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(167,215,197,0.55)",
            boxShadow: "var(--shadow-glow-lg), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: "var(--color-snitch-400)" }} />
          <p className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
            {message}
          </p>
          <button
            onClick={onDiscard}
            className="text-sm font-semibold transition-colors ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {discardLabel}
          </button>
          <button
            onClick={onSave}
            className="btn-save text-sm px-5 py-1.5 rounded-xl"
          >
            {saveLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
