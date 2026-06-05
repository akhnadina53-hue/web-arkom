"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[140px]"
          style={{ background: "rgba(94,234,212,0.12)" }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[140px]"
          style={{ background: "rgba(20,184,166,0.08)" }} />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full blur-[100px]"
          style={{ background: "rgba(245,158,11,0.06)" }} />
      </div>

      {/* Logo di atas */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-10 flex items-center gap-3"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5EEAD4, #14B8A6)",
              boxShadow: "0 6px 20px rgba(20,184,166,0.30)",
            }}
          >
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Fren-Edu
          </span>
        </Link>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full flex items-center justify-center z-10 px-4"
      >
        {children}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 relative z-10 text-xs tracking-widest uppercase"
        style={{ color: "var(--text-tertiary)" }}
      >
        © 2026 Fren-Edu • Built for smarter learning
      </motion.footer>
    </div>
  );
}
