import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      activeTab: 'transcript',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'frenedu-ui-store',
    }
  )
);
