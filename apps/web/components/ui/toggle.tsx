"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { triggerParticleBurst } from "@/lib/motion/particles";

interface Particle {
  id: number;
  tx: string;
  ty: string;
  color: string;
}

interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  "aria-label"?: string;
  disabled?: boolean;
  isFirstActivation?: boolean;
}

const COLORS = ["#A7D7C5", "#74B49B", "#F4A261", "#A7D7C5"];

export function Toggle({
  id,
  checked,
  onChange,
  "aria-label": ariaLabel,
  disabled,
  isFirstActivation = false,
}: ToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const shouldReduceMotion = useAppReducedMotion();

  const spawnParticles = useCallback(() => {
    if (shouldReduceMotion) return;

    const burst: Particle[] = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 20 + Math.random() * 14;
      return {
        id: nextId.current++,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist}px`,
        color: COLORS[i % COLORS.length],
      };
    });
    setParticles((p) => [...p, ...burst]);
    setTimeout(() => {
      setParticles((p) => p.filter((x) => !burst.find((b) => b.id === x.id)));
    }, 600);
  }, [shouldReduceMotion]);

  const handleToggle = () => {
    if (disabled) return;
    const next = !checked;
    onChange(next);
    if (next && isFirstActivation) {
      spawnParticles();
      if (buttonRef.current) {
        triggerParticleBurst(buttonRef.current);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Particle layer */}
      {!shouldReduceMotion && (
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0,
                x: p.tx,
                y: p.ty,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: p.color,
                pointerEvents: "none",
                left: "50%",
                top: "50%",
                marginLeft: -3,
                marginTop: -3,
                zIndex: 10,
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Track */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        style={{
          background: checked
            ? "linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))"
            : "var(--border-default)",
          boxShadow: checked ? "var(--shadow-glow-sm)" : "none",
        }}
      >
        {/* Thumb */}
        <motion.span
          layout
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 30 }
          }
          className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md"
          style={{ translateX: checked ? 22 : 4 }}
        />
      </button>
    </div>
  );
}
