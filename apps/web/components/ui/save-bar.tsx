"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SaveBarProps {
  visible: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ visible, onSave, onDiscard }: SaveBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 32, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 32, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(246,251,249,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(167,215,197,0.55)",
            boxShadow: "0 8px 32px rgba(167,215,197,0.25), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F4A261] animate-pulse shrink-0" />
          <p className="text-sm text-slate-600 font-medium whitespace-nowrap">
            Perubahan belum disimpan
          </p>
          <button
            onClick={onDiscard}
            className="text-sm text-slate-400 hover:text-slate-700 font-semibold transition-colors ml-1"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="btn-save text-sm px-5 py-1.5 rounded-xl"
          >
            Simpan
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
