"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,            
  x: Math.random() * 100,                   
  y: Math.random() * 100,
  duration: Math.random() * 6 + 5,  
  delay: Math.random() * 4,
  opacity: Math.random() * 0.35 + 0.1,  
}));

const EQ_BARS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  height: Math.random() * 28 + 10,        
  duration: Math.random() * 0.6 + 0.5,  
  delay: Math.random() * 0.5,
}));

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-16"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Soft gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-8%] left-[-8%] w-[50%] h-[50%] rounded-full blur-[150px]"
          style={{ background: "rgba(94,234,212,0.13)" }}
        />
        <div
          className="absolute bottom-[-8%] right-[-8%] w-[45%] h-[45%] rounded-full blur-[150px]"
          style={{ background: "rgba(20,184,166,0.09)" }}
        />
        <div
          className="absolute top-[35%] right-[8%] w-[22%] h-[22%] rounded-full blur-[100px]"
          style={{ background: "rgba(245,158,11,0.07)" }}
        />
      </div>

      {/* Floating particles / bintang */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.id % 4 === 0
                ? "rgba(245,158,11,0.55)"  
                : "rgba(20,184,166,0.50)",   
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.id % 4 === 0 ? "rgba(245,158,11,0.4)" : "rgba(20,184,166,0.35)"}`,
            }}
            animate={{
              y: [0, -(8 + p.id % 10), 0],
              opacity: [p.opacity, p.opacity * 2.2, p.opacity],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Equalizer bars (kiri bawah) ── */}
      <div
        className="absolute bottom-16 left-10 flex items-end gap-1.5 pointer-events-none"
        style={{ opacity: 0.18 }}
      >
        {EQ_BARS.map((bar) => (
          <motion.div
            key={bar.id}
            className="rounded-full"
            style={{
              width: 4,
              height: bar.height,
              background: "linear-gradient(to top, var(--color-smurf-400), var(--color-smurf-300))",
            }}
            animate={{
              height: [
                bar.height,
                bar.height * (0.3 + Math.random() * 1.8),
                bar.height * (0.5 + Math.random()),
                bar.height,
              ],
            }}
            transition={{
              duration: bar.duration,
              delay: bar.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Equalizer bars (kanan atas — cermin, lebih kecil) ── */}
      <div
        className="absolute top-12 right-10 flex items-end gap-1 pointer-events-none"
        style={{ opacity: 0.12 }}
      >
        {EQ_BARS.slice(0, 8).map((bar) => (
          <motion.div
            key={bar.id}
            className="rounded-full"
            style={{
              width: 3,
              height: bar.height * 0.6,
              background: "linear-gradient(to top, rgba(245,158,11,0.9), rgba(245,158,11,0.4))",
            }}
            animate={{
              height: [
                bar.height * 0.6,
                bar.height * (0.2 + Math.random() * 1.4),
                bar.height * 0.4,
                bar.height * 0.6,
              ],
            }}
            transition={{
              duration: bar.duration * 1.2,
              delay: bar.delay + 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-10 flex items-center gap-3"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5EEAD4, #14B8A6)",
              boxShadow: "0 6px 20px rgba(20,184,166,0.35)",
            }}
          >
            <Mic className="w-5 h-5 text-white" />
          </motion.div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Fren-Edu
          </span>
        </Link>
      </motion.div>

      {/* ── Content (form card) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full flex items-center justify-center z-10 px-4"
      >
        {children}
      </motion.div>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 relative z-10 text-xs tracking-widest uppercase"
        style={{ color: "var(--text-tertiary)" }}
      >
        © 2026 Fren-Edu • Built for smarter learning
      </motion.footer>
    </div>
  );
}
