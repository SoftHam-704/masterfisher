import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Eye, MousePointer } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalyticsSummary {
  partner_name: string;
  total_views: number;
  total_clicks: number;
  ctr: number;
}

interface DailyStats {
  date: string;
  views: number;
  clicks: number;
}

const SponsorDashboard = () => {
  const [summary, setSummary] = useState<AnalyticsSummary[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSponsorRole, setHasSponsorRole] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    checkSponsorRole();
    fetchAnalytics();
  }, []);

  const checkSponsorRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_roles' as any)
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['sponsor', 'admin'])
      .maybeSingle();

    setHasSponsorRole(!!data);
  };

  const fetchAnalytics = async () => {
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

    // Fetch summary by partner
    const { data: summaryData } = await supabase
      .from('sponsor_analytics' as any)
      .select('partner_name, event_type')
      .gte('created_at', thirtyDaysAgo);

    if (summaryData) {
      const grouped = (summaryData as any[]).reduce((acc: any, item: any) => {
        if (!acc[item.partner_name]) {
          acc[item.partner_name] = { views: 0, clicks: 0 };
        }
        if (item.event_type === 'view') acc[item.partner_name].views++;
        if (item.event_type === 'click') acc[item.partner_name].clicks++;
        return acc;
      }, {});

      const summaryArray: AnalyticsSummary[] = Object.entries(grouped).map(([name, stats]: any) => ({
        partner_name: name,
        total_views: stats.views,
        total_clicks: stats.clicks,
        ctr: stats.views > 0 ? parseFloat(((stats.clicks / stats.views) * 100).toFixed(2)) : 0
      }));

      setSummary(summaryArray);
    }

    // Fetch daily stats
    const { data: dailyData } = await supabase
      .from('sponsor_analytics' as any)
      .select('created_at, event_type')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    if (dailyData) {
      const dailyGrouped = (dailyData as any[]).reduce((acc: any, item: any) => {
        const date = format(new Date(item.created_at), 'dd/MM', { locale: ptBR });
        if (!acc[date]) {
          acc[date] = { views: 0, clicks: 0 };
        }
        if (item.event_type === 'view') acc[date].views++;
        if (item.event_type === 'click') acc[date].clicks++;
        return acc;
      }, {});

      const dailyArray: DailyStats[] = Object.entries(dailyGrouped).map(([date, stats]: any) => ({
        date,
        views: stats.views,
        clicks: stats.clicks
      }));

      setDailyStats(dailyArray.slice(-14)); // Last 14 days
    }

    setLoading(false);
  };

  if (!hasSponsorRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Este dashboard é exclusivo para patrocinadores
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/3" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = summary.reduce((acc, item) => acc + item.total_views, 0);
  const totalClicks = summary.reduce((acc, item) => acc + item.total_clicks, 0);
  const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-ocean text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Dashboard de Patrocinadores</h1>
          </div>
          <p className="text-lg opacity-90">
            Acompanhe o desempenho das suas campanhas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5" />
                Total de Visualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MousePointer className="h-5 w-5" />
                Total de Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Taxa de Cliques (CTR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{avgCTR}%</p>
              <p className="text-sm text-muted-foreground">Média geral</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="partners">
          <TabsList>
            <TabsTrigger value="partners">Por Parceiro</TabsTrigger>
            <TabsTrigger value="daily">Diário</TabsTrigger>
          </TabsList>

          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Parceiro</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{item.partner_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.total_views} visualizações • {item.total_clicks} cliques
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{item.ctr}%</p>
                        <p className="text-xs text-muted-foreground">CTR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Diárias</CardTitle>
                <CardDescription>Últimos 14 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyStats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{stat.date}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {stat.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-4 w-4" />
                          {stat.clicks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SponsorDashboard;