import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitStats {
  total_visits: number;
  growth_percentage: number;
  previous_period_visits: number;
}

export const useAppVisits = () => {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('app_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('app_session_id', sessionId);
    }
    return sessionId;
  };

  // Record visit
  const recordVisit = async () => {
    try {
      const sessionId = getSessionId();
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('app_visits' as any).insert({
        session_id: sessionId,
        user_id: user?.id || null,
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
      } as any);
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  };

  // Fetch visit statistics
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_app_visit_stats' as any);
      
      if (error) throw error;
      
      if (data) {
        setStats(data as any);
      }
    } catch (error) {
      console.error('Error fetching visit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Record visit on mount (only once per session per page)
    const visitKey = `visited_${window.location.pathname}`;
    if (!sessionStorage.getItem(visitKey)) {
      recordVisit();
      sessionStorage.setItem(visitKey, 'true');
    }

    // Fetch statistics
    fetchStats();
  }, []);

  return { stats, loading, fetchStats };
};
