"use client";

import { useReducedMotion } from "framer-motion";
import { useSettingsStore } from "@/lib/store/settingsStore";

export function useAppReducedMotion(): boolean {
  const systemReducedMotion = useReducedMotion();
  const appReducedMotion = useSettingsStore(
    (s) => s.settings?.reduced_motion ?? false,
  );
  return (systemReducedMotion ?? false) || appReducedMotion;
}
