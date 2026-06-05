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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full max-w-md p-8 glass rounded-3xl shadow-2xl relative overflow-hidden group",
        className,
      )}
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 blur-3xl rounded-full group-hover:bg-teal-500/20 transition-colors" />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        {description && <p className="text-slate-400 mb-8">{description}</p>}
        {children}
      </div>
    </motion.div>
  );
}
