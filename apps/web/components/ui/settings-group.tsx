"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { EASING } from "@/lib/motion/constants";

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  staggerOffset?: number;
  glass?: boolean;
}

export function SettingsGroup({
  title,
  description,
  children,
  className,
  staggerOffset = 0,
  glass = false,
}: SettingsGroupProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useAppReducedMotion();

  const entryAnimation = shouldReduceMotion
    ? {
        opacity: 1,
        y: 0,
      }
    : isInView
      ? {
          opacity: 1,
          y: 0,
        }
      : {
          opacity: 0,
          y: 18,
        };

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={entryAnimation}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.45,
              delay: staggerOffset * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      className={`mb-8 ${className ?? ""}`}
    >
      {/* Section label */}
      <div className="mb-3 px-1">
        <h3
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-smurf-400)" }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Card */}
      <motion.div
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                y: -2,
                boxShadow: "var(--shadow-lg), var(--shadow-glow-sm)",
                borderColor: "var(--color-smurf-300)",
                transition: { type: "spring", stiffness: 300, damping: 28 },
              }
        }
        className="overflow-hidden rounded-2xl"
        style={
          glass
            ? {
                background: "var(--bg-card-glass)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(167,215,197,0.25)",
                boxShadow: "var(--shadow-md)",
              }
            : {
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-sm)",
              }
        }
      >
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, x: 0 }
                : isInView
                  ? { opacity: 1, x: 0 }
                  : {}
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.32,
                    delay: staggerOffset * 0.12 + i * 0.07,
                    ease: "easeOut",
                  }
            }
            className="px-5 border-b last:border-0"
            style={{ borderColor: "var(--border-default)" }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
