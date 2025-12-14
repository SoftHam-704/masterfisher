import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  discount_percentage: number | null;
}

const RewardsShop = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch rewards
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*')
      .eq('active', true)
      .order('points_required', { ascending: true });

    // Fetch user points
    const { data: loyaltyData } = await supabase
      .from('loyalty_points')
      .select('points')
      .eq('user_id', user.id)
      .single();

    setRewards(rewardsData || []);
    setUserPoints(loyaltyData?.points || 0);
    setLoading(false);
  };

  const redeemReward = async (reward: Reward) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (userPoints < reward.points_required) {
      toast({
        title: "Pontos insuficientes",
        description: `Você precisa de ${reward.points_required - userPoints} pontos a mais`,
        variant: "destructive",
      });
      return;
    }

    // Deduct points
    const { error: updateError } = await supabase
      .from('loyalty_points')
      .update({ 
        points: userPoints - reward.points_required 
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error redeeming reward:', updateError);
      toast({
        title: "Erro",
        description: "Não foi possível resgatar a recompensa",
        variant: "destructive",
      });
      return;
    }

    // Add to history
    await supabase.from('points_history').insert({
      user_id: user.id,
      points: -reward.points_required,
      action: 'reward_redeemed',
      description: `Resgatou: ${reward.title}`
    });

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Recompensa Resgatada! 🎁',
      message: `Você resgatou: ${reward.title}`,
      type: 'promotion'
    });

    toast({
      title: "Recompensa Resgatada! 🎉",
      description: reward.title,
    });

    fetchData();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded" />
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
          <Gift className="h-5 w-5" />
          Loja de Recompensas
        </CardTitle>
        <CardDescription>
          Troque seus pontos por descontos e benefícios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-ocean rounded-lg p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Seus Pontos</p>
              <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
            </div>
            <Sparkles className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="space-y-3">
          {rewards.map((reward) => {
            const canAfford = userPoints >= reward.points_required;
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  canAfford
                    ? 'border-primary bg-primary/5'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{reward.title}</h4>
                      {reward.discount_percentage === 100 && (
                        <Badge variant="secondary" className="text-xs">
                          PREMIUM
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reward.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {reward.points_required.toLocaleString()} pontos
                    </p>
                  </div>
                  <Button
                    onClick={() => redeemReward(reward)}
                    disabled={!canAfford}
                    size="sm"
                  >
                    {canAfford ? 'Resgatar' : 'Bloqueado'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsShop;