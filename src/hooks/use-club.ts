import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ClubCheckProps {
  user: User | null;
}

interface ClubData {
  id: string;
  user_id: string;
  club_name: string;
  club_email: string;
  // club_phone: string;
  // club_logo: string | null;
  // club_description: string | null;
  created_at: string | null;
  updated_at: string | null;
  verified_at: string | null;
  // [key: string]: any;
}

const useClub = ({ user }: ClubCheckProps) => {
  const [isClub, setIsClub] = useState(false);
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkClub() {
      if (!user) {
        setIsClub(false);
        setClub(null);
        setLoading(false);
        return;
      }

      try {
        const { data: clubUser, error } = await supabase
          .from('club_representatives').select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !clubUser || clubUser.user_id !== user.id) {
          console.log('Club check error:', error);
          setIsClub(false);
          setClub(null);
          setLoading(false);
          return;
        }

        console.log('User is a club:', user.email);
        setIsClub(true);
        setClub(clubUser);
        setLoading(false);
      } catch (error) {
        console.error('Admin check error:', error);
        setIsClub(false);
        setClub(null);
        setLoading(false);
      }
    }

    checkClub();
  }, [user, supabase]);

  return { isClub, club, loading };
};

export default useClub;
