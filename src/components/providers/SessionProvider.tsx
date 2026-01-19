'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';
import { useUserRolesStore } from '@/stores/user-roles';
import { createClient } from '@/utils/supabase/client';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSessionStore(state => state.setUser);
  const setSession = useSessionStore(state => state.setSession);
  const setLoading = useSessionStore(state => state.setLoading);
  const resetUserRoles = useUserRolesStore(state => state.reset);

  useEffect(() => {
    const supabase = createClient();

    async function getServerSession() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(user);
      setSession(session);
      setLoading(false);
    }

    // Initial session fetch
    getServerSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Reset user roles cache when user logs out or changes
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        resetUserRoles();
      }
      setUser(session?.user ?? null);
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, resetUserRoles]);

  return children;
}
