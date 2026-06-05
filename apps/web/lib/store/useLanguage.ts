import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "../i18n/dictionaries";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "id",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((state) => ({
          locale: state.locale === "id" ? "en" : "id",
        })),
    }),
    {
      name: "arkom-language-storage",
    },
  ),
);
