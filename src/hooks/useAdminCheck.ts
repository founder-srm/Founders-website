import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useUserRolesStore } from '@/stores/user-roles';
import { createClient } from '@/utils/supabase/client';

export const useAdminCheck = () => {
  const router = useRouter();
  const {
    isAdmin,
    adminLoading,
    adminFetchedForUserId,
    setAdminState,
    setAdminLoading,
  } = useUserRolesStore();

  const supabaseRef = useRef(createClient());
  const hasChecked = useRef(false);

  useEffect(() => {
    // If we've already checked and have a result, use it
    if (adminFetchedForUserId !== null && !adminLoading) {
      if (!isAdmin) {
        router.push('/');
      }
      return;
    }

    // Prevent duplicate checks
    if (hasChecked.current) {
      return;
    }

    async function checkAdminStatus() {
      hasChecked.current = true;

      try {
        const {
          data: { user },
        } = await supabaseRef.current.auth.getUser();

        if (!user) {
          setAdminState(false, null);
          router.push('/auth/login');
          return;
        }

        const { data: adminUser, error } = await supabaseRef.current
          .from('adminuseraccount')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        if (error || !adminUser || adminUser.user_role === 'user') {
          setAdminState(false, user.id);
          router.push('/');
          return;
        }

        setAdminState(true, user.id);
      } catch (error) {
        console.error('Admin check error:', error);
        setAdminState(false, null);
        router.push('/');
      }
    }

    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminFetchedForUserId, adminLoading, isAdmin]);

  return { isLoading: adminLoading };
};
