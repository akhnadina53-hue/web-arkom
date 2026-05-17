'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppReducedMotion } from '@/lib/hooks/useAppReducedMotion';
import { Mic } from 'lucide-react';

export type LogoState = 'idle' | 'hover' | 'loading' | 'success';

interface FrenEduLogoProps {
  size?: number;     
  state?: LogoState;   
  showText?: boolean; 
  className?: string;
}

function StaticLogo({ size, showText }: { size: number; showText: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))',
          boxShadow: 'var(--shadow-glow-sm)',
        }}
      >
        <Mic className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
      </div>
      {showText && (
        <span
          className="font-display font-bold select-none"
          style={{
            fontSize: size * 0.425,
            background: 'linear-gradient(135deg, var(--color-smurf-400), var(--color-smurf-300))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Fren-Edu
        </span>
      )}
    </div>
  );
}

export function FrenEduLogo({ size = 40, state = 'idle', showText = true, className }: FrenEduLogoProps) {
  const shouldReduceMotion = useAppReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  if (shouldReduceMotion) {
    return <StaticLogo size={size} showText={showText} />;
  }

  const currentState = state !== 'idle' ? state : isHovered ? 'hover' : 'idle';

  return (
    <motion.div
      className={`flex items-center gap-2 cursor-pointer ${className ?? ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Icon container */}
      <motion.div
        animate={
          currentState === 'loading' ? {
            scale: [1, 1.08, 1],
            transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          } : currentState === 'success' ? {
            scale: [1, 1.15, 1],
            transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
          } : currentState === 'hover' ? {
            scale: 1.08,
            y: 0,
            filter: 'drop-shadow(0 0 12px rgba(167, 215, 197, 0.6))',
            transition: { type: 'spring', stiffness: 400, damping: 20 },
          } : {
            // IDLE
            y: [0, -4, 0],
            filter: 'drop-shadow(0 0 6px rgba(167, 215, 197, 0.3))',
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }
        }
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))',
          boxShadow: 'var(--shadow-glow-sm)',
        }}
      >
        <Mic
          className="text-white transition-colors"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            color: currentState === 'success' ? 'var(--success)' : 'white',
          }}
        />
      </motion.div>

      {/* Wordmark */}
      {showText && (
        <motion.span
          className="font-display font-bold select-none"
          style={{
            fontSize: size * 0.425,
            background: 'linear-gradient(135deg, var(--color-smurf-400), var(--color-smurf-300))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{ opacity: 1 }}
        >
          Fren-Edu
        </motion.span>
      )}
    </motion.div>
  );
}
