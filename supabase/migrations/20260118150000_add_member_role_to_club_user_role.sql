-- Add 'member' role to club_user_role enum
ALTER TYPE club_user_role ADD VALUE IF NOT EXISTS 'member';
