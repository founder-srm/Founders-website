import { create } from 'zustand';
import type { Database } from '../../database.types';

type ClubUserRole = Database['public']['Enums']['club_user_role'];

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

interface UserRolesState {
  // Admin state
  isAdmin: boolean;
  adminLoading: boolean;
  adminFetchedForUserId: string | null;

  // Club state
  isClub: boolean;
  club: ClubData | null;
  clubUser: ClubUserData | null;
  userRole: ClubUserRole | null;
  clubLoading: boolean;
  clubFetchedForUserId: string | null;

  // Actions
  setAdminState: (isAdmin: boolean, userId: string | null) => void;
  setAdminLoading: (loading: boolean) => void;
  setClubState: (data: {
    isClub: boolean;
    club: ClubData | null;
    clubUser: ClubUserData | null;
    userRole: ClubUserRole | null;
    userId: string | null;
  }) => void;
  setClubLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserRolesStore = create<UserRolesState>()(set => ({
  // Admin initial state
  isAdmin: false,
  adminLoading: true,
  adminFetchedForUserId: null,

  // Club initial state
  isClub: false,
  club: null,
  clubUser: null,
  userRole: null,
  clubLoading: true,
  clubFetchedForUserId: null,

  // Actions
  setAdminState: (isAdmin, userId) =>
    set({
      isAdmin,
      adminFetchedForUserId: userId,
      adminLoading: false,
    }),
  setAdminLoading: loading => set({ adminLoading: loading }),
  setClubState: ({ isClub, club, clubUser, userRole, userId }) =>
    set({
      isClub,
      club,
      clubUser,
      userRole,
      clubFetchedForUserId: userId,
      clubLoading: false,
    }),
  setClubLoading: loading => set({ clubLoading: loading }),
  reset: () =>
    set({
      isAdmin: false,
      adminLoading: true,
      adminFetchedForUserId: null,
      isClub: false,
      club: null,
      clubUser: null,
      userRole: null,
      clubLoading: true,
      clubFetchedForUserId: null,
    }),
}));
