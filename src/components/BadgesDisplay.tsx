import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
  badge: BadgeData;
}

const BadgesDisplay = () => {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all badges
    const { data: badges } = await supabase
      .from('badges')
      .select('*')
      .order('requirement', { ascending: true });

    // Fetch user's earned badges
    const { data: earned } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        earned_at,
        badge:badges(*)
      `)
      .eq('user_id', user.id);

    setAllBadges(badges || []);
    setUserBadges(earned as UserBadge[] || []);
    setLoading(false);
  };

  const hasBadge = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Conquistas
        </CardTitle>
        <CardDescription>
          {userBadges.length} de {allBadges.length} desbloqueadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const earned = hasBadge(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  earned
                    ? 'bg-primary/5 border-primary shadow-md'
                    : 'bg-muted/50 border-muted opacity-50 grayscale'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">{badge.icon}</div>
                  <h4 className="font-semibold text-sm">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                  {earned && (
                    <Badge variant="outline" className="text-xs">
                      Conquistado! ✨
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesDisplay;