"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  staggerOffset?: number;
}

export function SettingsGroup({
  title,
  description,
  children,
  className,
  staggerOffset = 0,
}: SettingsGroupProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: staggerOffset * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`mb-8 ${className ?? ""}`}
    >
      {/* Section label */}
      <div className="mb-3 px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#74B49B]">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>

      {/* Glass card */}
      <motion.div
        whileHover={{ scale: 1.01, y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="overflow-hidden rounded-2xl"
        style={{
          background: "rgba(246,251,249,0.80)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(167,215,197,0.35)",
          boxShadow: "0 4px 24px rgba(167,215,197,0.10)",
        }}
        whileHover-style={{
          boxShadow: "0 10px 36px rgba(167,215,197,0.40)",
        }}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.32,
              delay: staggerOffset * 0.12 + i * 0.07,
              ease: "easeOut",
            }}
            className="px-5 border-b border-[rgba(167,215,197,0.2)] last:border-0"
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
