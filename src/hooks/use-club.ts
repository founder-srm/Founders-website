import type { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserRolesStore } from '@/stores/user-roles';
import type { Database } from '../../database.types';

type ClubUserRole = Database['public']['Enums']['club_user_role'];

interface ClubCheckProps {
  user: User | null;
}

interface ClubData {
  id: string;
  name: string;
  email: string;
  website: string;
  profile_picture: string | null;
  created_at: string;
}

interface ClubUserData {
  id: string;
  user_id: string;
  club_id: string;
  email: string;
  user_role: ClubUserRole;
  is_verified: boolean;
  created_at: string;
  club: ClubData;
}

const useClub = ({ user }: ClubCheckProps) => {
  const {
    isClub,
    club,
    clubUser,
    userRole,
    clubLoading,
    clubFetchedForUserId,
    setClubState,
    setClubLoading,
  } = useUserRolesStore();
  
  // Use ref for supabase client to avoid recreating on every render
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    // Skip if we've already fetched for this user
    if (user?.id === clubFetchedForUserId) {
      return;
    }

    async function checkClub() {
      if (!user) {
        setClubState({
          isClub: false,
          club: null,
          clubUser: null,
          userRole: null,
          userId: null,
        });
        return;
      }

      setClubLoading(true);

      try {
        // Check if user is in clubuseraccount table (either as club_rep or member)
        const { data: clubUserData, error } = await supabaseRef.current
          .from('clubuseraccount')
          .select(`
            *,
            club:clubs(*)
          `)
          .eq('user_id', user.id)
          .eq('user_role', "club_rep")
          .single();

        if (error || !clubUserData) {
          console.log('Club check: User is not a club member');
          setClubState({
            isClub: false,
            club: null,
            clubUser: null,
            userRole: null,
            userId: user.id,
          });
          return;
        }

        console.log('User is a club member:', user.email, 'Role:', clubUserData.user_role);
        setClubState({
          isClub: true,
          club: clubUserData.club as ClubData,
          clubUser: clubUserData as ClubUserData,
          userRole: clubUserData.user_role,
          userId: user.id,
        });
      } catch (error) {
        console.error('Club check error:', error);
        setClubState({
          isClub: false,
          club: null,
          clubUser: null,
          userRole: null,
          userId: user.id,
        });
      }
    }

    checkClub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return { isClub, club, clubUser, userRole, loading: clubLoading };
};

export default useClub;
