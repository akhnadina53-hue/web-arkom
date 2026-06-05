"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, [settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const hex = settings.accent_color;

    root.style.setProperty("--brand-primary", hex);
    root.style.setProperty("--border-brand", hex);
    root.style.setProperty("--border-focus", hex);

    root.style.setProperty("--shadow-glow-sm", `0 0 12px ${hex}59`);
    root.style.setProperty("--shadow-glow-md", `0 0 24px ${hex}73`);
  }, [settings.accent_color]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-size-scale",
      `${settings.font_size}%`,
    );
  }, [settings.font_size]);

  return <>{children}</>;
}
