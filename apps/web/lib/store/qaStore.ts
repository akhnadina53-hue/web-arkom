import { create } from "zustand";
import type { QAItem } from "@/types";

interface QAStore {
  qaItems: QAItem[];
  currentQuestion: QAItem | null;
  score: number;

  setQAItems: (items: QAItem[]) => void;
  setCurrentQuestion: (item: QAItem | null) => void;
  addQAItem: (item: QAItem) => void;
  updateQAItem: (id: string, updates: Partial<QAItem>) => void;
  calculateScore: () => void;
  reset: () => void;
}

export const useQAStore = create<QAStore>((set, get) => ({
  qaItems: [],
  currentQuestion: null,
  score: 0,

  setQAItems: (items) => set({ qaItems: items }),

  setCurrentQuestion: (item) => set({ currentQuestion: item }),

  addQAItem: (item) =>
    set((state) => ({
      qaItems: [...state.qaItems, item],
    })),

  updateQAItem: (id, updates) =>
    set((state) => ({
      qaItems: state.qaItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),

  calculateScore: () => {
    set((state) => {
      const answered = state.qaItems.filter((item) => item.score !== undefined);
      const total = answered.reduce((sum, item) => sum + (item.score || 0), 0);
      const average =
        answered.length > 0 ? Math.round(total / answered.length) : 0;
      return { score: average };
    });
  },

  reset: () =>
    set({
      qaItems: [],
      currentQuestion: null,
      score: 0,
    }),
}));
