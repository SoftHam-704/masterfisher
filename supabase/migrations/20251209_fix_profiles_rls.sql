-- Fix RLS policies for profiles table
-- Allow users to update their own profiles

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate policy with correct permissions
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure users can also read their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Keep public profiles viewable by everyone
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);
