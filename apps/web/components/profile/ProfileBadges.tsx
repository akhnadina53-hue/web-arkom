"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion/variants";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { Badge } from "@/components/ui/Badge";
import { Award, GraduationCap, Shield, Star, Zap } from "lucide-react";

export interface ProfileBadge {
  id: string;
  label: string;
  variant?: "default" | "success" | "warning" | "accent" | "brand";
  icon?: string;
}

interface ProfileBadgesProps {
  badges: ProfileBadge[];
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  verified: <Shield className="w-3 h-3" />,
  student: <GraduationCap className="w-3 h-3" />,
  award: <Award className="w-3 h-3" />,
  star: <Star className="w-3 h-3" />,
  power: <Zap className="w-3 h-3" />,
};

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  const shouldReduceMotion = useAppReducedMotion();

  if (badges.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="flex flex-wrap gap-2"
    >
      {badges.map((badge) => (
        <Badge
          key={badge.id}
          variant={badge.variant ?? "default"}
          animated={!shouldReduceMotion}
          icon={badge.icon ? BADGE_ICONS[badge.icon] : undefined}
        >
          {badge.label}
        </Badge>
      ))}
    </motion.div>
  );
}
