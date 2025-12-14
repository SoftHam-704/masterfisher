-- Complete cleanup and recreation of roles system

-- Drop everything related to user_roles
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.has_role CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_supervisor CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create the enum type
CREATE TYPE public.app_role AS ENUM ('supervisor', 'admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create helper function with correct type casting
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Supervisors can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'supervisor'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'supervisor'::app_role));

-- Insert supervisor role for Hamilton
INSERT INTO public.user_roles (user_id, role)
VALUES ('5eca9c00-1105-4497-8bc4-32129d97fa76', 'supervisor'::app_role);