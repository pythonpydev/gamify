import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  clearError: () => void;
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true });

        try {
          const supabase = createClient();
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error('Failed to get session:', error);
            set({ isLoading: false, isInitialized: true, error: error.message });
            return;
          }

          set({
            user: session?.user ?? null,
            session,
            isLoading: false,
            isInitialized: true,
            error: null,
          });

          // Set up auth state listener
          supabase.auth.onAuthStateChange((event, session) => {
            set({
              user: session?.user ?? null,
              session,
            });
          });
        } catch (err) {
          console.error('Auth initialization error:', err);
          set({
            isLoading: false,
            isInitialized: true,
            error: 'Failed to initialize authentication',
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          set({
            user: data.user,
            session: data.session,
            isLoading: false,
            error: null,
          });

          return {};
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Login failed';
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          // If email confirmation is required, user will be null
          if (data.user && !data.user.email_confirmed_at) {
            set({ isLoading: false, error: null });
            return {}; // Success - check email for confirmation
          }

          set({
            user: data.user,
            session: data.session,
            isLoading: false,
            error: null,
          });

          return {};
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();
          await supabase.auth.signOut();

          set({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          console.error('Logout error:', err);
          // Still clear local state even if API call fails
          set({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          set({ isLoading: false, error: null });
          return {};
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      updatePassword: async (newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          set({ isLoading: false, error: null });
          return {};
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Password update failed';
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user }),

      setSession: (session) => set({ session, user: session?.user ?? null }),
    }),
    {
      name: 'study-poker-auth',
      partialize: (state) => ({
        // Only persist minimal data, actual session is managed by Supabase
        isInitialized: state.isInitialized,
      }),
    }
  )
);
