"use client";

import { motion } from "framer-motion";
import { badgeReveal } from "@/lib/motion/variants";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "accent" | "brand";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  animated?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-smurf-100)] text-[var(--color-smurf-600)] border-[var(--color-smurf-200)]",
  success:
    "bg-[rgba(82,183,136,0.10)] text-[var(--success)] border-[rgba(82,183,136,0.25)]",
  warning:
    "bg-[rgba(244,162,97,0.10)] text-[var(--color-snitch-500)] border-[rgba(244,162,97,0.25)]",
  accent:
    "bg-[rgba(244,162,97,0.10)] text-[var(--color-snitch-400)] border-[rgba(244,162,97,0.25)]",
  brand:
    "bg-[var(--color-smurf-100)] text-[var(--color-smurf-700)] border-[var(--border-brand)]",
};

export function Badge({
  children,
  variant = "default",
  animated = false,
  icon,
  className,
}: BadgeProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const badgeContent = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </>
  );

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
    "text-[11px] font-bold uppercase tracking-[1.5px] border",
    "font-display select-none",
    variantStyles[variant],
    className,
  );

  if (animated && !shouldReduceMotion) {
    return (
      <motion.span
        variants={badgeReveal}
        initial="hidden"
        animate="visible"
        className={baseClasses}
      >
        {badgeContent}
      </motion.span>
    );
  }

  return <span className={baseClasses}>{badgeContent}</span>;
}
