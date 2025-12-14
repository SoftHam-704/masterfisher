-- Clean up remaining overly permissive RLS policies

-- Drop the remaining permissive policy on loyalty_points
DROP POLICY IF EXISTS "System can manage points" ON public.loyalty_points;

-- Drop the remaining permissive policy on points_history  
DROP POLICY IF EXISTS "System can create history" ON public.points_history;