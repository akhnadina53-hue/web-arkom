import { create } from 'zustand';
import type { RecordingState } from '@/types';

interface RecordingStore extends RecordingState {
  setIsRecording: (isRecording: boolean) => void;
  setDuration: (duration: number) => void;
  setTranscript: (transcript: string) => void;
  addChunk: (chunk: Blob) => void;
  reset: () => void;
}

const initialState: RecordingState = {
  isRecording: false,
  duration: 0,
  transcript: '',
  chunks: [],
};

export const useRecordingStore = create<RecordingStore>((set) => ({
  ...initialState,

  setIsRecording: (isRecording) => set({ isRecording }),
  setDuration: (duration) => set({ duration }),
  setTranscript: (transcript) => set({ transcript }),
  
  addChunk: (chunk) =>
    set((state) => ({
      chunks: [...state.chunks, chunk],
    })),

  reset: () => set(initialState),
}));
