"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthCard({
  children,
  title,
  description,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md p-8 md:p-10 rounded-[28px] relative overflow-hidden",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(20,184,166,0.15)",

        boxShadow:
          "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.9) inset, 0 24px 64px rgba(20,184,166,0.08)",
      }}
    >
      {/* Decorative corner glow */}
      <div
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(94,234,212,0.10)" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(20,184,166,0.06)" }}
      />

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-1"
          style={{ color: "#111827" }}  
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8 text-sm leading-relaxed"
            style={{ color: "#374151" }}  
          >
            {description}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
