import type { User, Session } from '@supabase/supabase-js';
import { create } from 'zustand';

interface SessionState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionState>()(set => ({
  user: null,
  session: null,
  loading: true,
  setUser: user => set({ user }),
  setSession: session => set({ session }),
  setLoading: loading => set({ loading }),
}));

// Utility hooks
export const useUser = () => useSessionStore(state => state.user);
export const useSession = () => useSessionStore(state => state.session);
export const useIsLoading = () => useSessionStore(state => state.loading);
