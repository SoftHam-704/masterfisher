import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp } from "lucide-react";

interface LoyaltyData {
  points: number;
  total_earned: number;
  level: string;
}

const levelConfig = {
  bronze: { name: 'Bronze', next: 'silver', threshold: 500, color: '#CD7F32', emoji: '🥉' },
  silver: { name: 'Prata', next: 'gold', threshold: 2000, color: '#C0C0C0', emoji: '🥈' },
  gold: { name: 'Ouro', next: 'platinum', threshold: 5000, color: '#FFD700', emoji: '🥇' },
  platinum: { name: 'Platina', next: 'diamond', threshold: 10000, color: '#E5E4E2', emoji: '💎' },
  diamond: { name: 'Diamante', next: null, threshold: Infinity, color: '#B9F2FF', emoji: '💠' },
};

const LoyaltyCard = () => {
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching loyalty data:', error);
      return;
    }

    if (!data) {
      // Create initial loyalty record
      const { data: newData } = await supabase
        .from('loyalty_points')
        .insert({ user_id: user.id })
        .select()
        .single();
      
      setLoyalty(newData);
    } else {
      setLoyalty(data);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyalty) return null;

  const currentLevel = levelConfig[loyalty.level as keyof typeof levelConfig] || levelConfig.bronze;
  const nextThreshold = currentLevel.next 
    ? levelConfig[currentLevel.next as keyof typeof levelConfig].threshold 
    : currentLevel.threshold;
  const progress = currentLevel.next 
    ? (loyalty.total_earned / nextThreshold) * 100 
    : 100;

  return (
    <Card className="border-2" style={{ borderColor: currentLevel.color }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" style={{ color: currentLevel.color }} />
              Programa de Fidelidade
            </CardTitle>
            <CardDescription>
              Ganhe pontos e desbloqueie recompensas
            </CardDescription>
          </div>
          <div className="text-4xl">{currentLevel.emoji}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{(loyalty.points || 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Pontos Disponíveis</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold" style={{ color: currentLevel.color }}>
              {currentLevel.name}
            </p>
            <p className="text-sm text-muted-foreground">Nível Atual</p>
          </div>
        </div>

        {currentLevel.next && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Próximo nível: {levelConfig[currentLevel.next as keyof typeof levelConfig].name}
              </span>
              <span className="font-medium">
                {(loyalty.total_earned || 0).toLocaleString()} / {nextThreshold.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {(loyalty.total_earned || 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Ganho</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {loyalty.level === 'diamond' ? '💎' : '🎯'}
            </p>
            <p className="text-sm text-muted-foreground">
              {loyalty.level === 'diamond' ? 'Nível Máximo!' : 'Continue Pescando!'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyCard;