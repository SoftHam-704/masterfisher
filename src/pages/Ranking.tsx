import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import Header from "@/components/Header";

interface RankingUser {
    user_id: string;
    total_earned: number;
    level: string;
    profiles: {
        display_name: string | null;
        avatar_url: string | null;
    } | null;
}

const levelEmoji: Record<string, string> = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
    diamond: "💠",
};

const Ranking = () => {
    const [ranking, setRanking] = useState<RankingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        const { data, error } = await supabase
            .from("loyalty_points")
            .select(`
                user_id,
                total_earned,
                level,
                profiles:user_id (display_name, avatar_url)
            `)
            .order("total_earned", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching ranking:", error);
        } else {
            setRanking((data as any) || []);
        }
        setLoading(false);
    };

    const getMedalIcon = (position: number) => {
        if (position === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (position === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (position === 2) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{position + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <section className="pt-24 pb-12 bg-ocean-gradient">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                        Ranking <span className="text-gradient-golden">& Troféus</span>
                    </h1>
                    <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        Os melhores pescadores da comunidade MasterFisher
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-golden" />
                            Top Pescadores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                                ))}
                            </div>
                        ) : ranking.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum pescador no ranking ainda</p>
                                <p className="text-sm">Seja o primeiro a ganhar pontos!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ranking.map((user, index) => (
                                    <div
                                        key={user.user_id}
                                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                                            index === 0 ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" :
                                            index === 1 ? "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800" :
                                            index === 2 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" :
                                            "bg-background"
                                        }`}
                                    >
                                        <div className="flex-shrink-0">
                                            {getMedalIcon(index)}
                                        </div>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                                            {user.profiles?.avatar_url ? (
                                                <img src={user.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.profiles?.display_name?.[0]?.toUpperCase() || "?"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {user.profiles?.display_name || "Pescador Anônimo"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {levelEmoji[user.level] || "🎣"} {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">{(user.total_earned || 0).toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">pontos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Ranking;