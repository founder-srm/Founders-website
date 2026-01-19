import type { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserRolesStore } from '@/stores/user-roles';

interface AdminCheckProps {
  user: User | null;
}

const useAdmin = ({ user }: AdminCheckProps) => {
  const { 
    isAdmin, 
    adminLoading, 
    adminFetchedForUserId, 
    setAdminState, 
    setAdminLoading 
  } = useUserRolesStore();
  
  // Use ref for supabase client to avoid recreating on every render
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    // Skip if we've already fetched for this user
    if (user?.id === adminFetchedForUserId) {
      return;
    }

    async function checkAdmin() {
      if (!user) {
        setAdminState(false, null);
        return;
      }

      setAdminLoading(true);

      try {
        const { data: adminUser, error } = await supabaseRef.current
          .from('adminuseraccount')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        if (error || !adminUser || adminUser.user_role === 'user') {
          setAdminState(false, user.id);
          return;
        }

        console.log('User is an admin:', user.email);
        setAdminState(true, user.id);
      } catch (error) {
        console.error('Admin check error:', error);
        setAdminState(false, user.id);
      }
    }

    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return { isAdmin, loading: adminLoading };
};

export default useAdmin;
