"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  username?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isEditable?: boolean;
  onAvatarClick?: () => void;
  onBannerClick?: () => void;
}

export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bannerUrl,
  isEditable = false,
  onAvatarClick,
  onBannerClick,
}: ProfileHeaderProps) {
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <motion.div
      variants={fadeInUp}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="relative mb-16"
    >
      {/* Banner */}
      <div
        className="relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group"
        onClick={isEditable ? onBannerClick : undefined}
        style={{
          background: bannerUrl
            ? `url(${bannerUrl}) center/cover no-repeat`
            : "linear-gradient(135deg, var(--color-smurf-200), var(--color-smurf-400))",
        }}
      >
        {isEditable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Avatar — overlaps banner */}
      <div className="absolute -bottom-12 left-6">
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
          style={{
            border: "4px solid var(--bg-page)",
            boxShadow: "var(--shadow-lg)",
          }}
          onClick={isEditable ? onAvatarClick : undefined}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-display font-bold text-2xl"
              style={{
                background: "linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))",
                color: "white",
              }}
            >
              {name[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          {isEditable && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center rounded-full">
              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Name + username — glassmorphism overlay */}
      <div className="absolute -bottom-12 left-36 sm:left-36">
        <h1
          className="font-display font-bold text-xl"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h1>
        {username && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            @{username}
          </p>
        )}
      </div>
    </motion.div>
  );
}
