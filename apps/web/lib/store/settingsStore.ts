// lib/store/settingsStore.ts
// ─────────────────────────────────────────────────────────────────
// User settings store — localStorage for now, API-ready template.
// Source: CLAUDE-DESIGN.md Section 13
// ─────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

export interface UserSettings {
  theme: ThemeMode;
  accent_color: string;
  font_size: number;
  reduced_motion: boolean;
  language: string;
}

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  isDirty: boolean;

  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => void;
  resetSettings: () => void;
  markClean: () => void;

  // API TEMPLATE
  // TODO: Implement these when backend is ready
  // fetchSettings: () => Promise<void>;
  // saveSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  accent_color: "#A7D7C5",
  font_size: 100,
  reduced_motion: false,
  language: "id",
};

// API Template (uncomment when backend is ready)
//
// async function fetchSettingsFromAPI(): Promise<UserSettings> {
//   const res = await fetch("/api/settings", { credentials: "include" });
//   if (!res.ok) throw new Error("Failed to fetch settings");
//   return res.json();
// }
//
// async function saveSettingsToAPI(settings: UserSettings): Promise<void> {
//   const res = await fetch("/api/settings", {
//     method: "PUT",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(settings),
//   });
//   if (!res.ok) throw new Error("Failed to save settings");
// }

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: { ...DEFAULT_SETTINGS },
      isLoading: false,
      isDirty: false,

      updateSetting: (key, value) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
          isDirty: true,
        }));
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS }, isDirty: false });
      },

      markClean: () => {
        set({ isDirty: false });
      },

      // TODO: Implement when backend API is ready
      // fetchSettings: async () => {
      //   set({ isLoading: true });
      //   try {
      //     const settings = await fetchSettingsFromAPI();
      //     set({ settings, isLoading: false, isDirty: false });
      //   } catch (error) {
      //     console.error("Failed to fetch settings:", error);
      //     set({ isLoading: false });
      //   }
      // },
      //
      // saveSettings: async () => {
      //   const { settings } = get();
      //   set({ isLoading: true });
      //   try {
      //     await saveSettingsToAPI(settings);
      //     set({ isLoading: false, isDirty: false });
      //   } catch (error) {
      //     console.error("Failed to save settings:", error);
      //     set({ isLoading: false });
      //     throw error;
      //   }
      // },
    }),
    {
      name: "fren-edu-settings",
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
