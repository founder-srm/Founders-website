'use client';

import { createClient } from '@/utils/supabase/client';
import { useSessionStore } from '@/stores/session';
import { useEffect } from 'react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSessionStore((state) => state.setUser);
  const setSession = useSessionStore((state) => state.setSession);
  const setLoading = useSessionStore((state) => state.setLoading);

  useEffect(() => {
    const supabase = createClient();

    async function getServerSession() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      setUser(user);
      setSession(session);
      setLoading(false);
    }

    // Initial session fetch
    getServerSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading]);

  return children;
}
