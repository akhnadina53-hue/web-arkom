import { create } from "zustand";
import type { RecordingSession } from "@/types";

interface SessionStore {
  sessions: RecordingSession[];
  currentSession: RecordingSession | null;
  setSessions: (sessions: RecordingSession[]) => void;
  setCurrentSession: (session: RecordingSession | null) => void;
  addSession: (session: RecordingSession) => void;
  updateSession: (id: string, session: Partial<RecordingSession>) => void;
  removeSession: (id: string) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  currentSession: null,

  setSessions: (sessions) => set({ sessions }),

  setCurrentSession: (session) => set({ currentSession: session }),

  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
      currentSession:
        state.currentSession?.id === id
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
    })),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      currentSession:
        state.currentSession?.id === id ? null : state.currentSession,
    })),
}));
