import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionTypeName } from '@/types/database';

export interface ActiveSession {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  sessionType: SessionTypeName;
  durationMins: number;
  startTime: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

interface SessionState {
  activeSession: ActiveSession | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startSession: (session: ActiveSession) => void;
  completeSession: (qualityRating: number, chipsEarned: number) => void;
  abandonSession: () => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      activeSession: null,
      isLoading: false,
      error: null,

      startSession: (session) => {
        set({
          activeSession: session,
          isLoading: false,
          error: null,
        });
      },

      completeSession: (_qualityRating, _chipsEarned) => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, status: 'COMPLETED' as const }
            : null,
          isLoading: false,
        }));
      },

      abandonSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, status: 'ABANDONED' as const }
            : null,
        }));
      },

      clearSession: () => {
        set({
          activeSession: null,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },
    }),
    {
      name: 'study-poker-session',
      partialize: (state) => ({
        activeSession: state.activeSession,
      }),
    }
  )
);
