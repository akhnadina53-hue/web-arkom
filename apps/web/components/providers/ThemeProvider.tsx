"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    const applyDark = () => root.classList.add("dark");
    const applyLight = () => root.classList.remove("dark");

    if (settings.theme === "dark") {
      applyDark();
    } else if (settings.theme === "light") {
      applyLight();
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.matches ? applyDark() : applyLight();

      const handler = (e: MediaQueryListEvent) =>
        e.matches ? applyDark() : applyLight();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
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
