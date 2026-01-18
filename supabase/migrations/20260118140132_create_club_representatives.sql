-- Create club_representatives table to store club signup data
CREATE TABLE IF NOT EXISTS public.club_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Representative Information
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  
  -- Club Information
  club_name VARCHAR(255) NOT NULL,
  club_email VARCHAR(255) NOT NULL UNIQUE,
  club_website VARCHAR(2048),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' -- pending, verified, rejected
);

-- Create indexes for better query performance
CREATE INDEX idx_club_representatives_user_id ON public.club_representatives(user_id);
CREATE INDEX idx_club_representatives_email ON public.club_representatives(email);
CREATE INDEX idx_club_representatives_club_email ON public.club_representatives(club_email);
CREATE INDEX idx_club_representatives_status ON public.club_representatives(status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.club_representatives ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own club representative record
CREATE POLICY club_reps_select_own ON public.club_representatives
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own record (only once during signup)
CREATE POLICY club_reps_insert_own ON public.club_representatives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own record
CREATE POLICY club_reps_update_own ON public.club_representatives
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all records (you may need to create a role for this)
-- For now, we'll allow service role (used by server-side operations)
CREATE POLICY club_reps_admin_all ON public.club_representatives
  USING (auth.jwt() ->> 'role' = 'service_role');
