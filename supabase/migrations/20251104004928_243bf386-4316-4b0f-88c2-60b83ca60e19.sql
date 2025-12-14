-- Fix overly permissive RLS policies for security
-- This migration addresses critical security vulnerabilities identified in the security scan

-- ============================================
-- FIX LOYALTY_POINTS POLICIES
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can manage loyalty points" ON public.loyalty_points;

-- Create secure policies: users can only view their own points, modifications are service-role only
CREATE POLICY "Service role can manage loyalty points"
ON public.loyalty_points FOR ALL
TO service_role
USING (true);

-- ============================================
-- FIX NOTIFICATIONS POLICIES
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Only service role can insert notifications (prevents spam/fake notifications)
CREATE POLICY "Service role can create notifications"
ON public.notifications FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- FIX POINTS_HISTORY POLICIES
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert points history" ON public.points_history;

-- Only service role can insert points history (prevents manipulation)
CREATE POLICY "Service role can insert points history"
ON public.points_history FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- FIX USER_BADGES POLICIES
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can award badges" ON public.user_badges;

-- Only service role can award badges (prevents self-awarding)
CREATE POLICY "Service role can award badges"
ON public.user_badges FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- FIX APP_VISITS POLICIES (if table exists)
-- ============================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'app_visits') THEN
        -- Drop the overly permissive policy if it exists
        DROP POLICY IF EXISTS "Anyone can insert their own visit" ON public.app_visits;
        
        -- Create secure policy: enforce user_id validation or allow anonymous (null) visits
        CREATE POLICY "Users can insert valid visits"
        ON public.app_visits FOR INSERT
        WITH CHECK (user_id IS NULL OR user_id = auth.uid());
    END IF;
END $$;