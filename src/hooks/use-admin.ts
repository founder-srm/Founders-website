import type { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AdminCheckProps {
  user: User | null;
}

const useAdmin = ({ user }: AdminCheckProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data: adminUser, error } = await supabase
          .from('adminuseraccount')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        if (error || !adminUser || adminUser.user_role === 'user') {
          console.error('Admin check error:', error);
          setIsAdmin(false);
          return;
        }

        console.log('User is an admin:', user.email);
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, [user, supabase]);

  return isAdmin;
};

export default useAdmin;
